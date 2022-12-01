package net.csibio.injection.core.controller;

import com.alibaba.excel.support.ExcelTypeEnum;
import com.alibaba.excel.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.constants.enums.*;
import net.csibio.injection.client.domain.Result;
import net.csibio.injection.client.domain.db.*;
import net.csibio.injection.client.domain.query.BatchQuery;
import net.csibio.injection.client.domain.query.MSOrderQuery;
import net.csibio.injection.client.domain.query.MSRunQuery;
import net.csibio.injection.client.domain.query.SamplePositionQuery;
import net.csibio.injection.client.domain.vo.msOrder.*;
import net.csibio.injection.client.domain.vo.order.MSOrderAddVO;
import net.csibio.injection.client.domain.vo.order.MSOrderUpdateVO;
import net.csibio.injection.client.service.*;
import net.csibio.injection.core.excel.MSOrderExpowerExcelManager;
import net.csibio.injection.core.excel.MSOrderHFXExcelManager;
import net.csibio.injection.core.excel.MSOrderSCIEXExcelManager;
import net.csibio.injection.core.utils.DateUtil;
import net.csibio.injection.core.utils.ForEachUtils;
import net.csibio.injection.core.validate.MSOrderValidate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static net.csibio.injection.client.utils.CommonUtil.checkIsNotNull;
import static net.csibio.injection.core.utils.DateUtil.parseDateToStr;

@RestController
@RequestMapping("msOrder")
@Slf4j
public class MSOrderController extends BaseController<MSOrderDO, MSOrderQuery> {

    @Autowired
    private IMSOrderService msOrderService;

    @Resource
    MSOrderValidate msOrderValidate;

    @Resource
    private IPreOrderService preOrderService;

    @Resource
    private IProjectService projectService;

    @Resource
    private ISampleService sampleService;

    @Resource
    private IBoardService boardService;

    @Resource
    private ISamplePositionService samplePositionService;

    @Resource
    private IMSRunSampleService msRunSampleService;

    @Resource
    MSOrderExpowerExcelManager msOrderExpowerExcelManager;

    @Resource
    MSOrderHFXExcelManager msOrderHFXExcelManager;

    @Resource
    MSOrderSCIEXExcelManager msOrderSCIEXExcelManager;

    @Resource
    IBatchService batchService;

    @Override
    BaseService<MSOrderDO, MSOrderQuery> getBaseService() {
        return msOrderService;
    }

    /**
     * 创建质谱工单
     *
     * @param msOrderAdd
     * @return
     */
    @PostMapping(value = "/add")
    Result manualAdd(@RequestBody MSOrderAddVO msOrderAdd) {
        msOrderValidate.checkMSOrderAdd(msOrderAdd);
        MSOrderDO msOrderDO = buildMSOrderDO(msOrderAdd);
        Result result = msOrderService.insert(msOrderDO);
        if (result.isFailed()) {
            return Result.Error("质谱工单初始化失败");
        }
        try {
            // 生成批次信息
            batchService.insert(buildBatchDO(msOrderDO));

            // 生成进样规则
            List<MSRunDO> msRunDOList = msRunSampleService.getRunOrder(msOrderDO);
            msRunSampleService.insert(msRunDOList);

            // 更新进样状态
            msOrderDO.setRunSampleStatus(MSOrderRunStatus.COLLECT.getCode());
            msOrderService.update(msOrderDO);
        } catch (Exception e) {
            // 回滚
            msOrderDO.setStatus(MSOrderStatus.INVALID.getCode());
            log.error("质谱工单生成失败, errorMsg:", e);
            msOrderService.update(msOrderDO);
            return Result.Error("质谱工单生成失败");
        }
        return Result.OK();
    }

    private List<BatchDO> buildBatchDO(MSOrderDO msOrderDO) {
        List<BatchDO> res = msOrderDO.getRunBoardList().stream().map(boardId->{
            BoardDO boardDO = boardService.getById(boardId);
            return BatchDO.builder()
                    .msOrderId(msOrderDO.getId())
                    .boardId(boardId)
                    .status(BatchStatus.COLLECT.getCode())
                    .batchNo(boardDO.getBoardNo())
                    .build();
        }).collect(Collectors.toList());

        return res;
    }

    /**
     * 查询质谱工单列表
     *
     * @param query
     * @return
     */
    @GetMapping(value = "list")
    Result list(MSOrderQuery query) {
        // 按创建时间倒排
        query.setOrderBy(Sort.Direction.DESC);
        query.setSortColumn("createDate");
        query.setStatus(MSOrderStatus.VALID.getCode());
        return msOrderService.getList(query);
    }

    /**
     * 查询工单内容
     *
     * @param query
     * @return
     */
    @GetMapping(value = "orderList")
    Result orderList(MSOrderQuery query) {
        String msOrderId = query.getId();
        checkIsNotNull(msOrderId, ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        MSOrderDO msOrderDO = msOrderService.getById(msOrderId);
        checkIsNotNull(msOrderDO, ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        // 先查sampleId
        MSRunQuery msRunQuery = new MSRunQuery();
        msRunQuery.setMsOrderId(query.getId());
        List<MSRunDO> msRunDOList = msRunSampleService.getAll(msRunQuery);

        List<MsOrderDataVO> res = msRunDOList.stream().map(msRunDO -> {
            MsOrderDataVO msOrderDataVO = new MsOrderDataVO();
            String sampleId = msRunDO.getSampleId();
            if (sampleId.contains("rerun") || sampleId.contains("linearity") || sampleId.contains("BLK") || sampleId.contains("MIX") || sampleId.contains("REF")) {
                msOrderDataVO.setSampleNo(sampleId);
            } else {
                SampleDO sampleDO = sampleService.getById(sampleId);
                if (sampleDO != null) {
                    msOrderDataVO.setSampleNo(sampleDO.getSampleNo());
                    msOrderDataVO.setDim1(sampleDO.getDim1());
                    msOrderDataVO.setDim2(sampleDO.getDim2());
                    msOrderDataVO.setDim3(sampleDO.getDim3());
                } else {
                    log.info("sampleId: {}", sampleId);
                }
            }
            msOrderDataVO.setDevice(msOrderDO.getDevice());
            msOrderDataVO.setInjectionOrder(msRunDO.getInjectionOrder().toString());
            msOrderDataVO.setBoardIndex(msRunDO.getBoardIndex());
            msOrderDataVO.setBoardNo(msRunDO.getBoardNo());
            msOrderDataVO.setInjectionPosition(msRunDO.getInjectionPosition());
            msOrderDataVO.setPlatform(msOrderDO.getPlatform());
            msOrderDataVO.setSampleType(msRunDO.getSampleType());
            return msOrderDataVO;
        }).collect(Collectors.toList());
        return Result.OK(res);
    }

    /**
     * 更新工单内容
     *
     * @param msOrderUpdateVO
     * @return
     */
    @RequestMapping(value = "/update")
    Result update(MSOrderUpdateVO msOrderUpdateVO) {
        checkIsNotNull(msOrderUpdateVO.getId(), ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        MSOrderDO order = msOrderService.getById(msOrderUpdateVO.getId());
        checkIsNotNull(order, ResultCode.PRE_ORDER_IS_EMPTY);
        BeanUtils.copyProperties(msOrderUpdateVO, order);
        return msOrderService.update(order);
    }

    /**
     * 删除工单
     *
     * @param orderId
     * @return
     */
    @RequestMapping(value = "/delete")
    Result delete(@RequestParam(value = "id", required = true) String orderId) {
        MSOrderDO order = msOrderService.getById(orderId);
        checkIsNotNull(order, ResultCode.PRE_ORDER_IS_EMPTY);

        order.setStatus(MSOrderStatus.INVALID.getCode());
        return msOrderService.update(order);
    }

    /**
     * 色谱工单导出
     */
    @GetMapping(value = "/exportMC")
    Result exportEmpower(HttpServletResponse response, @RequestParam(value = "id", required = true) String msOrderId) throws Exception {
        checkIsNotNull(msOrderId, ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        MSOrderDO msOrderDO = msOrderService.getById(msOrderId);
        checkIsNotNull(msOrderDO, ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);

        if (!msOrderDO.getDevice().equals(DeviceType.HFX_2.getMessage()) && !msOrderDO.getDevice().equals(DeviceType.HFX_1.getMessage())) {
            return Result.Error("仅HFX设备开放色谱工单导出");
        }

        MSRunQuery msRunQuery = new MSRunQuery();
        msRunQuery.setMsOrderId(msOrderId);
        List<MSRunDO> msRunDOList = msRunSampleService.getAll(msRunQuery);
        List<MsOrderEmpowerExcelVO> msOrderEmpowerExcelVOList = new ArrayList<>();

        ForEachUtils.forEach(msRunDOList, (index, msRunDO) -> {
            int i = (index % 2 == 0 ? 1 : 2);
            MsOrderEmpowerExcelVO msOrderEmpowerExcelVO = new MsOrderEmpowerExcelVO();
            // HFX-1 HFX-2 有两块进样板
            if (msRunDO.getSampleId().contains("rerun") || msRunDO.getSampleId().contains("linearity")) {
                msOrderEmpowerExcelVO.setPlate(String.format("%s", msRunDO.getInjectionPosition()));

            } else {
                msOrderEmpowerExcelVO.setPlate(String.format("%s:%s", msRunDO.getPlatePos(), msRunDO.getInjectionPosition()));
            }
            if (Objects.equals(msOrderDO.getDevice(), DeviceType.GCMS_1.getMessage())) {
                msOrderEmpowerExcelVO.setVolume("1");
            } else {
                msOrderEmpowerExcelVO.setVolume("5");
            }
            msOrderEmpowerExcelVO.setInjs("1");
            msOrderEmpowerExcelVO.setSampleName(msRunDO.getFileName());
            msOrderEmpowerExcelVO.setFunction("Inject Samples");
            msOrderEmpowerExcelVO.setExportMethod(String.format("%s_position%s", msOrderDO.getDevice(), i));
            msOrderEmpowerExcelVO.setProcessing("Normal");
            msOrderEmpowerExcelVO.setRunTime("13");
            msOrderEmpowerExcelVO.setSampleWeight("1");
            msOrderEmpowerExcelVO.setDilution("1");
            msOrderEmpowerExcelVOList.add(msOrderEmpowerExcelVO);
        });
        // 输出expower格式的液相工单
        msOrderExpowerExcelManager.exportExcel(response, msOrderEmpowerExcelVOList, msOrderDO.getName(), ExcelTypeEnum.CSV);
        return Result.OK();
    }


    /**
     * 质谱工单导出
     */
    @GetMapping(value = "/exportLc")
    void exportLc(HttpServletResponse response, @RequestParam(value = "id", required = true) String msOrderId) throws Exception {
        checkIsNotNull(msOrderId, ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        MSOrderDO msOrderDO = msOrderService.getById(msOrderId);
        checkIsNotNull(msOrderDO, ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);

        MSRunQuery msRunQuery = new MSRunQuery();
        msRunQuery.setMsOrderId(msOrderId);
        List<MSRunDO> msRunDOList = msRunSampleService.getAll(msRunQuery);
        if (msOrderDO.getDevice().equals(DeviceType.AB6500.getMessage())) {
            List<MsOrderABSCIEXExcelVO> msOrderABSCIEXExcelVOList = msRunDOList.stream().map(msRunDO -> {
                MsOrderABSCIEXExcelVO msOrderABSCIEXExcelVO = new MsOrderABSCIEXExcelVO();
                msOrderABSCIEXExcelVO.setSampleName(msRunDO.getFileName());
                msOrderABSCIEXExcelVO.setSampleId(String.format("%s_%s", msRunDO.getBoardIndex(), msRunDO.getInjectionOrder()));
                // 方法文件
                msOrderABSCIEXExcelVO.setAcqMethod(msRunDO.getMathFilePath() != null ? msRunDO.getMathFilePath() : msOrderDO.getPlatform());
                msOrderABSCIEXExcelVO.setProcMethodRackCode("none");
                if (msOrderDO.getRunSampleMethod().equals(BoardType.NINETY_SIX.getMessage())) {
                    msOrderABSCIEXExcelVO.setRackCode("MTP 96 Cooled");
                    msOrderABSCIEXExcelVO.setPlateCode("MTP 96 Cooled");
                }
                if (msOrderDO.getRunSampleMethod().equals(BoardType.RUN_SAMPLE_BOARD.getMessage())) {
                    msOrderABSCIEXExcelVO.setRackCode("1.5 mL 105 vials");
                    msOrderABSCIEXExcelVO.setPlateCode("1.5 mL 105 vials");
                }

                msOrderABSCIEXExcelVO.setVialPos(msRunDO.getInjectionPosition());
                msOrderABSCIEXExcelVO.setSmplInjVol("1");
                msOrderABSCIEXExcelVO.setDilutFact("1");
                msOrderABSCIEXExcelVO.setWghtToVol("0");
                msOrderABSCIEXExcelVO.setRackPos("1");
                msOrderABSCIEXExcelVO.setType("Unknown");
                msOrderABSCIEXExcelVO.setPlatePos(msRunDO.getPlatePos());
                msOrderABSCIEXExcelVO.setOutputFile(String.format("%s\\batch%s", msOrderDO.getPlatform(), msRunDO.getBoardIndex()));
                return msOrderABSCIEXExcelVO;
            }).collect(Collectors.toList());
            msOrderSCIEXExcelManager.exportExcel(response, msOrderABSCIEXExcelVOList, msOrderDO.getName(), ExcelTypeEnum.CSV);
            return;
        }

        if (msOrderDO.getDevice().equals("HFX-1") || msOrderDO.getDevice().equals("HFX-2") || msOrderDO.getDevice().equals("HF") || msOrderDO.getDevice().equals("GCMS-1") || msOrderDO.getDevice().equals("GCMS-2")) {
            List<MsOrderHSXExcelVO> list1 = msRunDOList.stream().map(msRunDO -> {
                ProjectDO projectDO = projectService.getById(msOrderDO.getProjectId());
                MsOrderHSXExcelVO msOrderHSXExcelVO = new MsOrderHSXExcelVO();
                msOrderHSXExcelVO.setSampleType("Unknown");
                msOrderHSXExcelVO.setFileName(msRunDO.getFileName());
                msOrderHSXExcelVO.setSampleId(String.format("%s_%s", msRunDO.getBoardIndex(), msRunDO.getInjectionOrder()));
                msOrderHSXExcelVO.setPath(String.format("D:\\%s\\%s\\batch%s", projectDO.getName(), msOrderDO.getPlatform(), msRunDO.getBoardIndex()));

                // 方法文件
                String defaultMethodFile = String.format("D:\\method\\%s", msOrderDO.getPlatform());
                msOrderHSXExcelVO.setInstrumentMethod(msRunDO.getMathFilePath() != null ? msRunDO.getMathFilePath() : defaultMethodFile);

                // HFX-1 HFX-2 有两块进样板
                if (msRunDO.getSampleId().contains("rerun") || msRunDO.getSampleId().contains("linearity")) {
                    msOrderHSXExcelVO.setPosition(String.format("%s", msRunDO.getInjectionPosition()));
                    msOrderHSXExcelVO.setSampleName(String.format("%s", msRunDO.getSampleBoardIndex()));
                } else {
                    msOrderHSXExcelVO.setPosition(String.format("%s:%s", msRunDO.getPlatePos(), msRunDO.getInjectionPosition()));
                    msOrderHSXExcelVO.setSampleName(String.format("%s_%s", msRunDO.getBoardIndex(), msRunDO.getSampleBoardIndex()));
                }

                if (Objects.equals(msOrderDO.getDevice(), DeviceType.GCMS_1.getMessage())) {
                    msOrderHSXExcelVO.setInjVol("1");
                } else {
                    msOrderHSXExcelVO.setInjVol("5");
                }
                msOrderHSXExcelVO.setSampleName(String.format("%s_%s", msRunDO.getBoardIndex(), msRunDO.getSampleBoardIndex()));

                return msOrderHSXExcelVO;
            }).collect(Collectors.toList());
            msOrderHFXExcelManager.exportExcel(response, list1, msOrderDO.getName(), "static/static/test.xls", ExcelTypeEnum.XLS);
        }
    }

    /**
     * 质谱文件转换
     *
     * @param
     * @return
     */
    @GetMapping(value = "/msFileList")
    Result getMsFileList(MSOrderQuery query) {
        //质谱工单名称  //批次名称  //文件名称  // 修改时间  //状态
        checkIsNotNull(query.getProjectId(), ResultCode.MS_ORDER_PROJECT_ID_CANNOT_BE_EMPTY);

        Result<List<MSOrderDO>> msOrderList = msOrderService.getList(query);
        List<MsFileVO> res = new ArrayList<>();
        msOrderList.getData().forEach(msOrderDO -> {
            String orderName = msOrderDO.getName();
//            List<String> boardList = msOrderDO.getRunBoardList();
            BatchQuery batchQuery = new BatchQuery();
            batchQuery.setMsOrderId(msOrderDO.getId());
            List<BatchDO> batchDOList = batchService.getAll(batchQuery);
            batchDOList.forEach(batchDO -> {
                // 查询批次的状态
                BoardDO boardDO = boardService.getById(batchDO.getBoardId());
                MsFileVO msFileVO = new MsFileVO();
                msFileVO.setMsOrderName(orderName);
                msFileVO.setOrderId(msOrderDO.getId());
                msFileVO.setCreateDate(msOrderDO.getCreateDate());
                msFileVO.setBoardNo(boardDO.getBoardNo());
                msFileVO.setStatus(batchDO.getStatus());
                res.add(msFileVO);
            });
        });
        return Result.OK(res);
    }

    /**
     * 查询质谱工单的批次信息
     * @param msOrderName
     * @return
     */
    @GetMapping(value = "/getMsOrderBatch")
    Result getMsOrderBatch(@RequestParam(value = "msOrderName", required = true) String msOrderName) {
        if (StringUtils.isBlank(msOrderName)) {
            return Result.OK(null);
        }
        MSOrderDO msOrderDO = msOrderService.getByName(msOrderName);
        checkIsNotNull(msOrderDO, ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);

        // 查询工单下的批次信息
        List<String> runBoardList = msOrderDO.getRunBoardList();
        List<MsOrderBatchVO> msOrderBatchVOList = runBoardList.stream().map(boardId -> {
            MsOrderBatchVO msOrderBatchVO = new MsOrderBatchVO();
            BoardDO boardDO = boardService.getById(boardId);
            msOrderBatchVO.setBatchName(String.format("%s%s%s", "第", boardDO.getBoardNo(), "号板"));

            BatchQuery batchQuery = new BatchQuery();
            batchQuery.setMsOrderId(msOrderDO.getId());
            batchQuery.setBatchNo(boardDO.getBoardNo());
            List<BatchDO> all = batchService.getAll(batchQuery);

            msOrderBatchVO.setConvertStatus(String.valueOf(all.get(0).getStatus()));
            msOrderBatchVO.setBatchId(boardDO.getId());

            SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
            samplePositionQuery.setBoardId(boardId);
            samplePositionQuery.setIsWhiteList(false);
            long count = samplePositionService.count(samplePositionQuery);
            msOrderBatchVO.setBatchSize(count);
            return msOrderBatchVO;
        }).collect(Collectors.toList());
        return Result.OK(msOrderBatchVOList);
    }

    /**
     * 查询板子id对应的进样
     * @param
     * @return
     */
    @GetMapping(value = "/getMsOrderBatchSample")
    Result getMsOrderBatch(@RequestParam(value = "msOrderName", required = true) String msOrderName, @RequestParam(value = "boardId", required = true) String boardId) {
        BoardDO boardDO = boardService.getById(boardId);
        checkIsNotNull(boardDO, ResultCode.BATCH_IS_EMPTY);
        // 查询板子对应的进样id
        MSOrderDO msOrderDO = msOrderService.getByName(msOrderName);
        checkIsNotNull(boardDO, ResultCode.MS_ORDER_ID_CANNOT_BE_EMPTY);
        MSRunQuery msRunQuery = new MSRunQuery();
        msRunQuery.setMsOrderId(msOrderDO.getId());
        msRunQuery.setBoardIndex(boardDO.getBoardIndex());
        List<MSRunDO> all = msRunSampleService.getAll(msRunQuery).stream().filter(msRunDO -> {
            return StringUtils.isNotBlank(msRunDO.getSampleNo());
        }).collect(Collectors.toList());
        return Result.OK(all);
    }

    private MSOrderDO buildMSOrderDO(MSOrderAddVO msOrderAddVO) {
        List<String> runBoardList = msOrderAddVO.getIncomingSamData();
        String runSampleMethod = msOrderAddVO.getSpecSampMethod().get(2);
        String deviceName = msOrderAddVO.getSpecSampMethod().get(0);
        String platformName = msOrderAddVO.getSpecSampMethod().get(1);
        return MSOrderDO.builder()
                .name(String.format("%s_%s_%s_%s", deviceName, platformName, runSampleMethod, parseDateToStr(new Date(), DateUtil.DATE_TIME_FORMAT_YYYYMMDDHHMISS)))
                .device(deviceName)
                .runSampleMethod(runSampleMethod)
                .runBoardList(runBoardList)
                .platform(platformName)
                .preHeartData(msOrderAddVO.getPreHeartData())
                .workCurve(msOrderAddVO.getWorkCurveData())
                .owner(msOrderAddVO.getOwner())
                .status(MSOrderStatus.VALID.getCode())
                .runSampleStatus(MSOrderRunStatus.INIT.getCode())
                .projectId(msOrderAddVO.getProjectId())
                .colorSpectrumCode(msOrderAddVO.getColorSpectrumCode())
                .build();
    }
}

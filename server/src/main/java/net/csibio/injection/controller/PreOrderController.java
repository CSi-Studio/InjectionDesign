package net.csibio.injection.controller;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.constants.enums.*;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.vo.sample.SamplePositionVO;
import net.csibio.injection.excel.PreOrderExcelManager;
import net.csibio.injection.excel.SampleExcelManager;
import net.csibio.injection.utils.DateUtil;
import net.csibio.injection.validate.PreOrderValidate;
import net.csibio.injection.domain.db.*;
import net.csibio.injection.domain.query.*;
import net.csibio.injection.domain.vo.SampleLocation.BoardSampleListVO;
import net.csibio.injection.domain.vo.SampleLocation.SampleBoardLocationVO;
import net.csibio.injection.domain.vo.SampleLocation.SampleLocationExcelVO;
import net.csibio.injection.domain.vo.order.*;
import net.csibio.injection.service.*;
import net.csibio.injection.utils.CommonUtil;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.compress.utils.Lists;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import static net.csibio.injection.constants.Constants.SINGLE_BOARD_SAMPLE_SIZE;
import static net.csibio.injection.utils.DateUtil.parseDateToStr;

/**
 * 前处理工单controller
 */
@RestController
@RequestMapping("preorder")
@Slf4j
public class PreOrderController extends BaseController<PreOrderDO, PreOrderQuery> {

    @Autowired
    private IPreOrderService preOrderService;

    @Resource
    private PreOrderValidate preOrderValidate;

    @Resource
    private IProjectService projectService;

    @Resource
    private ISampleService sampleService;

    @Resource
    private ISamplePositionService samplePositionService;

    @Resource
    private IBoardService boardService;

    @Resource
    private PreOrderExcelManager preOrderExcelManager;

    @Resource
    private SampleExcelManager sampleExcelManager;

    @Override
    BaseService<PreOrderDO, PreOrderQuery> getBaseService() {
        return preOrderService;
    }

    /**
     * 新增前处理工单 根据类型选择需要多少块板，同时为每个sampleId分配对应板子的位置 人工录入，采取先建工单后续跟进录入的方式
     * 样本勾选与excel表导入采用建立工单的同时完成sampleId的分配
     *
     * @param orderAdd
     * @return
     */
    @PostMapping(value = "/add")
    Result orderAdd(PreOrderAddVO orderAdd) {
        preOrderValidate.checkPreOrderAdd(orderAdd);
        PreOrderDO preOrderDO = buildOrderAddDO(orderAdd);
        Result result = preOrderService.insert(preOrderDO);
        if (result.isFailed()) {
            return Result.Error("工单初始化失败");
        }
        try {
            int sampleTotal = 0;
            List<String> sampleIdList = Lists.newArrayList();
            // 获取样本总量，生成样本板信息
            if (Objects.equals(orderAdd.getSaveType(), SampleSaveType.MANUAL_ADD.getCode())) {
                sampleTotal = orderAdd.getSampleTotal();
            }
            if (Objects.equals(orderAdd.getSaveType(), SampleSaveType.SAMPLE_SELECT.getCode())) {
                sampleTotal = orderAdd.getSampleList().size();
                sampleIdList.addAll(orderAdd.getSampleList());
            }
            if (Objects.equals(orderAdd.getSaveType(), SampleSaveType.EXCEL_UPLOAD.getCode())) {
                sampleExcelManager.importExcel(orderAdd.getFile(), (vo) -> {
                    preOrderService.saveBatchWithExcelVO(vo, preOrderDO.getProjectId(), sampleIdList);
                });
                sampleTotal = sampleIdList.size();
            }

            // 写入样本板信息 ,若人工录入时需要考虑优先级的问题
            int boardTotal = 0;
            if (orderAdd.getWhiteExcelFile() == null) {
                boardTotal = (int) Math.ceil((double) sampleTotal / SINGLE_BOARD_SAMPLE_SIZE);
                for (int boardIdx = 1; boardIdx <= boardTotal; boardIdx++) {
                    boardService.insert(buildOrderBoardDO(boardIdx, preOrderDO, null));
                }
            }

            // 人工录入走异步录入流程, 非人工录入直接按样本随机分配样本位置
            if (!Objects.equals(preOrderDO.getSaveType(), SampleSaveType.MANUAL_ADD.getCode())) {
                List<SampleBoardLocationVO> sampleBoardLocationVOList = samplePositionService.getSampleBoardLoc(
                        sampleIdList, boardTotal);
                // 记录板子信息，同时记录样本信息
                List<SamplePositionDO> samplePositionDOList = buildSamplePositionDO(
                        sampleBoardLocationVOList, preOrderDO);
                // 记录样本位置信息
                samplePositionService.insert(samplePositionDOList);
                // 更新order
                preOrderDO.setSampleList(sampleIdList);
                preOrderDO.setSampleTotal(sampleIdList.size());
                preOrderDO.setSampleSize(sampleIdList.size());
                preOrderService.update(preOrderDO);
            }
        } catch (Exception e) {
            // 首先回滚样本位置信息, 再回滚板号, 最后回滚工单
            SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
            samplePositionQuery.setPreOrderId(preOrderDO.getId());
            samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
            List<SamplePositionDO> samplePositionDOList = samplePositionService.getAll(
                    samplePositionQuery);
            if (CollectionUtils.isNotEmpty(samplePositionDOList)) {
                samplePositionDOList.forEach(samplePositionDO -> {
                    samplePositionDO.setStatus(SamplePositionStatus.INVALID.getCode());
                    samplePositionService.update(samplePositionDO);
                });
            }

            // 回滚板号
            BoardQuery boardQuery = new BoardQuery();
            boardQuery.setPreOrderId(preOrderDO.getId());
            boardQuery.setStatus(BoardStatus.VALID.getCode());
            List<BoardDO> boardDOList = boardService.getAll(boardQuery);
            boardDOList.forEach(boardDO -> {
                boardDO.setStatus(BoardStatus.INVALID.getCode());
                boardService.update(boardDO);
            });

            // 回滚工单
            preOrderDO.setStatus(PreOrderStatus.INVALID.getCode());
            preOrderService.update(preOrderDO);
            log.error("前处理工单失败, errorMsg:", e);
            return Result.Error("前处理工单生成失败");
        }
        return Result.OK();
    }

    /**
     * 批量删除前处理工单样本
     */
    @GetMapping(value = "/removeSample")
    Result removeSample(PreOrderRemoveSampleVO removeSampleVO) {
        // 从前处理工单中删除
        PreOrderDO preOrderDO = preOrderService.getById(removeSampleVO.getPreOrderId());
        CommonUtil.checkIsNotNull(preOrderDO, ResultCode.PRE_ORDER_IS_EMPTY);

        List<String> sampleNoList = removeSampleVO.getSampleNoList();
        List<String> batchSampleList = sampleNoList.stream().map(sampleNo -> {
            String newSampleNO = sampleNo.split("_")[0];
            SampleDO serviceBySampleNo = sampleService.getBySampleNo(newSampleNO,
                    preOrderDO.getProjectId());
            return serviceBySampleNo.getId();
        }).toList();

        // 删除工单里的位置
        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
        samplePositionQuery.setPreOrderId(preOrderDO.getId());
        samplePositionQuery.setBatchSampleList(batchSampleList);
        samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
        List<SamplePositionDO> samplePositionServiceAll = samplePositionService.getAll(
                samplePositionQuery);
        if (CollectionUtils.isNotEmpty(samplePositionServiceAll)) {
            samplePositionServiceAll.forEach(samplePositionDO -> {
                samplePositionDO.setStatus(SamplePositionStatus.INVALID.getCode());
                samplePositionService.update(samplePositionDO);
            });
        }

        // 删除前处理工单里的记录
        Integer sampleSize = preOrderDO.getSampleSize();
        Integer deleteSampleSize = removeSampleVO.getSampleNoList().size();
        preOrderDO.setSampleSize(sampleSize - deleteSampleSize);
        preOrderService.update(preOrderDO);
        return Result.OK();
    }

    /**
     * 移除前处理工单样本
     */
    @GetMapping(value = "/deleteSample")
    Result deleteSample(@RequestParam(value = "preOrderId", required = true) String orderId,
                        @RequestParam(value = "sampleNo", required = true) String sampleNo) {

        // 从前处理工单中删除
        PreOrderDO preOrderDO = preOrderService.getById(orderId);
        CommonUtil.checkIsNotNull(preOrderDO, ResultCode.PRE_ORDER_IS_EMPTY);
        SampleDO sample = sampleService.getBySampleNo(sampleNo, preOrderDO.getProjectId());
        CommonUtil.checkIsNotNull(sample, ResultCode.SAMPLE_NOT_EXISTED);
        // 删除前处理工单中的记录
        if (CollectionUtils.isNotEmpty(preOrderDO.getSampleList())) {
            preOrderDO.getSampleList().remove(sample.getId());
        }
        Integer sampleSize = preOrderDO.getSampleSize();
        preOrderDO.setSampleSize(sampleSize - 1);
        preOrderService.update(preOrderDO);

        // 删除工单里的样本位置
        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
        samplePositionQuery.setSampleId(sample.getId());
        samplePositionQuery.setPreOrderId(preOrderDO.getId());
        samplePositionService.remove(samplePositionQuery);
        return Result.OK();
    }

    /**
     * 查询前处理工单列表 默认按创建时间倒排
     *
     * @param query
     * @return
     */
    @GetMapping(value = "/list")
    Result list(PreOrderQuery query) {
        // 按创建时间倒排
        query.setOrderBy(Sort.Direction.DESC);
        query.setSortColumn("createDate");
        query.setStatus(PreOrderStatus.VALID.getCode());
        List<PreOrderDO> res = preOrderService.getAll(query);
        if (CollectionUtils.isEmpty(res)) {
            return Result.OK(res);
        }

        List<PreOrderListVO> preOrderListVOStream = res.stream().map(preOrder -> {
            PreOrderListVO preOrderListVO = new PreOrderListVO();
            BeanUtils.copyProperties(preOrder, preOrderListVO);

            BoardQuery boardQuery = new BoardQuery();
            boardQuery.setPreOrderId(preOrder.getId());
            boardQuery.setStatus(BoardStatus.VALID.getCode());
            List<BoardDO> boardDOList = boardService.getAll(boardQuery);
            List<String> boardNoList = boardDOList.stream().map(BoardDO::getBoardNo).toList();
            preOrderListVO.setBoardNoList(boardNoList);
            return preOrderListVO;
        }).toList();
        return Result.OK(preOrderListVOStream);
    }

    /**
     * 查询工单下的样本ids
     *
     * @param query
     * @return
     */
    @GetMapping(value = "/sample/list")
    Result sampleList(PreOrderQuery query) {
        query.setOrderBy(Sort.Direction.ASC);
        Result<List<PreOrderDO>> res = preOrderService.getList(query);
        return res;
    }

    /**
     * 人工录入模糊搜索样本编号
     */
    @GetMapping(value = "/blurList")
    Result blurList(PreOrderSampleQuery query) {
        CommonUtil.checkIsNotNull(query.getPreOrderId(), ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(query.getSampleNo(), ResultCode.SAMPLE_NO_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(query.getProjectId(), ResultCode.PROJECT_ID_CANNOT_BE_NULL);
        PreOrderDO preOrderDO = preOrderService.getById(query.getPreOrderId());
        CommonUtil.checkIsNotNull(preOrderDO, ResultCode.PRE_ORDER_IS_EMPTY);

        // 否则查询样本库列表
        SampleQuery sampleQuery = new SampleQuery();
        sampleQuery.setOrderBy(Sort.Direction.ASC);
        sampleQuery.setProjectId(query.getProjectId());
        List<SampleDO> sampleDOList = sampleService.getAll(sampleQuery);
        List<String> res = sampleDOList.stream().map(SampleDO::getSampleNo)
                .collect(Collectors.toList());

        return Result.OK(res);
    }

    /**
     * 前处理工单人工录入
     */
    @PostMapping(value = "/sample/add")
    Result addSample(@RequestBody PreOrderSampleAddVO preOrderSampleAddVO) {
        CommonUtil.checkIsNotNull(preOrderSampleAddVO.getPreOrderId(), ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(preOrderSampleAddVO.getSampleNo(), ResultCode.SAMPLE_NO_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(preOrderSampleAddVO.getProjectId(), ResultCode.PROJECT_ID_CANNOT_BE_NULL);
        SampleDO sampleDO = sampleService.getBySampleNo(preOrderSampleAddVO.getSampleNo(),
                preOrderSampleAddVO.getProjectId());
        CommonUtil.checkIsNotNull(sampleDO, ResultCode.SAMPLE_NOT_EXISTED);
        PreOrderDO preOrderDO = preOrderService.getById(preOrderSampleAddVO.getPreOrderId());
        CommonUtil.checkIsNotNull(preOrderDO, ResultCode.PRE_ORDER_IS_EMPTY);

        // 查询板子数量
        BoardQuery boardQuery = new BoardQuery();
        boardQuery.setPreOrderId(preOrderSampleAddVO.getPreOrderId());
        boardQuery.setStatus(BoardStatus.VALID.getCode());
        long boardCount = boardService.count(boardQuery);

        // 非白名单, 若样本已存在，则直接返回对应的位置
        SamplePositionDO existSamplePosition = samplePositionService.getBySampleIdAndOrderId(
                sampleDO.getId(), preOrderDO.getId());
        if (existSamplePosition != null) {
            // 直接返回
            String boardNo = existSamplePosition.getBoardNo();
            String boardPositionIndex = existSamplePosition.getSamplePosition();
            List<String> boardTypeList = Arrays.asList(BoardType.NINE_NINE.getMessage(),
                    BoardType.EP.getMessage(), BoardType.NINETY_SIX.getMessage());
            Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(
                    boardTypeList, Integer.valueOf(boardPositionIndex));
            List<PreOrderAddSampleRspVO> rsp = new ArrayList<>();
            for (Map.Entry<String, String> boardTypePosition : boardTypePositionMap.entrySet()) {
                String boardType = boardTypePosition.getKey();
                String boardPosition = boardTypePosition.getValue();
                PreOrderAddSampleRspVO orderAddSampleRspVO = new PreOrderAddSampleRspVO();
                orderAddSampleRspVO.setBoardPosition(String.format("%s:%s", boardNo, boardPosition));
                orderAddSampleRspVO.setBoardType(boardType);
                orderAddSampleRspVO.setRelatedBoardIndex(existSamplePosition.getBoardIndex());
                orderAddSampleRspVO.setBoardSize(boardCount);
                orderAddSampleRspVO.setWhiteSample(false);
                rsp.add(orderAddSampleRspVO);
            }
            return Result.OK(rsp);
        }

        // 计算板子的个数
        // 计算9*9 & ep管 & 96孔板板子数量及坐标 (前处理坐标&样本位置)
        SamplePositionDO samplePositionDO;
        SampleBoardLocationVO sampleBoardLocationVO = samplePositionService.getManualSampleLoc(
                preOrderDO, sampleDO, null);
        // 记录样本位置信息
        samplePositionDO = buildManualSampleBoardDO(sampleBoardLocationVO, preOrderDO);
        samplePositionService.insert(samplePositionDO);

        // 更新order
        Integer newSampleSize = preOrderDO.getSampleSize();
        preOrderDO.setSampleSize(newSampleSize + 1);
        preOrderService.update(preOrderDO);

        // 构建返回值
        List<PreOrderAddSampleRspVO> rsp = new ArrayList<>();
        String boardNo = samplePositionDO.getBoardNo();
        String samplePositionIndex = samplePositionDO.getSamplePosition();

        List<String> boardTypeList = Arrays.asList(BoardType.NINE_NINE.getMessage(),
                BoardType.EP.getMessage(), BoardType.NINETY_SIX.getMessage());
        Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(
                boardTypeList, Integer.valueOf(samplePositionIndex));
        for (Map.Entry<String, String> boardTypePosition : boardTypePositionMap.entrySet()) {
            String boardType = boardTypePosition.getKey();
            String boardPosition = boardTypePosition.getValue();
            PreOrderAddSampleRspVO orderAddSampleRspVO = new PreOrderAddSampleRspVO();
            orderAddSampleRspVO.setBoardPosition(String.format("%s:%s", boardNo, boardPosition));
            orderAddSampleRspVO.setBoardType(boardType);
            orderAddSampleRspVO.setRelatedBoardIndex(samplePositionDO.getBoardIndex());
            orderAddSampleRspVO.setBoardSize(boardCount);
            orderAddSampleRspVO.setWhiteSample(false);
            rsp.add(orderAddSampleRspVO);
        }
        return Result.OK(rsp);
    }

    /**
     * 工单导出
     */
    @GetMapping(value = "/export")
    void export(HttpServletResponse response,
                @RequestParam(value = "id", required = true) String orderId) throws Exception {
        CommonUtil.checkIsNotNull(orderId, ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        PreOrderDO order = preOrderService.getById(orderId);
        CommonUtil.checkIsNotNull(order, ResultCode.PRE_ORDER_IS_EMPTY);

        if (CollectionUtils.isEmpty(order.getSampleList())) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "orderController", "export",
                    "请先录入样本");
            log.error(errMsg);
            return;
        }
        List<SampleLocationExcelVO> samplePositionVOList = order.getSampleList().stream()
                .map(sample -> buildSampleLocationExcelVO(sample, orderId)).collect(Collectors.toList());
        preOrderExcelManager.exportExcel(response, samplePositionVOList, order.getName());
    }


    /**
     * 查询项目下所有的前处理板信息
     */
    @GetMapping(value = "/getProjectBatchList")
    Result getProjectBoardList(
            @RequestParam(value = "projectIds", required = true) List<String> projectIds) {
        CommonUtil.checkIsNotNull(projectIds, ResultCode.PROJECT_ID_CANNOT_BE_EMPTY);
        List<ProjectBatchVO> result = new ArrayList<>();
        projectIds.forEach(projectId -> {
            BoardQuery boardQuery = new BoardQuery();
            boardQuery.setProjectId(projectId);
            boardQuery.setStatus(BoardStatus.VALID.getCode());
            List<BoardDO> boardDOList = boardService.getAll(boardQuery);

            ProjectBatchVO projectBatchVO = new ProjectBatchVO();
            projectBatchVO.setBoardDOList(boardDOList);
            projectBatchVO.setProjectId(projectId);
            result.add(projectBatchVO);
        });
        return Result.OK(result);
    }


    /**
     * 查询所有孔板号列表
     */
    @GetMapping(value = "/findBoardNoList")
    Result getBoardNoList(@RequestParam(value = "id", required = true) String orderId) {
        BoardQuery query = new BoardQuery();
        query.setPreOrderId(orderId);
        query.setStatus(BoardStatus.VALID.getCode());
        List<BoardDO> boardList = boardService.getAll(query);
        List<String> boardNoList = boardList.stream().map(BoardDO::getBoardNo).toList();
        return Result.OK(boardNoList);
    }

    /**
     * 根据板号返回所有样本板的sampleId
     */
    @GetMapping(value = "/findBoardNoSample")
    Result getBoardNoSample(@RequestParam(value = "id", required = true) String orderId,
                            @RequestParam(value = "boardNo", required = true) String boardNo) {
        // 查询samplePosition表返回所有的板子的样本位置
        PreOrderDO preOrderDO = preOrderService.getById(orderId);

        BoardQuery boardQuery = new BoardQuery();
        boardQuery.setStatus(BoardStatus.VALID.getCode());
        boardQuery.setBoardNo(boardNo);
        boardQuery.setProjectId(preOrderDO.getProjectId());
        List<BoardDO> boardDOList = boardService.getAll(boardQuery);
        BoardDO boardDo = boardDOList.get(0);
        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
        samplePositionQuery.setBoardId(boardDo.getId());
        samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
        samplePositionQuery.setProjectId(preOrderDO.getProjectId());
        List<SamplePositionDO> boardSampleList = samplePositionService.getAll(samplePositionQuery);
        List<BoardSampleListVO> boardSampleListVOs;

        // 查询板子数量
        BoardQuery boardCountQuery = new BoardQuery();
        boardCountQuery.setPreOrderId(orderId);
        boardCountQuery.setStatus(BoardStatus.VALID.getCode());
        long boardCount = boardService.count(boardCountQuery);

        boardSampleListVOs = boardSampleList.stream().map(sample -> {
            // 返回sampleName
            BoardSampleListVO res = new BoardSampleListVO();
            SampleDO sampleDO = sampleService.getById(sample.getSampleId());
            res.setSampleNo(sample.getAlias());
            res.setSampleId(sampleDO.getId());
            // 返回sampleId
            res.setBoardIndex(sample.getBoardIndex());
            res.setBoardNo(sample.getBoardNo());
            res.setSamplePosition(sample.getSamplePosition());
            res.setBoardSize(boardCount);
            return res;
        }).collect(Collectors.toList());
        return Result.OK(boardSampleListVOs);
    }

    /**
     * 根据板号返回所有样本板的sampleId
     */
    @GetMapping(value = "/findBoardSample")
    Result getBoard(@RequestParam(value = "id", required = true) String orderId,
                    @RequestParam(value = "boardNo", required = true) Integer boardIndex) {
        // 查询samplePosition表返回所有的板子的样本位置
        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
        samplePositionQuery.setPreOrderId(orderId);
        samplePositionQuery.setBoardIndex(boardIndex.toString());
        samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
        List<SamplePositionDO> boardSampleList = samplePositionService.getAll(samplePositionQuery);
        List<BoardSampleListVO> boardSampleListVOs = new ArrayList<>();

        // 查询板子数量
        BoardQuery boardQuery = new BoardQuery();
        boardQuery.setPreOrderId(orderId);
        boardQuery.setStatus(BoardStatus.VALID.getCode());
        long boardCount = boardService.count(boardQuery);

        boardSampleListVOs = boardSampleList.stream().map(sample -> {
            // 返回sampleName
            BoardSampleListVO res = new BoardSampleListVO();
            SampleDO sampleDO = sampleService.getById(sample.getSampleId());
            res.setSampleNo(sample.getAlias());
            res.setSampleId(sampleDO.getId());
            // 返回sampleId
            res.setBoardIndex(sample.getBoardIndex());
            res.setBoardNo(sample.getBoardNo());
            res.setSamplePosition(sample.getSamplePosition());
            res.setBoardSize(boardCount);
            return res;
        }).collect(Collectors.toList());
        return Result.OK(boardSampleListVOs);
    }

    /**
     * 查询工单样本录入进度
     */
    @GetMapping(value = "/preProcess/addSampleList")
    Result queryAddSampleList(PreOrderSampleListQuery query) {

        PreOrderDO preOrderDO = preOrderService.getById(query.getPreOrderId());

        // 板子随机 白名单录入可以做check,
        if (Objects.equals(preOrderDO.getRandomMethod(),
                SampleRandomMethodEnum.BOARD_RANDOM.getCode())) {

            // 普通前处理工单
            SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
            samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
            samplePositionQuery.setPreOrderId(query.getPreOrderId());
            List<SamplePositionDO> samplePositionServiceAll = samplePositionService.getAll(
                    samplePositionQuery);

            if (CollectionUtils.isEmpty(samplePositionServiceAll)) {
                return Result.OK(null);
            }

            List<PreOrderAddSampleListVO> collect = samplePositionServiceAll.stream()
                    .map(samplePositionDO -> {
                        String sampleId = samplePositionDO.getSampleId();
                        SampleDO sample = sampleService.getById(sampleId);
                        PreOrderAddSampleListVO preOrderAddSampleListVO = new PreOrderAddSampleListVO();
                        preOrderAddSampleListVO.setSampleNo(sample.getSampleNo());
                        preOrderAddSampleListVO.setSampleId(sample.getId());
                        preOrderAddSampleListVO.setDim1(sample.getDim1());
                        preOrderAddSampleListVO.setDim2(sample.getDim2());
                        preOrderAddSampleListVO.setDim3(sample.getDim3());
                        preOrderAddSampleListVO.setSamplePosition(samplePositionDO.getSamplePosition());
                        preOrderAddSampleListVO.setBoardNo(samplePositionDO.getBoardNo());
                        return preOrderAddSampleListVO;
                    }).collect(Collectors.toList());
            return Result.OK(collect);
        }


        // 样本随机除了人工录入其他都可以做check

        // 怎么做check ?
        // if 录入时是白名单, 录入时需要记录,
        // 查询前处理工单里的样本信息
        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
        samplePositionQuery.setPreOrderId(preOrderDO.getId());
        samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
        List<SamplePositionDO> samplePositionDOList = samplePositionService.getAll(samplePositionQuery);

        if (CollectionUtils.isEmpty(samplePositionDOList)) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "orderController",
                    "preProcessList", "工单内无样本");
            log.info(errMsg);
            return Result.OK(null);
        }

        List<SamplePositionVO> samplePositionVOList = new ArrayList<>();
        samplePositionDOList.forEach(samplePositionDO -> {
            SamplePositionVO samplePositionVO = new SamplePositionVO();

            String sampleId = samplePositionDO.getSampleId();
            SampleDO sampleDO = sampleService.getById(sampleId);
            samplePositionVO.setSampleNo(samplePositionDO.getAlias());
            samplePositionVO.setDim1(sampleDO.getDim1());
            samplePositionVO.setDim2(sampleDO.getDim2());
            samplePositionVO.setDim3(sampleDO.getDim3());
            samplePositionVO.setId(sampleId);

            // 查询samplePosition位置
            String boardNo = samplePositionDO.getBoardNo();
            String samplePositionIndex = samplePositionDO.getSamplePosition();
            List<String> boardTypeList = Arrays.asList(BoardType.NINE_NINE.getMessage(),
                    BoardType.EP.getMessage(), BoardType.NINETY_SIX.getMessage());
            Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(
                    boardTypeList, Integer.valueOf(samplePositionIndex));
            for (Map.Entry<String, String> boardTypePosition : boardTypePositionMap.entrySet()) {
                String boardType = boardTypePosition.getKey();
                String boardPosition = boardTypePosition.getValue();
                if (Objects.equals(boardType, BoardType.EP.getMessage())) {
                    samplePositionVO.setEpPosition(String.format("%s:%s", boardNo, boardPosition));
                }
                if (Objects.equals(boardType, BoardType.NINETY_SIX.getMessage())) {
                    samplePositionVO.setNinetySixSampleBoardPosition(
                            String.format("%s:%s", boardNo, boardPosition));
                }
                if (Objects.equals(boardType, BoardType.NINE_NINE.getMessage())) {
                    samplePositionVO.setNineNineSampleBoardPosition(
                            String.format("%s:%s", boardNo, boardPosition));
                }
            }

            samplePositionVOList.add(samplePositionVO);
        });
        return Result.OK(samplePositionVOList);

    }

    /**
     * 查询工单中样本位置
     *
     * @param query
     * @return
     */
    @GetMapping(value = "/preProcess/list")
    Result preProcessList(PreOrderQuery query) {
        // 先查工单里板子信息
        PreOrderDO preOrderDO = preOrderService.getById(query.getId());
        CommonUtil.checkIsNotNull(preOrderDO, ResultCode.PRE_ORDER_IS_EMPTY);
        List<SamplePositionVO> samplePositionVOList = Lists.newArrayList();
        // 查询前处理工单里的样本信息
        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
        samplePositionQuery.setPreOrderId(preOrderDO.getId());
        samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
        List<SamplePositionDO> samplePositionDOList = samplePositionService.getAll(samplePositionQuery);

        if (CollectionUtils.isEmpty(samplePositionDOList)) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "orderController",
                    "preProcessList", "工单内无样本");
            log.info(errMsg);
            return Result.OK(null);
        }

        samplePositionDOList.forEach(samplePositionDO -> {
            SamplePositionVO samplePositionVO = new SamplePositionVO();

            String sampleId = samplePositionDO.getSampleId();
            SampleDO sampleDO = sampleService.getById(sampleId);
            samplePositionVO.setSampleNo(samplePositionDO.getAlias());
            samplePositionVO.setDim1(sampleDO.getDim1());
            samplePositionVO.setDim2(sampleDO.getDim2());
            samplePositionVO.setDim3(sampleDO.getDim3());
            samplePositionVO.setId(sampleId);

            // 查询samplePosition位置
            String boardNo = samplePositionDO.getBoardNo();
            String samplePositionIndex = samplePositionDO.getSamplePosition();

            List<String> boardTypeList = Arrays.asList(BoardType.NINE_NINE.getMessage(),
                    BoardType.EP.getMessage(), BoardType.NINETY_SIX.getMessage());
            Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(
                    boardTypeList, Integer.valueOf(samplePositionIndex));
            for (Map.Entry<String, String> boardTypePosition : boardTypePositionMap.entrySet()) {
                String boardType = boardTypePosition.getKey();
                String boardPosition = boardTypePosition.getValue();
                if (Objects.equals(boardType, BoardType.EP.getMessage())) {
                    samplePositionVO.setEpPosition(String.format("%s:%s", boardNo, boardPosition));
                }
                if (Objects.equals(boardType, BoardType.NINETY_SIX.getMessage())) {
                    samplePositionVO.setNinetySixSampleBoardPosition(
                            String.format("%s:%s", boardNo, boardPosition));
                }
                if (Objects.equals(boardType, BoardType.NINE_NINE.getMessage())) {
                    samplePositionVO.setNineNineSampleBoardPosition(
                            String.format("%s:%s", boardNo, boardPosition));
                }
            }

            samplePositionVOList.add(samplePositionVO);

        });

        return Result.OK(samplePositionVOList);
    }

    /**
     * 更新工单信息
     *
     * @param preOrderUpdateVO
     * @return
     */
    @RequestMapping(value = "/update")
    Result update(PreOrderUpdateVO preOrderUpdateVO) {
        CommonUtil.checkIsNotNull(preOrderUpdateVO.getId(), ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        PreOrderDO order = preOrderService.getById(preOrderUpdateVO.getId());
        CommonUtil.checkIsNotNull(order, ResultCode.PRE_ORDER_IS_EMPTY);
        if (StringUtils.isBlank(preOrderUpdateVO.getName())) {
            return Result.Error("工单名称不能为空");
        }

        if (!Objects.equals(preOrderUpdateVO.getName(), order.getName())) {
            // 查询更新工单名字是否重复
            PreOrderQuery preOrderQuery = new PreOrderQuery();
            preOrderQuery.setName(preOrderUpdateVO.getName());
            preOrderQuery.setProjectId(order.getProjectId());
            preOrderQuery.setStatus(PreOrderStatus.VALID.getCode());
            List<PreOrderDO> preOrderDOList = preOrderService.getAll(preOrderQuery);
            if (!CollectionUtils.isEmpty(preOrderDOList)) {
                return Result.Error("工单名称已存在");
            }
        }
        BeanUtils.copyProperties(preOrderUpdateVO, order);
        return preOrderService.update(order);
    }

    /**
     * 删除工单
     *
     * @param orderId
     * @return
     */
    @RequestMapping(value = "/delete")
    Result delete(@RequestParam(value = "id", required = true) String orderId) {
        PreOrderDO order = preOrderService.getById(orderId);
        CommonUtil.checkIsNotNull(order, ResultCode.PRE_ORDER_IS_EMPTY);

        // 修改对应样本板状态
        BoardQuery boardQuery = new BoardQuery();
        boardQuery.setPreOrderId(order.getId());
        List<BoardDO> boardDOList = boardService.getAll(boardQuery);

        boardDOList.forEach(boardDO -> {
            boardDO.setStatus(BoardStatus.INVALID.getCode());
            boardService.update(boardDO);

            SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
            samplePositionQuery.setBoardId(boardDO.getId());
            samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
            List<SamplePositionDO> samplePositionDOList = samplePositionService.getAll(
                    samplePositionQuery);

            samplePositionDOList.forEach(samplePositionDO -> {
                samplePositionDO.setStatus(SamplePositionStatus.INVALID.getCode());
                samplePositionService.update(samplePositionDO);
            });
        });

        // 修改对应工单信息
        order.setStatus(PreOrderStatus.INVALID.getCode());
        return preOrderService.update(order);
    }

    /**
     * 查询前处理工单下的样本板信息 查询projectId下的所有工单id 对于通过工单id + 板子index, 查询是否有未前处理未合格的样本 返回List<vo> vo包含工单id +
     * 板子index + 是否有前处理未合格的样本。
     *
     * @return
     */
    @GetMapping(value = "/findBoard")
    Result findBoard(@RequestParam(value = "projectId", required = true) String projectId,
                     @RequestParam(value = "boardType", required = false) String boardType) {
        PreOrderQuery query = new PreOrderQuery();
        query.setProjectId(projectId);
        List<PreOrderDO> res = preOrderService.getAll(query);

        PreOrderSampleBoardVO preOrderSampleBoardVO = new PreOrderSampleBoardVO();
        List<SampleBoardVO> sampleBoardVOList = new ArrayList<>();

        // 获取工单里的样本板信息
        res.forEach(orderDO -> {
            // 查询orderId 下 boardType 的 数量 及 hasInvalid的信息
            BoardQuery boardQuery = new BoardQuery();
            boardQuery.setPreOrderId(orderDO.getId());
            boardQuery.setStatus(BoardStatus.VALID.getCode());
            List<BoardDO> boardDOList = boardService.getAll(boardQuery);
            boardDOList.forEach(boardDO -> {
                SampleBoardVO sampleBoardVO = new SampleBoardVO();
                sampleBoardVO.setBoardIndex(boardDO.getBoardNo());
                sampleBoardVO.setBoardType(boardDO.getBoardType());
                sampleBoardVO.setBoardId(boardDO.getId());
                sampleBoardVO.setOrderName(orderDO.getName());

                SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
                samplePositionQuery.setBoardId(boardDO.getId());
                List<SamplePositionDO> sampleList = samplePositionService.getAll(samplePositionQuery);
                sampleBoardVO.setBoardSampleSize(sampleList.size());

                long count = sampleList.stream()
                        .filter(samplePositionDO -> samplePositionDO.getIsValid().equals(false)).count();
                sampleBoardVO.setHasInvalidSample(count > 0);

                sampleBoardVOList.add(sampleBoardVO);
            });
        });
        preOrderSampleBoardVO.setSampleBoardVOList(sampleBoardVOList);
        return Result.OK(sampleBoardVOList);
    }

    /**
     * 获取人工已录入样本列表
     *
     * @param orderId
     * @return
     */
    @GetMapping(value = "/findSampleList")
    Result findManualSampleId(@RequestParam(value = "orderId", required = true) String orderId) {
        PreOrderDO preOrderDO = preOrderService.getById(orderId);
        CommonUtil.checkIsNotNull(preOrderDO, ResultCode.PRE_ORDER_IS_EMPTY);
        if (!preOrderDO.getSaveType().equals(SampleSaveType.MANUAL_ADD.getCode())) {
            return Result.Error("该工单样本录入方式非人工导入");
        }

        // 查询前处理工单里的样本信息
        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
        samplePositionQuery.setPreOrderId(preOrderDO.getId());
        samplePositionQuery.setOrderBy(Sort.Direction.ASC);
        samplePositionQuery.setSortColumn("createDate");
        samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
        List<SamplePositionDO> samplePositionDOList = samplePositionService.getAll(samplePositionQuery);

        if (CollectionUtils.isEmpty(samplePositionDOList)) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "orderController",
                    "preProcessList", "工单内无样本");
            log.info(errMsg);
            return Result.OK(null);
        }

        Collections.reverse(samplePositionDOList);

        List<ManualSampleListVO> manualSampleListVOList = samplePositionDOList.stream()
                .map(samplePositionDO -> {
                    ManualSampleListVO manualSampleListVO = new ManualSampleListVO();

                    String sampleId = samplePositionDO.getSampleId();
                    SampleDO sampleDO = sampleService.getById(sampleId);
                    manualSampleListVO.setSampleNo(samplePositionDO.getAlias());
                    manualSampleListVO.setSampleId(sampleId);
                    // 查询samplePosition位置
                    String boardNo = samplePositionDO.getBoardNo();
                    String samplePositionIndex = samplePositionDO.getSamplePosition();
                    manualSampleListVO.setBoardNo(boardNo);
                    manualSampleListVO.setSamplePositionIndex(Integer.parseInt(samplePositionIndex));
                    List<String> boardTypeList = Arrays.asList(BoardType.NINE_NINE.getMessage(),
                            BoardType.EP.getMessage(), BoardType.NINETY_SIX.getMessage());
                    Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(
                            boardTypeList, Integer.valueOf(samplePositionIndex));
                    for (Map.Entry<String, String> boardTypePosition : boardTypePositionMap.entrySet()) {
                        String boardType = boardTypePosition.getKey();
                        String boardPosition = boardTypePosition.getValue();
                        if (Objects.equals(boardType, BoardType.EP.getMessage())) {
                            manualSampleListVO.setEpPosition(String.format("%s:%s", boardNo, boardPosition));
                        }
                        if (Objects.equals(boardType, BoardType.NINETY_SIX.getMessage())) {
                            manualSampleListVO.setNinetySixPosition(
                                    String.format("%s:%s", boardNo, boardPosition));
                        }
                        if (Objects.equals(boardType, BoardType.NINE_NINE.getMessage())) {
                            manualSampleListVO.setNineNinePosition(
                                    String.format("%s:%s", boardNo, boardPosition));
                        }
                    }
                    return manualSampleListVO;
                }).collect(Collectors.toList());
        return Result.OK(manualSampleListVOList);
    }

    /**
     * 更新样本是否前处理合格
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/updateSampleValid")
    Result updateSampleValid(@RequestParam(value = "sampleId", required = true) String sampleId,
                             @RequestParam(value = "orderId", required = true) String orderId,
                             @RequestParam(value = "status", required = false) Boolean status,
                             @RequestParam(value = "description", required = false) String description,
                             @RequestParam(value = "volume", required = false) String volume

    ) {
        CommonUtil.checkIsNotNull(orderId, ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        PreOrderDO order = preOrderService.getById(orderId);
        CommonUtil.checkIsNotNull(order, ResultCode.PRE_ORDER_IS_EMPTY);

        SamplePositionDO samplePositionDO = samplePositionService.getBySampleIdAndOrderId(sampleId,
                orderId);
        if (samplePositionDO == null) {
            return Result.OK("该样本不在工单");
        }
        samplePositionDO.setIsValid(status);
        samplePositionService.update(samplePositionDO);

        if (StringUtils.isNotBlank(description) && StringUtils.isNotBlank(sampleId)) {
            SampleDO sampleDO = sampleService.getById(sampleId);
            sampleService.update(sampleDO);
        }
        return Result.OK();
    }

    /**
     * check工单名是否存在
     */
    @GetMapping(value = "/checkName")
    Result checkName(@RequestParam(value = "nameSuffix", required = true) String nameSuffix,
                     @RequestParam(value = "preOrderId", required = true) String orderId,
                     @RequestParam(value = "projectId", required = true) String projectId) {

        PreOrderDO preOrderDO = preOrderService.getById(orderId);

        List<PreOrderDO> preProjectList = preOrderService.getByProjectId(projectId);
        List<String> preOrderNameList = preProjectList.stream().map(PreOrderDO::getName).toList();
        String newName = String.format("%s%s", preOrderDO.getName(), nameSuffix);

        if (preOrderNameList.contains(newName)) {
            return Result.Error("工单名已存在");
        }
        return Result.OK();
    }


    /**
     * 工单拷贝
     */
    @GetMapping(value = "/copy")
    Result orderCopy(PreOrderCopyVO preOrderCopyVO) {
        CommonUtil.checkIsNotNull(preOrderCopyVO.getOwner(), ResultCode.PRE_ORDER_OWNER_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(preOrderCopyVO.getType(), ResultCode.PRE_ORDER_TYPE_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(preOrderCopyVO.getOrderId(), ResultCode.PRE_ORDER_ID_CANNOT_BE_EMPTY);
        PreOrderDO preOrderDO = preOrderService.getById(preOrderCopyVO.getOrderId());
        CommonUtil.checkIsNotNull(preOrderDO, ResultCode.PRE_ORDER_IS_EMPTY);

        // 若选择为白名单工单, 判断是否项目是否已经存在白名单工单
        if (Objects.equals(preOrderCopyVO.getType(), PreOrderType.WHITELIST.getCode())) {
            PreOrderQuery preOrderQuery = new PreOrderQuery();
            preOrderQuery.setProjectId(preOrderDO.getProjectId());
            preOrderQuery.setStatus(PreOrderStatus.VALID.getCode());
            List<PreOrderDO> preOrderList = preOrderService.getAll(preOrderQuery);
            List<Integer> preOrderTypeList = preOrderList.stream().map(PreOrderDO::getType).toList();
            if (preOrderTypeList.contains(preOrderCopyVO.getType())) {
                return Result.Error("该项目已存在白名单, 请修改工单类型后重试");
            }
        }

        // 判断用户名是否存在
        PreOrderQuery preOrderQuery = new PreOrderQuery();
        preOrderQuery.setStatus(PreOrderStatus.VALID.getCode());
        preOrderQuery.setProjectId(preOrderCopyVO.getProjectId());
        List<PreOrderDO> preProjectList = preOrderService.getAll(preOrderQuery);
        List<String> preOrderNameList = preProjectList.stream().map(PreOrderDO::getName).toList();
        String newName = String.format("%s%s", preOrderDO.getName(), preOrderCopyVO.getNameSuffix());

        if (preOrderNameList.contains(newName)) {
            return Result.Error("工单名已存在, 请修改工单名后重试");
        }

        // 查询order对应的boardNo
        BoardQuery preOrderBoardQuery = new BoardQuery();
        preOrderBoardQuery.setPreOrderId(preOrderDO.getId());
        preOrderBoardQuery.setStatus(BoardStatus.VALID.getCode());
        List<BoardDO> preOrderBoardList = boardService.getAll(preOrderBoardQuery);
        List<String> newPreOrderBoardNoList = preOrderBoardList.stream().map(boardDO -> {
            String boardNo = boardDO.getBoardNo();
            return String.format("%s%s", boardNo, preOrderCopyVO.getBoardSuffix());
        }).toList();

        // 获取原工单的所有样本信息
        BoardQuery boardQuery = new BoardQuery();
        boardQuery.setProjectId(preOrderDO.getProjectId());
        boardQuery.setStatus(BoardStatus.VALID.getCode());
        List<BoardDO> boardDOList = boardService.getAll(boardQuery);

        AtomicBoolean hasExistBoardNo = new AtomicBoolean(false);
        if (CollectionUtils.isNotEmpty(boardDOList)) {
            if (CollectionUtils.isNotEmpty(newPreOrderBoardNoList)) {
                List<String> boardNoList = boardDOList.stream().map(BoardDO::getBoardNo).toList();
                newPreOrderBoardNoList.forEach(boardNo -> {
                    if (boardNoList.contains(boardNo)) {
                        hasExistBoardNo.set(true);
                    }
                });
                if (hasExistBoardNo.get()) {
                    return Result.Error("全局孔板后缀名已存在, 请修改全局孔板后缀名后重试");
                }
            }
        }

        // 生成新工单, 保持工单里的样本都添加统一后缀，工单的样本板号添加统一后缀，工单名称
        PreOrderDO copyPreOrderDO = buildOrderCopyDO(preOrderDO, preOrderCopyVO);
        preOrderService.insert(copyPreOrderDO);
        try {
            // 生成新的孔板信息
            List<BoardDO> copyBoardDO = preOrderBoardList.stream().map(boardDO -> {
                BoardDO copyBoard = new BoardDO();
                BeanUtils.copyProperties(boardDO, copyBoard);
                copyBoard.setId(null);
                copyBoard.setBoardNo(
                        String.format("%s%s", boardDO.getBoardNo(), preOrderCopyVO.getBoardSuffix()));
                copyBoard.setPreOrderId(copyPreOrderDO.getId());
                return copyBoard;
            }).toList();
            boardService.insert(copyBoardDO);

            // 构建新的工单样本位置
            SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
            samplePositionQuery.setPreOrderId(preOrderDO.getId());
            samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
            List<SamplePositionDO> samplePositionDOList = samplePositionService.getAll(
                    samplePositionQuery);

            List<SamplePositionDO> copySamplePositionDOList = samplePositionDOList.stream()
                    .map(samplePosition -> {
                        SamplePositionDO copySamplePositionDO = new SamplePositionDO();
                        BeanUtils.copyProperties(samplePosition, copySamplePositionDO);
                        copySamplePositionDO.setId(null);
                        copySamplePositionDO.setAlias(
                                String.format("%s%s", samplePosition.getAlias(), preOrderCopyVO.getSampleSuffix()));
                        copySamplePositionDO.setPreOrderId(copyPreOrderDO.getId());

                        // 查询对应的boardId
                        BoardDO copyBoard = boardService.getByOrderIdAndIndex(copyPreOrderDO.getId(),
                                copySamplePositionDO.getBoardIndex());
                        copySamplePositionDO.setBoardId(copyBoard.getId());
                        copySamplePositionDO.setBoardNo(copyBoard.getBoardNo());
                        return copySamplePositionDO;
                    }).toList();

            // 同时更新拷贝工单信息
            samplePositionService.insert(copySamplePositionDOList);
        } catch (Exception e) {
            // 回滚新工单信息
            // 回滚孔板样本信息
            SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
            samplePositionQuery.setPreOrderId(copyPreOrderDO.getId());
            samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
            List<SamplePositionDO> samplePositionServiceAll = samplePositionService.getAll(
                    samplePositionQuery);
            if (CollectionUtils.isNotEmpty(samplePositionServiceAll)) {
                // 更新对应状态
                samplePositionServiceAll.forEach(samplePosition -> {
                    samplePosition.setStatus(SamplePositionStatus.INVALID.getCode());
                    samplePositionService.update(samplePosition);
                });
            }

            // 回滚孔板信息
            BoardQuery rollbackBoardQuery = new BoardQuery();
            rollbackBoardQuery.setPreOrderId(copyPreOrderDO.getId());
            rollbackBoardQuery.setStatus(BoardStatus.VALID.getCode());
            List<BoardDO> rollbackBoardDOList = boardService.getAll(rollbackBoardQuery);
            if (CollectionUtils.isNotEmpty(rollbackBoardDOList)) {
                // 更新对应状态
                rollbackBoardDOList.forEach(board -> {
                    board.setStatus(BoardStatus.INVALID.getCode());
                    boardService.update(board);
                });
            }

            // 回滚前处理工单状态
            copyPreOrderDO.setStatus(PreOrderStatus.INVALID.getCode());
            preOrderService.update(copyPreOrderDO);

            log.error("前处理工单拷贝失败, errorMsg:", e);
            return Result.Error("前处理工单拷贝失败");
        }
        return Result.OK();
    }

    private PreOrderDO buildOrderCopyDO(PreOrderDO orderDO, PreOrderCopyVO orderCopyVO) {
        return PreOrderDO.builder().projectId(orderDO.getProjectId()).boardType(orderDO.getBoardType())
                .arrangementType(orderDO.getArrangementType())
                .name(String.format("%s%s", orderDO.getName(), orderCopyVO.getNameSuffix()))
                .sampleSize(orderDO.getSampleSize()).sampleTotal(orderDO.getSampleTotal())
                .saveType(orderDO.getSaveType()).type(orderCopyVO.getType())
                .randomMethod(orderCopyVO.getRandomMethod()).owner(orderCopyVO.getOwner())
                .status(PreOrderStatus.VALID.getCode()).build();
    }

    private PreOrderDO buildOrderAddDO(PreOrderAddVO orderAdd) {
        PreOrderDO preOrderDO = new PreOrderDO();
        ProjectDO projectDO = projectService.getById(orderAdd.getProjectId());
        preOrderDO.setName(String.format("%s_%s", projectDO.getAlias(),
                parseDateToStr(new Date(), DateUtil.DATE_TIME_FORMAT_YYYYMMDDHHMISS)));
        preOrderDO.setRandomMethod(orderAdd.getRandomMethod());
        preOrderDO.setProjectId(orderAdd.getProjectId());
        preOrderDO.setOwner(orderAdd.getOwner());
        preOrderDO.setSaveType(orderAdd.getSaveType());
        preOrderDO.setStatus(PreOrderStatus.VALID.getCode());
        preOrderDO.setType(PreOrderType.NORMAL.getCode());
        if (orderAdd.getSaveType().equals(SampleSaveType.MANUAL_ADD.getCode())) {
            preOrderDO.setSampleSize(0);
            preOrderDO.setSampleTotal(orderAdd.getSampleTotal());
        }
        if (orderAdd.getSaveType().equals(SampleSaveType.SAMPLE_SELECT.getCode())) {
            //todo 删除， 缺少excel 导入
            preOrderDO.setSampleList(orderAdd.getSampleList());
            preOrderDO.setSampleTotal(orderAdd.getSampleList().size());
            preOrderDO.setSampleSize(orderAdd.getSampleList().size());
        }
        return preOrderDO;
    }


    private SampleLocationExcelVO buildSampleLocationExcelVO(String sampleId, String orderId) {
        SampleLocationExcelVO sampleLocationExcelVO = new SampleLocationExcelVO();
        SampleDO sampleDO = sampleService.getById(sampleId);
        if (sampleDO == null) {
            return sampleLocationExcelVO;
        }
        sampleLocationExcelVO.setSampleId(sampleDO.getId());

        sampleLocationExcelVO.setSampleNo(sampleDO.getSampleNo());
        sampleLocationExcelVO.setDim1(sampleDO.getDim1());
        sampleLocationExcelVO.setDim2(sampleDO.getDim2());
        sampleLocationExcelVO.setDim3(sampleDO.getDim3());

        // 查询samplePosition位置
        SamplePositionDO samplePositionDO = samplePositionService.getBySampleIdAndOrderId(sampleId,
                orderId);
        String boardNo = samplePositionDO.getBoardNo();
        String samplePositionIndex = samplePositionDO.getSamplePosition();

        List<String> boardTypeList = Arrays.asList(BoardType.NINE_NINE.getMessage(),
                BoardType.EP.getMessage(), BoardType.NINETY_SIX.getMessage());
        Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(
                boardTypeList, Integer.valueOf(samplePositionIndex));
        for (Map.Entry<String, String> boardTypePosition : boardTypePositionMap.entrySet()) {
            String boardType = boardTypePosition.getKey();
            String boardPosition = boardTypePosition.getValue();
            if (Objects.equals(boardType, BoardType.EP.getMessage())) {
                sampleLocationExcelVO.setEpPosition(String.format("%s:%s", boardNo, boardPosition));
            }
            if (Objects.equals(boardType, BoardType.NINETY_SIX.getMessage())) {
                sampleLocationExcelVO.setNinetySixSampleBoardPosition(
                        String.format("%s:%s", boardNo, boardPosition));
            }
            if (Objects.equals(boardType, BoardType.NINE_NINE.getMessage())) {
                sampleLocationExcelVO.setNineNineSampleBoardPosition(
                        String.format("%s:%s", boardNo, boardPosition));
            }
        }
        return sampleLocationExcelVO;
    }


    private BoardDO buildOrderBoardDO(int boardIdx, PreOrderDO preOrderDO, String priority) {
        // 查询项目下有多少个board
        BoardQuery query = new BoardQuery();
        query.setProjectId(preOrderDO.getProjectId());
        query.setStatus(BoardStatus.VALID.getCode());
        // 获取当前已分配的所有的
        List<BoardDO> projectBoardList = boardService.getAll(query);

        // 在选择样本孔板时，将所有全局编号给出，
        // 潜规则，兼容有拷贝样本板情况出现
        List<Integer> boardNoList = projectBoardList.stream().map(boardDO -> {
            String boardNo = boardDO.getBoardNo();
            return Integer.parseInt(boardNo.split("_")[0]);
        }).toList();
        // 从0-500 获取最先缺少的一个板子index, 通常不会超过500个孔板
        Integer finalBoardNo = 1;
        for (int idx = 1; idx <= 500; idx++) {
            if (!boardNoList.contains(idx)) {
                finalBoardNo = idx;
                break;
            }
        }
        // 从最近的板开始补充
        BoardDO boardDO = new BoardDO();
        boardDO.setBoardIndex(String.valueOf(boardIdx));
        boardDO.setPreOrderId(preOrderDO.getId());
        boardDO.setBoardNo(String.valueOf(finalBoardNo));
        boardDO.setProjectId(preOrderDO.getProjectId());
        boardDO.setStatus(BoardStatus.VALID.getCode());

        if (StringUtils.isNotBlank(priority)) {
            boardDO.setPriority(priority);
        }
        return boardDO;
    }

    private List<SamplePositionDO> buildSamplePositionDO(
            List<SampleBoardLocationVO> sampleBoardLocationVOList, PreOrderDO preOrderDO) {
        List<SamplePositionDO> samplePositionDOList = new ArrayList<>();
        if (CollectionUtils.isEmpty(sampleBoardLocationVOList)) {
            return samplePositionDOList;
        }
        sampleBoardLocationVOList.forEach(sampleBoardLocationVO -> {
            String sampleId = sampleBoardLocationVO.getSampleId();
            // 查询工单里孔板索引信息
            BoardDO boardDO = boardService.getByOrderIdAndIndex(preOrderDO.getId(),
                    sampleBoardLocationVO.getBoardIndex().toString());
            SamplePositionDO samplePositionDO = new SamplePositionDO();
            samplePositionDO.setSampleId(sampleId);
            samplePositionDO.setPreOrderId(preOrderDO.getId());
            samplePositionDO.setBoardId(boardDO.getId());
            samplePositionDO.setBoardIndex(boardDO.getBoardIndex());
            samplePositionDO.setBoardNo(boardDO.getBoardNo());
            samplePositionDO.setProjectId(preOrderDO.getProjectId());
            samplePositionDO.setStatus(SamplePositionStatus.VALID.getCode());
            // 查询对应的id
            SampleDO sampleDO = sampleService.getById(sampleId);
            samplePositionDO.setAlias(sampleDO.getSampleNo());

            // 白名单录入时自动分配即可
            samplePositionDO.setSamplePosition(sampleBoardLocationVO.getSampleBoardIndex().toString());

            samplePositionDO.setIsValid(true);
            samplePositionDOList.add(samplePositionDO);
        });
        return samplePositionDOList;
    }

    private SamplePositionDO buildManualSampleBoardDO(SampleBoardLocationVO sampleBoardLocationVO,
                                                      PreOrderDO preOrderDO) {
        SamplePositionDO samplePositionDO = new SamplePositionDO();
        // 查询板子信息
        String sampleId = sampleBoardLocationVO.getSampleId();
        BoardDO boardDO = boardService.getByOrderIdAndIndex(preOrderDO.getId(),
                sampleBoardLocationVO.getBoardIndex().toString());
        samplePositionDO.setSampleId(sampleId);
        samplePositionDO.setPreOrderId(preOrderDO.getId());
        samplePositionDO.setBoardId(boardDO.getId());
        samplePositionDO.setBoardIndex(boardDO.getBoardIndex());
        samplePositionDO.setBoardNo(boardDO.getBoardNo());
        samplePositionDO.setSamplePosition(sampleBoardLocationVO.getSampleBoardIndex().toString());
        samplePositionDO.setIsValid(true);
        samplePositionDO.setProjectId(preOrderDO.getProjectId());
        samplePositionDO.setStatus(SamplePositionStatus.VALID.getCode());

        SampleDO sampleDO = sampleService.getById(sampleId);
        samplePositionDO.setAlias(sampleDO.getSampleNo());
        return samplePositionDO;
    }
}

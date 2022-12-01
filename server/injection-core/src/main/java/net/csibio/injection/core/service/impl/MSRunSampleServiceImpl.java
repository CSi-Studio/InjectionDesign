package net.csibio.injection.core.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.constants.enums.*;
import net.csibio.injection.client.domain.db.*;
import net.csibio.injection.client.domain.query.BatchQuery;
import net.csibio.injection.client.domain.query.MSRunQuery;
import net.csibio.injection.client.domain.query.SamplePositionQuery;
import net.csibio.injection.client.domain.vo.msOrder.PreHeartDataVO;
import net.csibio.injection.client.domain.vo.msOrder.WorkCurveDataVO;
import net.csibio.injection.client.exceptions.XException;
import net.csibio.injection.client.service.*;
import net.csibio.injection.core.dao.MSRunSampleDAO;
import net.csibio.injection.core.utils.ForEachUtils;
import net.csibio.injection.core.utils.RandomUtils;
import org.apache.commons.collections.CollectionUtils;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import static java.util.Collections.shuffle;

@Service("msRunSampleService")
@Slf4j
public class MSRunSampleServiceImpl implements IMSRunSampleService {

    /**
     * 96孔板进样QC
     */
    private final List<String> ninetySixBlackQCAB = Arrays.asList("82", "83", "84");
    private final List<String> ninetySixBlackQCHF = Arrays.asList("B11", "C11", "D11");
    private final List<String> ninetySixBlackQCHFX = Arrays.asList("B,11", "C,11", "D,11");

    private final List<String> ninetySixMixQCHF = Arrays.asList("E11", "F11", "G11");
    private final List<String> ninetySixMIXQCAB = Arrays.asList("85", "86", "87");
    private final List<String> ninetySixMixQCHFX = Arrays.asList("E,11", "F,11", "G,11");

    private final List<String> ninetySixRefQCHF = Arrays.asList("H11");
    private final List<String> ninetySixRefQCHFX = Arrays.asList("H,11");
    private final List<String> ninetySixRefQCAB = Arrays.asList("88");

    // QCMAP
    private final Map<String, List<String>> ninetySixBlankMap = new HashMap<>() {{
        put(DeviceType.HFX_1.getMessage(), ninetySixBlackQCHFX);
        put(DeviceType.HFX_2.getMessage(), ninetySixBlackQCHFX);
        put(DeviceType.HF.getMessage(), ninetySixBlackQCHF);
        put(DeviceType.AB6500.getMessage(), ninetySixBlackQCAB);
        put(DeviceType.GCMS_2.getMessage(), ninetySixBlackQCAB);
        put(DeviceType.GCMS_1.getMessage(), ninetySixBlackQCAB);
    }};

    private final Map<String, List<String>> ninetySixMixMap = new HashMap<>() {{
        put(DeviceType.HFX_1.getMessage(), ninetySixMixQCHFX);
        put(DeviceType.HFX_2.getMessage(), ninetySixMixQCHFX);
        put(DeviceType.HF.getMessage(), ninetySixMixQCHF);
        put(DeviceType.AB6500.getMessage(), ninetySixMIXQCAB);
        put(DeviceType.GCMS_2.getMessage(), ninetySixMIXQCAB);
        put(DeviceType.GCMS_1.getMessage(), ninetySixMIXQCAB);
    }};

    private final Map<String, List<String>> ninetySixRefMap = new HashMap<>() {{
        put(DeviceType.HFX_1.getMessage(), ninetySixRefQCHFX);
        put(DeviceType.HFX_2.getMessage(), ninetySixRefQCHFX);
        put(DeviceType.HF.getMessage(), ninetySixRefQCHF);
        put(DeviceType.AB6500.getMessage(), ninetySixRefQCAB);
        put(DeviceType.GCMS_2.getMessage(), ninetySixMIXQCAB);
        put(DeviceType.GCMS_1.getMessage(), ninetySixMIXQCAB);
    }};

    /**
     * 进样瓶qc
     */
    private final List<String> ab6500BlackQC = Arrays.asList("91", "92", "93");
    private final List<String> ab6500MixQC = Arrays.asList("94", "95", "96");
    private final List<String> ab6500RefQC = Arrays.asList("97");

    private final List<String> HFXBlackQC = Arrays.asList("E,1", "E,2", "E,3");
    private final List<String> HFXMixQC = Arrays.asList("E,4", "E,5", "E,6");
    private final List<String> HFXRefQC = Arrays.asList("E,7");

    private final List<String> HFBlackQC = Arrays.asList("D1", "D2", "D3");
    private final List<String> HFMixQC = Arrays.asList("D4", "D5", "D6");
    private final List<String> HFRefQC = Arrays.asList("D7");

    private final Map<String, List<String>> boxBlackQCMap = new HashMap<>() {{
        put(DeviceType.AB6500.getMessage(), ab6500BlackQC);
        put(DeviceType.HFX_1.getMessage(), HFXBlackQC);
        put(DeviceType.HFX_2.getMessage(), HFXBlackQC);
        put(DeviceType.HF.getMessage(), HFBlackQC);
        put(DeviceType.GCMS_2.getMessage(), ab6500BlackQC);
        put(DeviceType.GCMS_1.getMessage(), ab6500BlackQC);
    }};

    private final Map<String, List<String>> boxMixQcMap = new HashMap<>() {{
        put(DeviceType.AB6500.getMessage(), ab6500MixQC);
        put(DeviceType.HFX_1.getMessage(), HFXMixQC);
        put(DeviceType.HFX_2.getMessage(), HFXMixQC);
        put(DeviceType.HF.getMessage(), HFMixQC);
        put(DeviceType.GCMS_2.getMessage(), ab6500MixQC);
        put(DeviceType.GCMS_1.getMessage(), ab6500MixQC);
    }};

    private final Map<String, List<String>> boxRefQcMap = new HashMap<>() {{
        put(DeviceType.AB6500.getMessage(), ab6500RefQC);
        put(DeviceType.HFX_1.getMessage(), HFXRefQC);
        put(DeviceType.HFX_2.getMessage(), HFXRefQC);
        put(DeviceType.HF.getMessage(), HFRefQC);
        put(DeviceType.GCMS_2.getMessage(), ab6500RefQC);
        put(DeviceType.GCMS_1.getMessage(), ab6500RefQC);
    }};


    @Autowired
    MSRunSampleDAO msRunSampleDAO;

    @Resource
    IBoardService boardService;

    @Resource
    ISamplePositionService samplePositionService;

    @Resource
    ISampleService sampleService;

    @Resource
    IPlatformService platformService;

    @Resource
    IBatchService batchService;

    @Override
    public IDAO<MSRunDO, MSRunQuery> getBaseDAO() {
        return msRunSampleDAO;
    }

    @Override
    public void beforeInsert(MSRunDO order) throws XException {
        order.setCreateDate(new Date());
        order.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(MSRunDO order) throws XException {
        order.setLastModifiedDate(new Date());
    }

    /**
     * 板上的样本进样顺序完全随机。序列开头一个blank，mixQC，每10个样本为一组，1组样本后加一个blank，mixQC，
     * 每2组样本后加refQC。样本余1个归上组，>1个直接在样本结尾一个blank，mixQC和refQC。取本板的blank和mixQC，
     * 每个blank和mixQC取4次。当设备为HFX-1或HFX-2时，如果工单最后一行样本waters液相方法为-1，
     * 那么工单加一针进样：Vail 1的solvent、液相方法为-2。
     * (ab6500+/HFX-1/HFX-2/HF)96孔板 1-12 13-24 (3个blank（B11，C11，D11），3个mixQC（E11，F11，G11），1个refQC（H11）), A12-H12
     * 进样瓶
     * ab65500+： 1-105 （3个blank（91，92，93）3个mixQC（94，95，96）1个refQC（97） 工作曲线(98-105)）
     * HFX-1 / HFX-2 (45孔, 有两个进样盘 A-F 1-8列： 1:A,1 2:B5， 1个refQC（2:E,7）) 工作曲线(2:F1-2:F8)
     * HF: 54孔, 有红黄蓝绿RY一组  BG一组 A-F 1-9列
     * GCMS-1 GCMS-2  105进样  1-155  3个blank（91，92，93） 3个mixQC（94，95，96） 1个refQC（97）
     *
     * @param msOrderDO
     * @return
     * @throws XException
     */
    @Override
    public List<MSRunDO> getRunOrder(MSOrderDO msOrderDO) throws XException {
        BatchQuery batchQuery = new BatchQuery();
        batchQuery.setMsOrderId(msOrderDO.getId());
        List<BatchDO> batchDOList = batchService.getAll(batchQuery);

        List<String> boardList = msOrderDO.getRunBoardList();

        List<MSRunDO> finalMSRunDOList = new ArrayList<>();
        String runSampleMethod = msOrderDO.getRunSampleMethod();

        // preRun
        AtomicInteger preRunInjectionOrder = new AtomicInteger();

        // QC
        AtomicInteger blackInjectionOrder = new AtomicInteger();
        AtomicInteger mixInjectionOrder = new AtomicInteger();
        AtomicInteger refInjectionOrder = new AtomicInteger();

        //预热和工作曲线
        List<MSRunDO> msPreHeartRunDOList = new ArrayList<>();
        List<MSRunDO> msWorkCurveRunDOList = new ArrayList<>();

        // 获取预热样本顺序
        if (CollectionUtils.isNotEmpty(msOrderDO.getPreHeartData())) {
            msPreHeartRunDOList = buildPreRunDO(msOrderDO, SampleType.PRE_HEART.getMessage(), preRunInjectionOrder);
            finalMSRunDOList.addAll(msPreHeartRunDOList);
        }

        // 获取工作曲线进样顺序
        if (CollectionUtils.isNotEmpty(msOrderDO.getWorkCurve())) {
            msWorkCurveRunDOList = buildPreRunDO(msOrderDO, SampleType.WORK_CURVE.getMessage(), preRunInjectionOrder);
            finalMSRunDOList.addAll(msWorkCurveRunDOList);
        }

        // 获取样本顺序
        ForEachUtils.forEach(batchDOList, (index, batchDO) -> {
            // 进样次序
            AtomicInteger injectionOrder;
            if (index == 0) {
                injectionOrder  = new AtomicInteger(preRunInjectionOrder.get());
            } else {
                injectionOrder = new AtomicInteger();
            }

            BoardDO boardDO = boardService.getById(batchDO.getBoardId());
            if (boardDO == null) {
                log.error("board {} is not exist", batchDO.getBoardId());
                return;
            }

            // 获取板子样本
            SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
            samplePositionQuery.setBoardId(batchDO.getBoardId());
            samplePositionQuery.setIsWhiteList(false);
            List<SamplePositionDO> samplePositionDOList = samplePositionService.getAll(samplePositionQuery);

            if (CollectionUtils.isEmpty(samplePositionDOList)) {
                log.error("board {} has no sample", batchDO.getBoardId());
                return;
            }

            // 把样本按10个分组
            shuffle(samplePositionDOList);
            List<List<SamplePositionDO>> res = groupListByQuantity(samplePositionDOList, 10);

            // 在每一组前面加上一针blankQC 和 mixQC, 每两组后面加上一针refQC,
            // 每2组样本后加refQC。样本余1个归上组，>1个直接在样本结尾一个blank，mixQC和refQC。
            // 取本板的blank和mixQC，每个blank和mixQC取4次。当设备为HFX-1或HFX-2时，如果工单最后一行样本waters液相方法为-1，那么工单加一针进样：Vail 1的solvent、液相方法为-2。

            ForEachUtils.forEach(res, (idx, sampleGroup) -> {
                Integer groupIndex = idx + 1;
                // 每一组前加上blank 和 mixQc
                List<MSRunDO> mixQCList = buildQCRunDO(msOrderDO, SampleType.MIX_QC.getMessage(), injectionOrder, mixInjectionOrder, 1, RandomUtils.randomInt(0, 2), index + 1);
                finalMSRunDOList.addAll(mixQCList);

                List<MSRunDO> blankQCList = buildQCRunDO(msOrderDO, SampleType.BLACK_QC.getMessage(), injectionOrder, blackInjectionOrder, 1, RandomUtils.randomInt(0, 2), index + 1);
                finalMSRunDOList.addAll(blankQCList);

                // 样本
                for (SamplePositionDO samplePositionDO : sampleGroup) {
                    finalMSRunDOList.add(buildSampleRunDO(samplePositionDO, msOrderDO, injectionOrder, index + 1));
                }

                // 每两组后加一针refQC
                if (groupIndex % 2 == 0) {
                    List<MSRunDO> refQCList = buildQCRunDO(msOrderDO, SampleType.REF_QC.getMessage(), injectionOrder, refInjectionOrder, 1, 0, index + 1);
                    finalMSRunDOList.addAll(refQCList);
                }

            });

        });
        return finalMSRunDOList;
    }

    private MSRunDO buildSampleRunDO(SamplePositionDO samplePositionDO, MSOrderDO msOrderDO, AtomicInteger initNum, Integer boardIndex) {
        String device = msOrderDO.getDevice();
        String runSampleMethod = msOrderDO.getRunSampleMethod();

        SampleDO sampleDO = sampleService.getById(samplePositionDO.getSampleId());
        // 96孔板
        MSRunDO msRunDO = new MSRunDO();
        msRunDO.setMsOrderId(msOrderDO.getId());
        msRunDO.setSampleNo(sampleDO.getSampleNo());
        msRunDO.setSampleId(samplePositionDO.getSampleId());
        msRunDO.setBoardNo(samplePositionDO.getBoardNo());
        msRunDO.setBoardIndex(String.valueOf(boardIndex));
        msRunDO.setStatus(RunStatus.WAIT_FOR_COLLECT.getCode());

        Integer injectionOrder = initNum.addAndGet(1);
        msRunDO.setInjectionOrder(injectionOrder);
        msRunDO.setSampleType(RunSampleType.STD_BRACKET.getMessage());
        int samplePositionIndex = Integer.parseInt(samplePositionDO.getSamplePosition()) + 1;
        msRunDO.setSampleBoardIndex(Integer.toString(samplePositionIndex));
        // ab6500+
        if (device.equals(DeviceType.AB6500.getMessage())) {
            int platPos = (boardIndex % 2 != 0 ? 1 : 2);
            if (runSampleMethod.equals(BoardType.NINETY_SIX.getMessage())) {
                msRunDO.setPlatePos(String.valueOf(platPos));  // ab仅有一块96孔板
                msRunDO.setInjectionPosition(String.valueOf(samplePositionIndex));
            }
            if (runSampleMethod.equals(BoardType.RUN_SAMPLE_BOARD.getMessage())) {
                msRunDO.setPlatePos(String.valueOf(platPos)); // ab仅有一块105孔板
                msRunDO.setInjectionPosition(String.valueOf(samplePositionIndex));
            }
        }

        // HFX
        if (device.equals(DeviceType.HFX_1.getMessage()) || device.equals(DeviceType.HFX_2.getMessage())) {
            if (runSampleMethod.equals(BoardType.NINETY_SIX.getMessage())) {
                int platPos = (boardIndex % 2 != 0 ? 1 : 2); // 有两块96孔板交替进行
                msRunDO.setPlatePos(String.valueOf(platPos));
                String position = samplePositionDO.getSamplePosition();
                List<String> boardTypeList = Collections.singletonList(BoardType.NINETY_SIX.getMessage());
                Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(boardTypeList, Integer.valueOf(position));
                msRunDO.setInjectionPosition(boardTypePositionMap.get(BoardType.NINETY_SIX.getMessage()));
            }
            if (runSampleMethod.equals(BoardType.RUN_SAMPLE_BOARD.getMessage())) {
                // 48孔进样盘 2块48  A-F 1-8 组成96孔板
                int position = Integer.parseInt(samplePositionDO.getSamplePosition());
                if (position >= 48) {
                    msRunDO.setPlatePos("2");
                    List<String> boardTypeList = Collections.singletonList(BoardType.SIX_POINT_EIGHT.getMessage());
                    Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(boardTypeList, position - 48);
                    msRunDO.setInjectionPosition(boardTypePositionMap.get(BoardType.SIX_POINT_EIGHT.getMessage()));
                } else {
                    List<String> boardTypeList = Collections.singletonList(BoardType.SIX_POINT_EIGHT.getMessage());
                    Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(boardTypeList, position);
                    msRunDO.setInjectionPosition(boardTypePositionMap.get(BoardType.SIX_POINT_EIGHT.getMessage()));
                    msRunDO.setPlatePos("1");
                }
            }
        }

        // HF
        if (device.equals(DeviceType.HF.getMessage())) {
            if (runSampleMethod.equals(BoardType.NINETY_SIX.getMessage())) {
                int temp = boardIndex % 4;
                String platPos = "R";
                if (temp == 1) {
                    platPos = "R";
                }
                if (temp == 2) {
                    platPos = "Y";
                }
                if (temp == 3) {
                    platPos = "G";
                }
                if (temp == 4) {
                    platPos = "B";
                }
                msRunDO.setPlatePos(platPos);
                String position = samplePositionDO.getSamplePosition();
                List<String> boardTypeList = Collections.singletonList(BoardType.NINETY_SIX.getMessage());
                Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(boardTypeList, Integer.valueOf(position));
                msRunDO.setInjectionPosition(boardTypePositionMap.get(BoardType.NINETY_SIX.getMessage()).replaceAll(",", ""));
            }
            if (runSampleMethod.equals(BoardType.RUN_SAMPLE_BOARD.getMessage())) {
                // 54孔进样盘 2块54  A-F 1-8 组成96孔板
                int position = Integer.parseInt(samplePositionDO.getSamplePosition());
                if (position > 48) {
                    msRunDO.setPlatePos("2");
                    List<String> boardTypeList = Collections.singletonList(BoardType.SIX_POINT_EIGHT.getMessage());
                    Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(boardTypeList, position-48);
                    msRunDO.setInjectionPosition(boardTypePositionMap.get(BoardType.SIX_POINT_EIGHT.getMessage()));
                } else {
                    List<String> boardTypeList = Collections.singletonList(BoardType.SIX_POINT_EIGHT.getMessage());
                    Map<String, String> boardTypePositionMap = samplePositionService.getMultiSamplePositionMapping(boardTypeList, position);
                    msRunDO.setInjectionPosition(boardTypePositionMap.get(BoardType.SIX_POINT_EIGHT.getMessage()).replaceAll(",", ""));
                    msRunDO.setPlatePos("1");
                }
            }
        }
        // GCMS
        if (device.equals(DeviceType.GCMS_1.getMessage()) || device.equals(DeviceType.GCMS_2.getMessage())) {
            int platPos = (boardIndex % 2 != 0 ? 1 : 2);
            if (runSampleMethod.equals(BoardType.NINETY_SIX.getMessage())) {
                msRunDO.setPlatePos(String.valueOf(platPos));  // ab仅有一块96孔板
                msRunDO.setInjectionPosition(samplePositionDO.getSamplePosition());
            }
            if (runSampleMethod.equals(BoardType.RUN_SAMPLE_BOARD.getMessage())) {
                msRunDO.setPlatePos(String.valueOf(platPos)); // ab仅有一块105孔板
                msRunDO.setInjectionPosition(samplePositionDO.getSamplePosition());
            }
        }
        msRunDO.setFileName(String.format("%s_Batch%s_%s_%s_%s_%s", msOrderDO.getPlatform(), boardIndex, RunSampleType.STD_BRACKET.getMessage(), sampleDO.getSampleNo(), msRunDO.getPlatePos(), injectionOrder));
        PlatformDO platformDO = platformService.getByName(msOrderDO.getPlatform(), msOrderDO.getDevice());
        if (platformDO != null) {
            msRunDO.setMathFilePath(platformDO.getMathPath());
            msRunDO.setDataSavePath(platformDO.getMsFilePath());
        }
        return msRunDO;
    }

    /**
     * 构建预热及工作曲线msRunDO
     */
    private List<MSRunDO> buildPreRunDO(MSOrderDO msOrderDO, String sampleType, AtomicInteger initNum) {
        List<MSRunDO> msRunDOList = new ArrayList<>();
        if (Objects.equals(sampleType, SampleType.WORK_CURVE.getMessage())) {
            List<WorkCurveDataVO> workCurve = msOrderDO.getWorkCurve();
            ForEachUtils.forEach(workCurve, (index, item) -> {
                int frequency = Integer.parseInt(item.getFrequency());
                for (int idx = 1; idx <= frequency; idx++) {
                    MSRunDO msRunDO = new MSRunDO();
                    Integer injectionOrder = initNum.addAndGet(1);
                    msRunDO.setMsOrderId(msOrderDO.getId());
                    msRunDO.setSampleId(String.format("%s_%s", item.getFileName(), injectionOrder));
                    msRunDO.setBoardIndex("1");
                    msRunDO.setInjectionPosition(item.getPosition());
                    msRunDO.setInjectionOrder(injectionOrder);
                    msRunDO.setSampleType(RunSampleType.UNKNOWN.getMessage());
                    msRunDO.setStatus(RunStatus.WAIT_FOR_COLLECT.getCode());
                    msRunDO.setDataSavePath(item.getMethod());
                    msRunDO.setPlatePos("1");
                    msRunDO.setSampleBoardIndex("workCurve");
                    String fileName = String.format("%s_Batch%s_%s_%s_%s_%s", msOrderDO.getPlatform(), 1, RunSampleType.CURVE.getMessage(), String.format("%s%s","curve", item.getConcentration()), msRunDO.getPlatePos(), injectionOrder);
                    msRunDO.setFileName(fileName);
                    msRunDO.setDataSavePath(item.getMethod());
                    msRunDOList.add(msRunDO);
                }
            });
            return msRunDOList;
        }

        if (Objects.equals(sampleType, SampleType.PRE_HEART.getMessage())) {
            List<PreHeartDataVO> preHeartDataVOS = msOrderDO.getPreHeartData();
            ForEachUtils.forEach(preHeartDataVOS, (index, item) -> {
                int frequency = Integer.parseInt(item.getFrequency());
                for (int idx = 1; idx <= frequency; idx++) {
                    MSRunDO msRunDO = new MSRunDO();
                    Integer injectionOrder = initNum.addAndGet(1);
                    msRunDO.setMsOrderId(msOrderDO.getId());
                    msRunDO.setSampleId(String.format("%s_%s", item.getFileName(), injectionOrder));
                    msRunDO.setBoardIndex("1");
                    msRunDO.setInjectionPosition(item.getPosition());
                    msRunDO.setInjectionOrder(injectionOrder);
                    msRunDO.setSampleType(RunSampleType.UNKNOWN.getMessage());
                    msRunDO.setFileName(String.format("%s_%s", item.getFileName(), injectionOrder));
                    msRunDO.setDataSavePath(item.getMethod());
                    msRunDO.setPlatePos("1");
                    msRunDO.setStatus(RunStatus.INIT.getCode());
                    msRunDO.setSampleBoardIndex("PreRun");
                    msRunDOList.add(msRunDO);
                }
            });
            return msRunDOList;
        }
        return null;
    }


    /**
     * 构建质控样本进样do
     *
     * @param msOrderDO
     * @param sampleType     样本类型
     * @param injectionOrder 进样初始化order
     * @param times          进样次数
     * @param in
     * @return
     */
    private List<MSRunDO> buildQCRunDO(MSOrderDO msOrderDO, String sampleType, AtomicInteger injectionOrder, AtomicInteger qcOrder, Integer times, Integer in, Integer boardIndex) {
        int platPos = (boardIndex % 2 != 0 ? 1 : 2);
        List<MSRunDO> msRunDOList = new ArrayList<>();
        String runSampleMethod = msOrderDO.getRunSampleMethod();
        if (Objects.equals(sampleType, SampleType.BLACK_QC.getMessage())) {
            for (int idx = 1; idx <= times; idx++) {
                MSRunDO msRunDO = new MSRunDO();
                msRunDO.setMsOrderId(msOrderDO.getId());
                String fileName = String.format("%s_Batch%s_%s_%s_%s_%s", msOrderDO.getPlatform(), boardIndex, RunSampleType.BLANK.getMessage(), String.format("%s%s","blackQC", qcOrder.addAndGet(1)), platPos, injectionOrder);
                msRunDO.setSampleId(fileName);
                msRunDO.setBoardIndex(String.valueOf(boardIndex));
                if (Objects.equals(runSampleMethod, BoardType.RUN_SAMPLE_BOARD.getMessage())) {
                    msRunDO.setInjectionPosition(boxBlackQCMap.get(msOrderDO.getDevice()).get(in));
                }
                if (Objects.equals(runSampleMethod, BoardType.NINETY_SIX.getMessage())) {
                    msRunDO.setInjectionPosition(ninetySixBlankMap.get(msOrderDO.getDevice()).get(in));
                }
                msRunDO.setInjectionOrder(injectionOrder.addAndGet(1));
                msRunDO.setSampleType(RunSampleType.BLANK.getMessage());
                msRunDO.setFileName(fileName);
                msRunDO.setPlatePos(String.valueOf(platPos));
                msRunDO.setSampleBoardIndex("BlackQC");
                msRunDO.setStatus(RunStatus.WAIT_FOR_COLLECT.getCode());
                PlatformDO platformDO = platformService.getByName(msOrderDO.getPlatform(), msOrderDO.getDevice());
                if (platformDO != null) {
                    msRunDO.setMathFilePath(platformDO.getMathPath());
                    msRunDO.setDataSavePath(platformDO.getMsFilePath());
                }
                msRunDOList.add(msRunDO);
            }
            return msRunDOList;
        }

        if (Objects.equals(sampleType, SampleType.MIX_QC.getMessage())) {
            for (int idx = 1; idx <= times; idx++) {
                MSRunDO msRunDO = new MSRunDO();
                msRunDO.setMsOrderId(msOrderDO.getId());
                String fileName = String.format("%s_Batch%s_%s_%s_%s_%s", msOrderDO.getPlatform(), boardIndex, RunSampleType.QC.getMessage(), String.format("%s%s","mixQC", qcOrder.addAndGet(1)), msRunDO.getPlatePos(), injectionOrder);
                msRunDO.setSampleId(fileName);
                msRunDO.setBoardIndex(String.valueOf(boardIndex));
                if (Objects.equals(runSampleMethod, BoardType.RUN_SAMPLE_BOARD.getMessage())) {
                    msRunDO.setInjectionPosition(boxMixQcMap.get(msOrderDO.getDevice()).get(in));
                }
                if (Objects.equals(runSampleMethod, BoardType.NINETY_SIX.getMessage())) {
                    msRunDO.setInjectionPosition(ninetySixMixMap.get(msOrderDO.getDevice()).get(in));
                }
                msRunDO.setInjectionOrder(injectionOrder.addAndGet(1));
                msRunDO.setSampleType(RunSampleType.QC.getMessage());
                msRunDO.setFileName(fileName);
                msRunDO.setPlatePos(String.valueOf(platPos));
                msRunDO.setSampleBoardIndex("MixQC");
                msRunDO.setStatus(RunStatus.WAIT_FOR_COLLECT.getCode());
                PlatformDO platformDO = platformService.getByName(msOrderDO.getPlatform(), msOrderDO.getDevice());
                if (platformDO != null) {
                    msRunDO.setMathFilePath(platformDO.getMathPath());
                    msRunDO.setDataSavePath(platformDO.getMsFilePath());
                }
                msRunDOList.add(msRunDO);
            }
            return msRunDOList;
        }

        if (Objects.equals(sampleType, SampleType.REF_QC.getMessage())) {
            for (int idx = 1; idx <= times; idx++) {
                MSRunDO msRunDO = new MSRunDO();
                msRunDO.setMsOrderId(msOrderDO.getId());
                String fileName = String.format("%s_Batch%s_%s_%s_%s_%s", msOrderDO.getPlatform(), boardIndex, RunSampleType.REF.getMessage(), String.format("%s%s","refQC", qcOrder.addAndGet(1)), msRunDO.getPlatePos(), injectionOrder);
                msRunDO.setSampleId(fileName);
                msRunDO.setBoardIndex(String.valueOf(boardIndex));
                if (Objects.equals(runSampleMethod, BoardType.RUN_SAMPLE_BOARD.getMessage())) {
                    msRunDO.setInjectionPosition(boxRefQcMap.get(msOrderDO.getDevice()).get(in));
                }
                if (Objects.equals(runSampleMethod, BoardType.NINETY_SIX.getMessage())) {
                    msRunDO.setInjectionPosition(ninetySixRefMap.get(msOrderDO.getDevice()).get(in));
                }
                msRunDO.setInjectionOrder(injectionOrder.addAndGet(1));
                msRunDO.setSampleType(RunSampleType.REF.getMessage());
                msRunDO.setFileName(fileName);
                msRunDO.setPlatePos(String.valueOf(platPos));
                msRunDO.setSampleBoardIndex("RefQC");
                msRunDO.setStatus(RunStatus.WAIT_FOR_COLLECT.getCode());
                PlatformDO platformDO = platformService.getByName(msOrderDO.getPlatform(), msOrderDO.getDevice());
                if (platformDO != null) {
                    msRunDO.setMathFilePath(platformDO.getMathPath());
                    msRunDO.setDataSavePath(platformDO.getMsFilePath());
                }
                msRunDOList.add(msRunDO);
            }
            return msRunDOList;
        }
        return null;

    }

    /**
     * 将集合按指定数量分组
     *
     * @param list     数据集合
     * @param quantity 分组数量
     * @return 分组结果
     */
    public static <T> List<List<T>> groupListByQuantity(List<T> list, int quantity) {

        if (list == null || list.size() == 0) {
            return null;
        }
        if (quantity <= 0) {
            new IllegalArgumentException("Wrong quantity.");
        }
        List<List<T>> wrapList = new ArrayList<List<T>>();
        int count = 0;
        while (count < list.size()) {
            wrapList.add(new ArrayList<T>(list.subList(count, (count + quantity) > list.size() ? list.size() : count + quantity)));
            count += quantity;
        }

        return wrapList;
    }
}

package net.csibio.injection.service.impl;

import net.csibio.injection.constants.enums.BoardType;
import net.csibio.injection.constants.enums.SamplePlaceType;
import net.csibio.injection.constants.enums.SamplePositionStatus;
import net.csibio.injection.constants.enums.SampleRandomMethodEnum;
import net.csibio.injection.domain.db.BoardDO;
import net.csibio.injection.domain.db.PreOrderDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.db.SamplePositionDO;
import net.csibio.injection.domain.query.SamplePositionQuery;
import net.csibio.injection.dao.SamplePositionDAO;
import net.csibio.injection.exceptions.XException;
import net.csibio.injection.service.IBoardService;
import net.csibio.injection.service.IDAO;
import net.csibio.injection.service.ISamplePositionService;
import net.csibio.injection.service.ISampleService;
import net.csibio.injection.utils.ForEachUtils;
import net.csibio.injection.domain.vo.SampleLocation.SampleBoardLocationVO;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.compress.utils.Lists;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;

import static java.util.Collections.shuffle;
import static net.csibio.injection.constants.Constants.SINGLE_BOARD_SAMPLE_SIZE;
import static net.csibio.injection.utils.RandomUtils.*;

@Service("samplePositionService")
public class SamplePositionServiceImpl implements ISamplePositionService {

    public final Logger logger = LoggerFactory.getLogger(SamplePositionServiceImpl.class);

    private final Integer SINGLE_BOARD_MIX_INDEX = 0;

    private final Integer SINGLE_BOARD_MAX_INDEX = 81;

    private final List<Integer> boardTypeList = Arrays.asList(BoardType.NINE_NINE.getCode(), BoardType.EP.getCode(), BoardType.NINETY_SIX.getCode(), BoardType.SIX_POINT_EIGHT.getCode());

    // 9*9
    private final String[] NINE_POINT_NINE_SAMPLE_CHAR_LIST = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};

    private final String[] NINE_POINT_NINE_SAMPLE_NUMBER_LIST = {"1", "2", "3", "4", "5", "6", "7", "8", "9"};

    // 6 * 8
    private final String[] SIX_POINT_EIGHT_SAMPLE_CHAR_LIST = {"A", "B", "C", "D", "E", "F"};

    private final String[] SIX_POINT_EIGHT_SAMPLE_NUMBER_LIST = {"1", "2", "3", "4", "5", "6", "7", "8"};

    // 96孔板
    private final String[] NINETY_SIX_SAMPLE_CHAR_LIST = {"A", "B", "C", "D", "E", "F", "G", "H"};

    private final String[] NINETY_SIX_SAMPLE_NUMBER_LIST = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10"};

    private final String[] NINETY_SIX_SAMPLE_NUMBER_FULL_LIST = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"};

    private Map<String, List<String>> boardTypeMatrixMap = new HashMap<>();

    @PostConstruct
    public void init() {
        boardTypeMatrixMap = getBoardTypeMatrix(boardTypeList);
    }

    @Autowired
    SamplePositionDAO samplePositionDAO;

    @Autowired
    ISampleService sampleService;

    @Autowired
    IBoardService boardService;

    @Override
    public IDAO<SamplePositionDO, SamplePositionQuery> getBaseDAO() {
        return samplePositionDAO;
    }

    @Override
    public void beforeInsert(SamplePositionDO samplePosition) throws XException {
        samplePosition.setCreateDate(new Date());
        samplePosition.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(SamplePositionDO samplePosition) throws XException {
        samplePosition.setLastModifiedDate(new Date());
    }

    @Override
    public SamplePositionDO getBySampleIdAndOrderId(String sampleId, String orderId) {
        try {
            return samplePositionDAO.getBySampleId(sampleId, orderId);
        } catch (Exception e) {
            logger.warn(e.getMessage());
            return null;
        }
    }


    @Override
    public SamplePositionDO getBySampleIdAndProjectId(String sampleId, String projectId) {
        try {
            return samplePositionDAO.getBySampleIdAndProjectId(sampleId, projectId);
        } catch (Exception e) {
            logger.warn(e.getMessage());
            return null;
        }
    }

    /**
     * 获取人工录入时样本板位置
     * 支持板子随机 & 样本随机
     *
     * @param preOrderDO
     * @param sampleDO
     * @return
     */
    @Override
    public SampleBoardLocationVO getManualSampleLoc(PreOrderDO preOrderDO, SampleDO sampleDO, Integer boardIndex) {
        Integer sampleCount = preOrderDO.getSampleTotal();
        int boardSize = (int) Math.ceil((double) sampleCount / SINGLE_BOARD_SAMPLE_SIZE);

        // 获取板子位置
        ImmutablePair<Integer, Integer> boardIndexPair = selectManualSampleBoard(preOrderDO, boardSize, boardIndex);

        // 获取样本位置
        SampleBoardLocationVO sampleBoardLocationVO = new SampleBoardLocationVO();
        sampleBoardLocationVO.setSampleId(sampleDO.getId());
        sampleBoardLocationVO.setSampleBoardIndex(boardIndexPair.getRight());
        sampleBoardLocationVO.setBoardIndex(boardIndexPair.getLeft());
        return sampleBoardLocationVO;
    }

    private ImmutablePair<Integer, Integer> selectManualSampleBoard(PreOrderDO preOrderDO, int boardSize, Integer board) {
        List<Integer> randomList;
        if (board == null) {
            randomList = getRandomNumList(boardSize, 1, boardSize + 1);
        } else {
            randomList = List.of(board);
        }

        // 先选哪块板子
        BoardDO finalBoardDO = null;
        Integer finalBoardIndex = 0;
        Integer finalBoardSampleSize = 0;
        Integer finalSamplePosition = 0;
        for (Integer boardIndex : randomList) {
            // 获取当前boardIndex的样本数量
            finalBoardDO = boardService.getByOrderIdAndIndex(preOrderDO.getId(), boardIndex.toString());
            SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
            samplePositionQuery.setBoardId(finalBoardDO.getId());
            samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
            long boardSampleSize = samplePositionDAO.count(samplePositionQuery);
            if (boardSampleSize >= SINGLE_BOARD_SAMPLE_SIZE) {
                continue;
            }

            // 否则直接返回
            finalBoardIndex = boardIndex; // 随机的样本板
            finalBoardSampleSize = Math.toIntExact(boardSampleSize + 1); // 当前板中的数量
            break;
        }

        // 再选板子的位置
        // 若是顺序摆放则找最近的一个空位位置
        // 1. 获取当前样本的全部随机位置
        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
        samplePositionQuery.setBoardId(finalBoardDO.getId());
        samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
        List<SamplePositionDO> samplePositionDOList = samplePositionDAO.getAll(samplePositionQuery);
        List<Integer> samplePositions = samplePositionDOList.stream().map(item -> Integer.parseInt(item.getSamplePosition())).sorted().toList();

        List<Integer> withoutPositions = new ArrayList<>();
        // 获取0-81 的没有的index 集合
        for (int index = 0; index < 81; index++) {
            if (!samplePositions.contains(index)) {
                withoutPositions.add(index);
            }
        }
        // 若是样本随机则从当前所有的空位中，随机选择一个作为样本位置
        Integer sampleRandomMethod = preOrderDO.getRandomMethod();
        // 板子随机
        if (Objects.equals(sampleRandomMethod, SampleRandomMethodEnum.BOARD_RANDOM.getCode())) {
            finalSamplePosition = withoutPositions.get(0);
        }
        // 样本随机
        if (Objects.equals(sampleRandomMethod, SampleRandomMethodEnum.SAMPLE_RANDOM.getCode())) {
            // 样本随机
            shuffle(withoutPositions);
            finalSamplePosition = withoutPositions.get(0);
        }
        // 直接加入
        return new ImmutablePair<>(finalBoardIndex, finalSamplePosition);
    }

    /**
     * 选择进样板
     * 对于每个样本，优先选择相同组别最少的进样板，若板子组别相同则选择总数最少的，若组别相同则按index选择样本板。
     *
     * @return boardIndex, 样本板次序
     * @return boardSampleSize 此时板子样本的数量
     */
    private ImmutablePair<Integer, Integer> selectSampleBoard(int boardSize, Map<String, Integer> boardSampleStatistics, int boardSampleCount) {
        // 根据样本组别分组，选择组别最少的boardIndex.
//        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
//        samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
//        samplePositionQuery.setPreOrderId(preOrderDO.getId());
//        List<SamplePositionDO> samplePositionDOList = samplePositionDAO.getAll(samplePositionQuery);
//        if (CollectionUtils.isNotEmpty(samplePositionDOList)) {
//            List<SampleDO> sampleDOList = samplePositionDOList.stream().map(samplePositionDO -> {
//                String sampleId = samplePositionDO.getSampleId();
//                SampleDO sampleDO = sampleService.getById(sampleId);
//                return sampleDO;
//            }).toList();
//            Map<String, Long> samplePositionCollect = sampleDOList.stream().collect(Collectors.groupingBy(SampleDO::getGroupName, Collectors.counting()));
//            Collection<Long> collection = samplePositionCollect.values();
//            Object[] sampleCollect = collection.toArray();
//            Arrays.sort(sampleCollect);
//            Integer boardCount = (Integer) sampleCollect[0];
//        }

        List<Integer> randomList = getRandomNumList(boardSize, 1, boardSize + 1);
        Integer finalBoardIndex = 0;
        Integer finalBoardSampleSize = 0;
        for (Integer boardIndex : randomList) {
            if (boardSampleStatistics.get(String.valueOf(boardIndex)) == null) {
                // 第一次加入直接加入
                boardSampleStatistics.put(String.valueOf(boardIndex), 1);
                return new ImmutablePair<>(boardIndex, 1);
            }
            // 若index板中已有值,  需要考量是否超过了最高容量
            Integer boardSampleSize = boardSampleStatistics.get(String.valueOf(boardIndex));
            if (boardSampleSize >= boardSampleCount) {
                continue;
            }
            finalBoardIndex = boardIndex;
            finalBoardSampleSize = boardSampleSize + 1;
            boardSampleStatistics.put(String.valueOf(boardIndex), finalBoardSampleSize);
            break;
        }
        return new ImmutablePair<>(finalBoardIndex, finalBoardSampleSize);
    }

    /**
     * 获取不同样本板的需求数及每个sampleId对应的位置
     * 对每个样本生成不同的index即可
     */
    public List<SampleBoardLocationVO> getSampleBoardLoc(List<String> sampleIds, Integer boardSize, PreOrderDO preOrderDO) {
        if (CollectionUtils.isEmpty(sampleIds)) {
            return null;
        }

        List<SampleBoardLocationVO> sampleBoardLocationVOS = new ArrayList<>();
        // 样本随机
        List<Integer> sampleRandomIndex = getRandomNumList(SINGLE_BOARD_SAMPLE_SIZE, SINGLE_BOARD_MIX_INDEX, SINGLE_BOARD_MAX_INDEX);
        // 统计各个样本板中的样本数量(统计第几号板的样本数量)
        Map<String, Integer> boardSampleStatistics = new HashMap<>();
        ForEachUtils.forEach(sampleIds, (index, sampleId) -> {
            // 获取板子位置
            // 获取板子index
            ImmutablePair<Integer, Integer> boardIndexPair = selectSampleBoard(boardSize, boardSampleStatistics, SINGLE_BOARD_SAMPLE_SIZE);
            // 获取样本位置
            Integer sampleIndex = sampleRandomIndex.get(boardIndexPair.getRight() - 1);
            // 返回样本所在index, 及 板子index
            SampleBoardLocationVO sampleBoardLocationVO = new SampleBoardLocationVO();
            sampleBoardLocationVO.setSampleId(sampleId);
            sampleBoardLocationVO.setBoardIndex(boardIndexPair.getLeft());
            sampleBoardLocationVO.setSampleBoardIndex(sampleIndex);
            sampleBoardLocationVOS.add(sampleBoardLocationVO);
        });
        return sampleBoardLocationVOS;
    }


    /**
     * 获取不同样本板的需求数及每个sampleId对应的位置
     * 对每个样本生成不同的index即可
     */
    public List<SampleBoardLocationVO> getSampleBoardLoc(List<String> sampleIds, Integer boardSize) {
        if (CollectionUtils.isEmpty(sampleIds)) {
            return null;
        }

        List<SampleBoardLocationVO> sampleBoardLocationVOS = new ArrayList<>();
        // 样本随机
        List<Integer> sampleRandomIndex = getRandomNumList(SINGLE_BOARD_SAMPLE_SIZE, SINGLE_BOARD_MIX_INDEX, SINGLE_BOARD_MAX_INDEX);
        // 统计各个样本板中的样本数量(统计第几号板的样本数量)
        Map<String, Integer> boardSampleStatistics = new HashMap<>();
        ForEachUtils.forEach(sampleIds, (index, sampleId) -> {
            // 获取板子位置
            // 获取板子index
            ImmutablePair<Integer, Integer> boardIndexPair = selectSampleBoard(boardSize, boardSampleStatistics, SINGLE_BOARD_SAMPLE_SIZE);
            // 获取样本位置
            Integer sampleIndex = sampleRandomIndex.get(boardIndexPair.getRight() - 1);
            // 返回样本所在index, 及 板子index
            SampleBoardLocationVO sampleBoardLocationVO = new SampleBoardLocationVO();
            sampleBoardLocationVO.setSampleId(sampleId);
            sampleBoardLocationVO.setBoardIndex(boardIndexPair.getLeft());
            sampleBoardLocationVO.setSampleBoardIndex(sampleIndex);
            sampleBoardLocationVOS.add(sampleBoardLocationVO);
        });
        return sampleBoardLocationVOS;
    }


    // 白名单，且分配的板子起始值
    @Override
    public List<SampleBoardLocationVO> getWhiteListSampleBoardLoc(List<String> sampleIds, Integer boardSize, int initValue, int randomMethod) {
        if (CollectionUtils.isEmpty(sampleIds)) {
            return null;
        }
        List<SampleBoardLocationVO> sampleBoardLocationVOS = new ArrayList<>();

        // 板子随机
        List<Integer> sampleNormalIndex = new ArrayList<>();
        if (Objects.equals(randomMethod, SampleRandomMethodEnum.BOARD_RANDOM.getCode())) {
            sampleNormalIndex = genNumList(SINGLE_BOARD_MIX_INDEX, SINGLE_BOARD_MAX_INDEX, 1);
        } else if (Objects.equals(randomMethod, SampleRandomMethodEnum.SAMPLE_RANDOM.getCode())) {
            sampleNormalIndex = getRandomNumList(SINGLE_BOARD_SAMPLE_SIZE, SINGLE_BOARD_MIX_INDEX, SINGLE_BOARD_MAX_INDEX);
        }

        Map<String, Integer> boardSampleStatistics = new HashMap<>();
        List<Integer> finalSampleNormalIndex = sampleNormalIndex;
        ForEachUtils.forEach(sampleIds, (index, sampleId) -> {
            // 获取板子位置
            // 获取板子index
            ImmutablePair<Integer, Integer> boardIndexPair = selectSampleBoard(boardSize, boardSampleStatistics, SINGLE_BOARD_SAMPLE_SIZE);
            // 获取样本位置
            Integer sampleIndex = finalSampleNormalIndex.get(boardIndexPair.getRight() - 1);
            // 返回样本所在的index， 及板子index
            SampleBoardLocationVO sampleBoardLocationVO = new SampleBoardLocationVO();
            sampleBoardLocationVO.setSampleId(sampleId);
            sampleBoardLocationVO.setBoardIndex(initValue + boardIndexPair.getLeft());
            sampleBoardLocationVO.setSampleBoardIndex(sampleIndex);
            sampleBoardLocationVOS.add(sampleBoardLocationVO);
        });

        return sampleBoardLocationVOS;
    }

    @Override
    public List<String> getSamplePositionMapping(String boardType) {
        return boardTypeMatrixMap.get(boardType);
    }

    /**
     * 根据index获取指定样本板类型的mapping
     *
     * @param boardType
     * @param sampleIndex
     * @return
     */
    @Override
    public Map<String, String> getMultiSamplePositionMapping(List<String> boardType, Integer sampleIndex) {
        Map<String, String> res = new HashMap<>();
        boardType.forEach(type -> {
            List<String> samplePositionList = getSamplePositionMapping(type);
            String samplePosition = samplePositionList.get(sampleIndex);
            res.put(type, samplePosition);
        });
        return res;
    }

    /**
     * 根据样本idx获取各类板子对应的位置
     *
     * @param sampleIndex
     * @return Map , key: boardType, value: boardPosition
     */
    @Override
    public Map<String, String> getAllBoardTypeMapping(Integer sampleIndex) {
        // 根据样本index 获取 对应的位置
        Map<String, String> res = new HashMap<>();
        boardTypeList.forEach(boardType -> {
            String boardTypeStr = BoardType.of(boardType).getMessage();
            List<String> samplePositionList = boardTypeMatrixMap.get(boardTypeStr);
            String samplePosition = samplePositionList.get(sampleIndex);
            res.put(boardTypeStr, samplePosition);
        });
        return res;
    }

    /**
     * 获取指定样本板列表的数据阵列
     *
     * @param boardTypeList
     * @return
     */
    private Map<String, List<String>> getBoardTypeMatrix(List<Integer> boardTypeList) {

        Map<String, List<String>> boardTypeMatrixMap = new HashMap<>();
        boardTypeList.forEach(boardType -> {
            List<String> boardTypeMatrix = Lists.newArrayList();
            if (Objects.equals(boardType, BoardType.EP.getCode())) {
                // 获取epIndex对应序列
                boardTypeMatrix = genEPMatrix();
            }
            if (Objects.equals(boardType, BoardType.NINE_NINE.getCode())) {
                // 获取96孔板对应序列
                boardTypeMatrix = genNineNineMatrix(SamplePlaceType.HORIZONTAL.getCode());
            }
            if (Objects.equals(boardType, BoardType.NINETY_SIX.getCode())) {
                // 获取9*9对应样本序列
                boardTypeMatrix = genNinetySixMatrix(SamplePlaceType.VERTICAL.getCode());
            }
            if (Objects.equals(boardType, BoardType.SIX_POINT_EIGHT.getCode())) {
                // 获取48孔板对应样本序列
                boardTypeMatrix = genFourtyEight();
            }
            boardTypeMatrixMap.put(BoardType.of(boardType).getMessage(), boardTypeMatrix);
        });
        return boardTypeMatrixMap;
    }

    /**
     * 生成ep管阵列
     *
     * @return
     */
    private List<String> genEPMatrix() {
        return genNumStrList(1, 82, 1);
    }

    /**
     * 生成9*9管整列
     */
    private List<String> genNineNineMatrix(Integer samplePlaceType) {
        return genSampleList(NINE_POINT_NINE_SAMPLE_CHAR_LIST, NINE_POINT_NINE_SAMPLE_NUMBER_LIST);
    }

    /**
     * 生成6*8管整列
     */
    private List<String> genFourtyEight() {
        return genSampleList(SIX_POINT_EIGHT_SAMPLE_CHAR_LIST, SIX_POINT_EIGHT_SAMPLE_NUMBER_LIST);
    }


    /**
     * 生成96孔板阵列
     */
    private List<String> genNinetySixMatrix(Integer samplePlaceType) {
        List<String> res = new ArrayList<>();
        if (Objects.equals(samplePlaceType, SamplePlaceType.HORIZONTAL.getCode())) {
            res = genSampleList(NINETY_SIX_SAMPLE_CHAR_LIST, NINETY_SIX_SAMPLE_NUMBER_LIST);
            res.add("B,11");
        } else if (Objects.equals(samplePlaceType, SamplePlaceType.VERTICAL.getCode())) {
            int charListSize = NINETY_SIX_SAMPLE_CHAR_LIST.length;
            int numListSize = NINETY_SIX_SAMPLE_NUMBER_FULL_LIST.length;
            String[][] samplePositions = new String[charListSize][numListSize];
            for (int index = 0; index < NINETY_SIX_SAMPLE_CHAR_LIST.length; index++) {
                for (int col = 0; col < NINETY_SIX_SAMPLE_NUMBER_FULL_LIST.length; col++) {
                    samplePositions[index][col] = NINETY_SIX_SAMPLE_CHAR_LIST[index] + "," + NINETY_SIX_SAMPLE_NUMBER_FULL_LIST[col];
                }
            }

            // 纵向遍历
            for (int j = 0; j < samplePositions[0].length; j++) {
                for (int i = 0; i < samplePositions.length; i++) {
                    res.add(samplePositions[i][j]);
                }
            }
        }
        return res;
    }

}

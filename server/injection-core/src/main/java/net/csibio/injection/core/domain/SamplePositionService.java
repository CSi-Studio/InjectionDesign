//package net.csibio.injection.core.domain;
//
//import lombok.extern.slf4j.Slf4j;
//import net.csibio.injection.core.utils.ForEachUtils;
//import org.apache.commons.compress.utils.Lists;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//
//import static java.util.Collections.shuffle;
//
///**
// * 样本整理
// * 根据 样本容量 返回样本整理随机化方法
// */
//@Service
//@Slf4j
//public class SamplePositionService {
//
//    // 9 * 9 孔板
//    private static final Integer NINE_NINE_SAMPLE_SIZE = 81;
//
//    private final Integer SAMPLE_BOARD_START_INDEX = 1;
//
//    private static final String[] NINE_POINT_NINE_SAMPLE_CHAR_LIST = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
//
//    private static final String[] NINE_POINT_NINE_SAMPLE_NUMBER_LIST = {"1", "2", "3", "4", "5", "6", "7", "8", "9"};
//
//    /**
//     * 处理9*9样本板 & 96孔板
//     * 对于每个样本，优先选择相同组别最少的进样板，若板子组别相同则选择总数最少的，若组别相同则按index选择样本板。
//     *
//     */
//    public static Map<String, Map<Integer, String>> getRandomLoc9_9(List<String> sampleIds) {
//        Map<String, Map<Integer, String>> location = new HashMap<>();
//        double sampleBoardCount = Math.ceil((double) sampleIds.size() / NINE_NINE_SAMPLE_SIZE);
//        // 获取所需样本板数量
//        Map<Integer, String> randomNumList = genSampleRandomList(NINE_POINT_NINE_SAMPLE_CHAR_LIST, NINE_POINT_NINE_SAMPLE_NUMBER_LIST);
//        ForEachUtils.forEach(sampleIds, (index, item) -> {
//            // 选择板子
//            Integer boardIndex = selectSampleBoard(sampleBoardCount, item);
//            Map<Integer, String> sampleLocMap = new HashMap<>();
//            sampleLocMap.put(boardIndex, randomNumList.get(index));
//            location.put(item, sampleLocMap);
//        });
//        return location;
//    }
//
//    /**
//     * 选择进样板
//     * @param sampleBoardCount
//     * @param sampleId
//     * @return
//     */
//    private static Integer selectSampleBoard(double sampleBoardCount, String sampleId) {
//        return 1;
//    }
//
//    /**
//     * 获取样本随机排列
//     * 示例： A-E, 0-9, 求全排列，再shuffle, 返回map{index:A5}
//     * @param charList 字母列表
//     * @param numberList 数字列表
//     * @return
//     */
//    private static Map<Integer, String> genSampleRandomList(String[] charList, String[] numberList) {
//        Map<Integer, String> randomRes = new HashMap<>();
//        List<String> randomPositionList = new ArrayList<>();
//        for (String chr : charList) {
//            for (String num : numberList) {
//                randomPositionList.add(chr + num);
//            }
//        }
//        shuffle(randomPositionList);
//        ForEachUtils.forEach(randomPositionList, randomRes::put);
//        return randomRes;
//    }
//
//
//
//
//    public static void main(String[] args) {
//        List<String> sampleId = Lists.newArrayList();
//        sampleId.add("1");
//        sampleId.add("2");
//        sampleId.add("3");
//        sampleId.add("4");
//        sampleId.add("5");
//        sampleId.add("6");
//        System.out.println(SamplePositionService.getRandomLoc9_9(sampleId));
//    }
//
//}

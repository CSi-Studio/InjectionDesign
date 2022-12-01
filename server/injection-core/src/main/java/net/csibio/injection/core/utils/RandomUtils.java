package net.csibio.injection.core.utils;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Collections.shuffle;

/**
 * 随机数工具类
 */
@Service
public class RandomUtils {
    public static final char[] n = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};
    public static final char[] c = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    public static final char[] s = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z', 'Y', 'Z'};
    public static final char[] sc = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z', 'Y', 'Z', '=', '/', '+', '-', '*', '_', '~', '!', '#', '@', '%', '^', '&', '(', ')', '|', '.', '`', ':'};

    /**
     * 获取一个固定长度的随机整数
     *
     * @param size 数字长度
     * @return String
     */
    public static String randomNumber(int size) {
        StringBuffer sb = new StringBuffer();
        Random rd = new Random();
        for (int i = 0; i < size; i++) {
            sb.append(n[rd.nextInt(n.length)]);
        }
        return sb.toString();
    }

    /**
     * 获取一个随机的字符串
     *
     * @param size       字符串长度
     * @param withNumber 是否包含数字
     * @return String
     */
    public static String randomString(int size, boolean withNumber) {
        StringBuffer sb = new StringBuffer();
        Random rd = new Random();
        if (withNumber) {
            for (int i = 0; i < size; i++) {
                sb.append(s[rd.nextInt(s.length)]);
            }
        } else {
            for (int i = 0; i < size; i++) {
                sb.append(c[rd.nextInt(c.length)]);
            }
        }
        return sb.toString();
    }

    /**
     * 获取一个随机的字符串,含有特殊字符
     *
     * @param size 字符串长度
     * @return String
     */
    public static String randomStringWithSpecialChar(int size) {
        StringBuffer sb = new StringBuffer();
        Random rd = new Random();
        for (int i = 0; i < size; i++) {
            sb.append(sc[rd.nextInt(sc.length)]);
        }
        return sb.toString();
    }

    /**
     * 随机数 双精度
     *
     * @param min       最小值
     * @param max       最大值
     * @param precision 精度
     * @return
     */
    public static Double randomDouble(Double min, Double max, Integer precision) throws Exception {
        if (max < min) {
            throw new Exception("min < max");
        }
        if (min == max) {
            return min;
        }
        Double ret = min + ((max - min) * new Random().nextDouble());
        if (precision != null) {
            BigDecimal bd = new BigDecimal(ret);
            return bd.setScale(precision, BigDecimal.ROUND_HALF_UP).doubleValue();
        }

        return ret;
    }

    /**
     * 获取UUID
     *
     * @return String
     */
    public static String uuid() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }

    /**
     * 获取某个区间的整形
     *
     * @param min 最小值
     * @param max 最大值
     * @return int
     */
    public static int randomInt(int min, int max) {
        Random random = new Random();
        return random.nextInt(max) % (max - min + 1) + min;
    }

    /**
     * 获取一个随机整形值
     *
     * @return int
     */
    public static int randomInt() {
        Random random = new Random();
        return random.nextInt();
    }

    /**
     * 生成多个不同的随机数
     *
     * @param nums  生成随机数的个数
     * @param start 生成随机数的范围最小值
     * @param end   生成随机数的范围最大值
     *              [start, end)
     */
    public static List<Integer> getRandomNumList(int nums, int start, int end) {
        List<Integer> list = new ArrayList();
        Random random = new Random();
        while (list.size() != nums) {
            int num = random.nextInt(end - start) + start;
            if (!list.contains(num)) {
                list.add(num);
            }
        }
        return list;
    }

    /**
     * 获取样本随机排列
     * 示例： A-E, 0-9, 求全排列，再shuffle, 返回map{index:A5}
     *
     * @param charList   字母列表
     * @param numberList 数字列表
     * @return
     */
    public static Map<Integer, String> genSampleRandomListMap(String[] charList, String[] numberList) {
        Map<Integer, String> randomRes = new HashMap<>();
        List<String> randomPositionList = new ArrayList<>();
        for (String chr : charList) {
            for (String num : numberList) {
                randomPositionList.add(chr + "," + num);
            }
        }
        shuffle(randomPositionList);
        ForEachUtils.forEach(randomPositionList, randomRes::put);
        return randomRes;
    }

    /**
     * 获取样本随机排列
     * 示例： A-E, 0-9, 求全排列，再shuffle, 返回map{index:A5}
     *
     * @param charList   字母列表
     * @param numberList 数字列表
     * @return
     */
    public static List<String> genSampleRandomList(String[] charList, String[] numberList) {
        List<String> randomPositionList = new ArrayList<>();
        for (String chr : charList) {
            for (String num : numberList) {
                randomPositionList.add(chr + "," + num);
            }
        }
        shuffle(randomPositionList);
        return randomPositionList;
    }

    /**
     * 获取样本随机排列
     * 示例： A-E, 0-9, 求全排列，再shuffle, 返回map{index:A5}
     *
     * @param charList   字母列表
     * @param numberList 数字列表
     * @return
     */
    public static List<String> genSampleList(String[] charList, String[] numberList) {
        List<String> randomPositionList = new ArrayList<>();
        for (String chr : charList) {
            for (String num : numberList) {
                randomPositionList.add(chr + "," + num);
            }
        }
        return randomPositionList;
    }


    /**
     * 获取样本随机排列
     * 示例： A-E, 0-9, 求全排列, 返回map{index:A5}
     *
     * @param charList   字母列表
     * @param numberList 数字列表
     * @return
     */
    public static Map<Integer, String> genSampleMap(String[] charList, String[] numberList) {
        Map<Integer, String> randomRes = new HashMap<>();
        List<String> randomPositionList = new ArrayList<>();
        for (String chr : charList) {
            for (String num : numberList) {
                randomPositionList.add(chr + "," + num);
            }
        }
        ForEachUtils.forEach(randomPositionList,(index, item)->{
            randomRes.put(index+1, item);
        });
        return randomRes;
    }

    /**
     * 生成数字列表
     * @param start
     * @param end
     * @param space
     * @return
     */
    public static List<Integer> genNumList(int start, int end, int space) {
        return Stream.iterate(start, item -> item+space).limit(end).collect(Collectors.toList());
    }

    /**
     * 生成字符数字列表
     */
    public static List<String> genNumStrList(int start, int end, int space) {
       return genNumList(start, end, space).stream().map(String::valueOf).collect(Collectors.toList());
    }

}

package net.csibio.injection.utils;

import org.apache.commons.lang3.tuple.Pair;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by Nico Wang
 * Time: 2019-05-27 14:40
 */
public class FeatureUtil {
    public static final String		SP				= ";";
    public static final String		SSP				= ":";

    /**
     * 通过Map转换成String
     *
     * @param attrs
     * @return
     */
    public static final String toString(Map<String, Double> attrs) {
        StringBuilder sb = new StringBuilder();
        if (null != attrs && !attrs.isEmpty()) {
            sb.append(SP);
            Set<Map.Entry<String, Double>> entrySet = attrs.entrySet();
            for (Map.Entry<String, Double> entry : entrySet) {
                String key = entry.getKey();
                String val = entry.getValue().toString();
                sb.append(key).append(SSP).append(val).append(SP);
            }
        }
        return sb.toString();
    }
    public static final String toString(Double left, Double right) {
        return left.toString() + SP + right.toString();
    }

    public static final Pair<Double, Double> toDoublePair(String range){
        String[] arr = range.split(SP);
        Double left = Double.parseDouble(arr[0]);
        Double right = Double.parseDouble(arr[1]);
        return Pair.of(left, right);
    }


    /**
     * 通过字符串解析成attributes
     *
     * @param str (格式比如为: "k:v;k:v;k:v")
     * @return
     */
    public static final Map<String, String> toMap(String str) {
        Map<String, String> attrs = new HashMap<>();
        if (str != null) {
            String[] arr = str.split(SP);
            for (String kv : arr) {
                String[] ar = kv.split(SSP);
                if (ar.length == 2) {
                    String k = ar[0];
                    String v = ar[1];
                    attrs.put(k, v);
                }
            }
        }
        return attrs;
    }
}

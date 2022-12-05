package net.csibio.injection.utils;

import java.util.List;

public class ArrayUtil {

  public static double[] toArray(List<Double> list) {
    double[] target = new double[list.size()];
    for (int i = 0; i < list.size(); i++) {
      target[i] = list.get(i);
    }
    return target;
  }
}

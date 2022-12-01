package net.csibio.injection.core.utils;

import java.util.Objects;
import java.util.function.BiConsumer;

public class ForEachUtils {
    /**
     * 对每个元素执行给定的操作
     *
     * @param elements 元素
     * @param action   每个元素要执行的操作
     * @param <T>      T
     */
    public static <T> void forEach(Iterable<? extends T> elements, BiConsumer<Integer, ? super T> action) {
        forEach(0, elements, action);
    }

    /**
     * 对每个元素执行给定的操作
     *
     * @param startIndex 开始下标
     * @param elements   元素
     * @param action     每个元素要执行的操作
     * @param <T>        T
     */
    public static <T> void forEach(int startIndex, Iterable<? extends T> elements, BiConsumer<Integer, ? super T> action) {
        Objects.requireNonNull(elements);
        Objects.requireNonNull(action);
        if (startIndex < 0) {
            startIndex = 0;
        }
        int index = 0;
        for (T element : elements) {
            index++;
            if (index <= startIndex) {
                continue;
            }
            action.accept(index - 1, element);
        }
    }
}

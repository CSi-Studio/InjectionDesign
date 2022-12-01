package net.csibio.injection.core.utils;

import net.csibio.injection.client.domain.Result;
import net.csibio.injection.client.domain.query.PageQuery;
import org.springframework.beans.BeanUtils;
import org.springframework.util.ObjectUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * domain 转换工具类
 *
 * @author 顾遥
 */
public class DomainConversionUtils {
    public static final String LOCALTIME_TO_TIME_MILLI = "+8";
    /**
     * 时间存储改变时间，（东八区）
     */
    public static final Integer DATE_ADAPT_HOURS = 8;


    /**
     * 集合 VO 类，转为集合 DO 类
     *
     * @param clazz DO 的 class
     * @param vos   VO 类的集合
     * @param <D>
     * @param <V>
     * @return
     */
    public static <D, V> List<D> getDOsByVOs(Class<D> clazz, List<V> vos) {
        return vos.stream().map(vo -> {
            D domain = null;
            try {
                domain = clazz.getDeclaredConstructor().newInstance();
            } catch (InstantiationException | IllegalAccessException | InvocationTargetException |
                     NoSuchMethodException e) {
                e.printStackTrace();
            }
            if (domain != null) {
                BeanUtils.copyProperties(vo, domain);

            }
            return domain;
        }).collect(Collectors.toList());
    }

    /**
     * 集合 DO 类，转为集合 VO 类
     *
     * @param clazz VO 的 class
     * @param dos   DO 类的集合
     * @param <T>
     * @param <K>
     * @return
     */
    public static <T, K> List<T> getVOsByDOs(Class<T> clazz, List<K> dos) {
        return dos.stream().map(k -> getVOByDO(clazz, k)).collect(Collectors.toList());


    }


    /**
     * @param clazz VO 的类对象
     * @param k     DO
     * @param <T>
     * @param <K>
     * @return
     */
    public static <T, K> T getVOByDO(Class<T> clazz, K k) {
        try {
            T vo = clazz.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(k, vo);
            return vo;

        } catch (InstantiationException | IllegalAccessException | InvocationTargetException |
                 NoSuchMethodException e) {
            e.printStackTrace();
            return null;
        }

    }

    public static <D, V> D getDOByVO(Class<D> clazz, V v) {
        try {
            D domain = clazz.getDeclaredConstructor().newInstance();
            if (ObjectUtils.isEmpty(v)) {
                return null;
            }
            BeanUtils.copyProperties(v, domain);
            return domain;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }
}

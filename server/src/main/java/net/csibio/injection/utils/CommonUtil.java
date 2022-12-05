package net.csibio.injection.utils;

import net.csibio.injection.constants.enums.ResultCode;
import net.csibio.injection.exceptions.ParamsCheckException;

public class CommonUtil {

    public static <T> void checkIsNotNull(T t, ResultCode resultCode) {
        if (t == null) {
            throw new ParamsCheckException(resultCode);
        }
    }
}

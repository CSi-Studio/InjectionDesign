package net.csibio.injection.client.utils;

import net.csibio.injection.client.constants.enums.ResultCode;
import net.csibio.injection.client.exceptions.ParamsCheckException;
import org.apache.poi.ss.formula.functions.T;

public class CommonUtil {

    public static <T> void checkIsNotNull(T t, ResultCode resultCode) {
        if (t == null) {
            throw new ParamsCheckException(resultCode);
        }
    }
}

package net.csibio.injection.exceptions;

import net.csibio.injection.domain.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public final Logger logger = LoggerFactory.getLogger(getClass());

    @ExceptionHandler(ParamsCheckException.class)
    public Result paramsCheckException(ParamsCheckException e) {
        return Result.Error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(XException.class)
    public Result xException(XException e) {
        return Result.Error(e.getCode(), e.getMessage());
    }
}

package net.csibio.injection.exceptions;

import net.csibio.injection.constants.enums.ResultCode;

public class ParamsCheckException extends RuntimeException {

    private static final long serialVersionUID = 4564124491192825748L;

    String code;
    String message;

    public ParamsCheckException(ResultCode resultCode) {
        super();
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
    }

    public ParamsCheckException(String code, String msg) {
        super();
        this.code = code;
        this.message = msg;
    }

    public String getCode() {
        return code;
    }

    public String getMessage(){
        return message;
    }
}

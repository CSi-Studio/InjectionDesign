package net.csibio.injection.client.exceptions;

import java.util.List;
import lombok.Data;
import net.csibio.injection.client.constants.enums.ResultCode;

@Data
public class XException extends Exception {

    String code;

    String message;

    List<String> errorList;

    public XException(String errorMsg) {
        this.message = errorMsg;
    }

    public XException(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public XException(ResultCode resultCode) {
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
    }

    public XException(ResultCode resultCode, List<String> errorList) {
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
        this.errorList = errorList;
    }
}

package net.csibio.injection.constants.enums;

public enum UploadType {

    /**
     * 有效
     */
    ADD(2, "增加添加"),

    /**
     *
     */
    OVERRIDE(1, "重写覆盖");

    private Integer code;
    private String message;

    UploadType(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}

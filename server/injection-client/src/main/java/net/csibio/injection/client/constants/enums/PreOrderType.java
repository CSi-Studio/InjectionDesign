package net.csibio.injection.client.constants.enums;

public enum PreOrderType {

    NORMAL(1, "普通工单"),
    WHITELIST(2, "白名单工单");

    private Integer code;
    private String message;

    PreOrderType(Integer code, String message) {
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

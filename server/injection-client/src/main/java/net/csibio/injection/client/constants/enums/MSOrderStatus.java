package net.csibio.injection.client.constants.enums;

public enum MSOrderStatus {
    VALID(1, "有效"),

    INVALID(2, "无效");


    private Integer code;
    private String message;
    MSOrderStatus(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public static MSOrderStatus of(int value) {
        MSOrderStatus[] values = values();
        for (MSOrderStatus boardType : values) {
            if (boardType.code == value) {
                return boardType;
            }
        }
        return null;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}

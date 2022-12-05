package net.csibio.injection.constants.enums;

public enum DeviceStatus {
    /**
     * 有效
     */
    VALID(1, "在线"),

    /**
     *
     */
    INVALID(2, "离线");

    private Integer code;
    private String message;

    DeviceStatus(Integer code, String message) {
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

package net.csibio.injection.constants.enums;

public enum PlatformStatus {
    VALID(1, "在线"),

    INVALID(2, "离线");
    private Integer code;
    private String message;

    PlatformStatus(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public static PlatformStatus of(int value) {
        PlatformStatus[] values = values();
        for (PlatformStatus boardType : values) {
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

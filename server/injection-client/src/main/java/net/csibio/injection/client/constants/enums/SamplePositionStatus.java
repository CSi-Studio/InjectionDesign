package net.csibio.injection.client.constants.enums;

public enum SamplePositionStatus {
    VALID(1, "有效"),

    INVALID(2, "无效");


    private Integer code;
    private String message;
    SamplePositionStatus(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public static SamplePositionStatus of(int value) {
        SamplePositionStatus[] values = values();
        for (SamplePositionStatus status : values) {
            if (status.code == value) {
                return status;
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

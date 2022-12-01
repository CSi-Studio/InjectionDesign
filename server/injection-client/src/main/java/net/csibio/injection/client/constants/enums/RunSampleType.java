package net.csibio.injection.client.constants.enums;

public enum RunSampleType {

    UNKNOWN(1, "Unknown"),

    BLANK(2, "BLK"),


    QC(3, "MIX"),

    STD_BRACKET(4, "SAM"),

    REF(5, "REF"),

    CURVE(6, "CUR"),;

    private Integer code;
    private String message;

    RunSampleType(Integer code, String message) {
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

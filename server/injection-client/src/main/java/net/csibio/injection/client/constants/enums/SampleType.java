package net.csibio.injection.client.constants.enums;

public enum SampleType {

    NORMAL(1, "普通进样"),

    BLACK_QC(2, "blank质控"),

    MIX_QC(3, "mix质控"),

    REF_QC(4, "ref质控"),

    PRE_HEART(5, "预热"),

    WORK_CURVE(6, "工作曲线");

    private Integer code;
    private String message;

    SampleType(Integer code, String message) {
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

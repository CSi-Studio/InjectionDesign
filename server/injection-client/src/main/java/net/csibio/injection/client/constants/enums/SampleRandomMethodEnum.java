package net.csibio.injection.client.constants.enums;

public enum SampleRandomMethodEnum {

    /**
     * 板子随机
     */
    BOARD_RANDOM(1, "板子随机"),

    /**
     * 样本随机
     */
    SAMPLE_RANDOM(2, "样本随机")
    ;
    private Integer code;
    private String message;

    SampleRandomMethodEnum(Integer code, String message) {
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

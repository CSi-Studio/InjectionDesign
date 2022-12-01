package net.csibio.injection.client.constants.enums;

public enum SamplePlaceType {

    /**
     * 纵向摆放
     */
    HORIZONTAL(1, "horizontal"),

    /**
     * 横向摆放
     */
    VERTICAL(2, "vertical");

    private Integer code;
    private String message;

    SamplePlaceType(Integer code, String message) {
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

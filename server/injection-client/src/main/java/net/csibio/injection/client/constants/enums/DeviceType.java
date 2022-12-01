package net.csibio.injection.client.constants.enums;

public enum DeviceType {

    AB6500(1, "6500+"),

    HFX_1(2, "HFX-1"),

    HFX_2(3, "HFX-2"),

    HF(4, "HF"),

    GCMS_1(5, "GCMS-1"),

    GCMS_2(6, "GCMS-2");

    private Integer code;
    private String message;
    DeviceType(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public static DeviceType of(int value) {
        DeviceType[] values = values();
        for (DeviceType boardType : values) {
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

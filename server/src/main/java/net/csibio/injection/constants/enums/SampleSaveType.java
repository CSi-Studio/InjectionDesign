package net.csibio.injection.constants.enums;

public enum SampleSaveType {
    /**
     * 人工录入
     */
    MANUAL_ADD(1, "人工录入"),

    /**
     * 从样本库勾选
     */
    SAMPLE_SELECT(2, "样本库勾选"),

    /**
     * excel上传
     */
    EXCEL_UPLOAD(3, "excel导入");
    private Integer code;
    private String message;

    SampleSaveType(Integer code, String message) {
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

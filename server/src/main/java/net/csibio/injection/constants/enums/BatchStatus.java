package net.csibio.injection.constants.enums;

public enum BatchStatus {
    COLLECT(1, "等待质谱采集"),
    CONVERT(2, "等待文件转换"),
    CONVERTED(3, "文件转换完毕");

    private Integer code;
    private String message;

    BatchStatus(Integer code, String message) {
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

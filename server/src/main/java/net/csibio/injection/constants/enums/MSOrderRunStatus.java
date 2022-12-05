package net.csibio.injection.constants.enums;

public enum MSOrderRunStatus {

    INIT(0, "初始化工单中"),
    COLLECT(1, "等待质谱采集"),
    CONVERT(2, "等待文件转换"),
    CONVERTED(3, "文件转换完毕");

    private Integer code;
    private String message;

    MSOrderRunStatus(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public static MSOrderRunStatus of(int value) {
        MSOrderRunStatus[] values = values();
        for (MSOrderRunStatus boardType : values) {
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

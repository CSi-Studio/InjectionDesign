package net.csibio.injection.client.constants.enums;

public enum ProjectStatus {

    /**
     * 启动
     */
    START(1, "准备中"),

    /**
     * 样本接收
     */
    SAMPLE_ACCEPT(2, "样本接收"),

    /**
     * 预处理
     */
    PRE_PROCESS(2, "预处理"),

    /**
     * 数据采集
     */
    DATA_COLLECTION(2, "数据采集"),

    /**
     * 文件转换
     */
    FILE_CONVERT(2, "文件转换"),

    /**
     * 预质控
     */
    PRE_CONTROL(2, "预质控"),

    /**
     * 数据分析
     */
    DATA_ANALYSIS(2, "数据分析"),

    /**
     * 已完成
     */
    FINISHED(8, "已完成")
    ;
    private Integer code;
    private String message;

    ProjectStatus(Integer code, String message) {
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

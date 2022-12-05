package net.csibio.injection.constants.enums;

public enum RunStatus {

    WAIT_FOR_COLLECT(0, "待进样"),
    WAIT_FOR_CONVERT(1, "待转换"),
    CONVERTED(2, "已转换"),
    /**
     * 初始化状态标识样本无须转换
     */
    INIT(99, "初始化")
    ;
    String desc;
    int code;

    RunStatus(int code, String desc){
        this.code = code;
        this.desc = desc;
    }

    public String getDesc(){
        return desc;
    }

    public int getCode(){
        return code;
    }
}
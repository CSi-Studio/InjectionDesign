package net.csibio.injection.constants.enums;

/**
 * @author 顾遥
 */
public enum AccountTypeConstants {
    /**
     * 管理员
     */
    ADMIN(0, "超级管理员"),
    /**
     * 老师
     */
    TEACHER(1, "教师"),
    /**
     * 学生
     */
    STUDENT(2, "学生"),
    /**
     * 标注者
     */
    BIAOZHU(3, "标注者"),
    USER(4, "普通用户"),
    MECHANISM_ADMIN(5, "机构管理员"),
    /**
     * 命题人
     */
    PROPOSITIONAL_PERSON(6,"命题人"),
    /**
     * 未有机构接入
     */
    UNKNOWN_POSITION(9,"无权限"),

    PATIENT(10,"就医者"),

    FAMILIES(11,"家属");

    public static final String EXCEL_USER = "成员";
    public static final String EXCEL_MECHANISM_ADMIN = "管理员";
    public static final String EXCEL_PROPOSITIONAL_PERSON = "命题人";

    Integer code;
    String position;

    AccountTypeConstants(Integer code, String position) {
        this.code = code;
        this.position = position;
    }

    public static String getUserTypeName(Integer code) {
        if (code == null) {
            return null;
        }
        for (AccountTypeConstants value : AccountTypeConstants.values()) {
            if (value.code.equals(code)) {
                return value.getPosition();
            }
        }
        return null;

    }

    public static Integer getUserTypeCode(String position) {
        if (position == null) {
            return null;
        }
        for (AccountTypeConstants value : AccountTypeConstants.values()) {
            if (value.position.equals(position)) {
                return value.getCode();
            }
        }
        return null;
    }

    public String getPosition() {
        return position;
    }

    public Integer getCode() {
        return code;
    }

}

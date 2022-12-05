package net.csibio.injection.utils;

public class PathUtil {

    public static final String nasIp = "CSiNAS";

    //构建原始文件存储路径,用于给Windows使用
    public static String vendorPathForWiff(String nasIP, String projectNo, String platform, String boardNo, String sampleNo) {
        return "\\\\" + nasIP + "\\data\\AirdTest4JHX\\" + projectNo + "\\" + platform + "\\" + "set" + boardNo + "\\" + sampleNo + ".wiff";
    }

    //构建原始文件存储路径,用于给Windows使用
    public static String vendorPathForRow(String nasIP, String projectNo, String platform, String boardNo, String sampleNo) {
        return "\\\\" + nasIP + "\\data\\AirdTest4JHX\\" + projectNo + "\\" + platform + "\\" + "set" + boardNo + "\\" + sampleNo + ".raw";
    }

    //构建Aird文件存储路径,用于给Windows使用
    public static String airdPathForWindows(String nasIP, String projectNo, String boardNo, String sampleNo) {
        return "\\\\" + nasIP + "\\data\\AirdTest4JHX\\" + projectNo + "\\" + boardNo + "\\" ;
    }

    //构建Aird文件存储路径,用于给Windows使用
    public static String airdIndexForWindows(String nasIP, String projectNo, String boardNo, String sampleNo) {
        return "\\\\" + nasIP + "\\data\\AirdTest4JHX\\" + projectNo + "\\" + boardNo + "\\" + sampleNo + ".json";
    }

}

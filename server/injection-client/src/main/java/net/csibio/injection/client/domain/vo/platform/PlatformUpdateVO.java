package net.csibio.injection.client.domain.vo.platform;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class PlatformUpdateVO implements Serializable {
    @Serial
    private static final long serialVersionUID = -3853686673606353407L;

    /**
     * 主键id
     */
    private String id;

    /**
     * 平台名称
     */
    private String name;

    /**
     * 设备号
     */
    private String device;

    /**
     * 创建者
     */
    private String owner;


    /**
     * 方法文件路径
     */
    private String mathPath;

    /**
     * 质谱文件路径
     */
    private String msFilePath;

    /**
     * 状态
     */
    private String status;
}

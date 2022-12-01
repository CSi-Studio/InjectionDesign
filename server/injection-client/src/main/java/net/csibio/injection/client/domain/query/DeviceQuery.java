package net.csibio.injection.client.domain.query;

import lombok.Data;

import java.io.Serial;

@Data
public class DeviceQuery extends PageQuery {
    @Serial
    private static final long serialVersionUID = 7140767737140269196L;

    /**
     * 主键
     */
    private String id;

    /**
     * 设备型号
     */
    private String deviceMode;

    /**
     * 设备类型
     */
    private String deviceType;

    /**
     * 主要参数
     */
    private String mainParam;

    /**
     * 创建人
     */
    private String owner;

    /**
     * 设备名称
     */
    private String name;
}

package net.csibio.injection.client.domain.vo.device;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class DeviceUpdateVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 6886293684857834044L;

    /**
     * 主键id
     */
    private String id;

    /**
     * 设备名称
     */
    private String name;

    /**
     * 设备型号
     */
    private String deviceModel;

    /**
     * 设备类型
     */
    private String deviceType;

    /**
     * 负责人
     */
    private String owner;

    /**
     * 主要参数
     */
    private String mainParam;

    /**
     * 状态
     */
    private String status;

    /**
     * 训练材料
     */
    private String trainingMaterial;

    /**
     * 其他材料
     */
    private String otherMaterial;

    /**
     * 提醒信息
     */
    private String remindInfo;
}
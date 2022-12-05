package net.csibio.injection.domain.vo.order;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class MSOrderUpdateVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 3718812242786528889L;

    /**
     * 主键id
     */
    private String id;

    /**
     * 负责人
     */
    private String owner;

    /**
     * 设备
     */
    private String device;

    /**
     * 检测平台
     */
    private String checkPlatform;

    /**
     * 进样方式
     */
    private String feedSampleMethod;

    /**
     * 进样样本
     */
    private String feedSample;

    /**
     * 项目id
     */
    private String projectId;
}

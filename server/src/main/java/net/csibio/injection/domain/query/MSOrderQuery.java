package net.csibio.injection.domain.query;

import lombok.Data;
import java.io.Serial;

@Data
public class MSOrderQuery extends PageQuery {


    @Serial
    private static final long serialVersionUID = 1403160959551812656L;
    /**
     * 主键id
     */
    private String id;

    /**
     * 工单名称
     */
    private String name;

    /**
     * 设备
     */
    private String device;

    /**
     * 进样方式
     */
    private String feedMethod;

    /**
     * 进样样本
     */
    private String feedSample;

    /**
     * 检测平台
     */
    private String checkPlatform;

    /**
     * 负责人
     */
    private String owner;

    /**
     * projectId
     */
    private String projectId;

    /**
     * 进样状态
     */
    private Integer runSampleStatus;

    /**
     * 状态
     */
    private Integer status;

}

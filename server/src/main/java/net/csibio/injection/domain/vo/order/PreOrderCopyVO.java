package net.csibio.injection.domain.vo.order;

import lombok.Data;

import java.io.Serializable;

@Data
public class PreOrderCopyVO implements Serializable {
    /**
     * 工单类型
     */
    private Integer type;

    /**
     * 工单名后缀
     */
    private String nameSuffix;

    /**
     * 随机化方式
     */
    private Integer randomMethod;

    /**
     * 样本名后缀
     */
    private String sampleSuffix;

    /**
     * 孔板后缀
     */
    private String boardSuffix;

    /**
     * 工单id
     */
    private String orderId;

    /**
     * 项目id
     */
    private String projectId;

    /**
     * 项目负责人
     */
    private String owner;

}

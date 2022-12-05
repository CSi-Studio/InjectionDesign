package net.csibio.injection.domain.query;

import lombok.Data;

@Data
public class PreOrderSampleListQuery extends PageQuery{

    /**
     * 项目id
     */
    private String projectId;

    /**
     * 前处理工单
     */
    private String preOrderId;

    /**
     * status
     */
    private Integer status;
}

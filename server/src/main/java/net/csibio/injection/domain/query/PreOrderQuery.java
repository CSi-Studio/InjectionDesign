package net.csibio.injection.domain.query;

import lombok.Data;

import java.io.Serial;

@Data
public class PreOrderQuery extends PageQuery {

    @Serial
    private static final long serialVersionUID = -8726093452372993646L;

    /**
     * 主键id
     */
    private String id;

    /**
     * 工单名称
     */
    private String name;
    

    /**
     * 项目id
     */
    private String projectId;


    /**
     * 状态
     */
    private Integer status;

    /**
     * type
     */
    private Integer type;

    /**
     * 录入状态
     */
    private Integer addStatus;
}

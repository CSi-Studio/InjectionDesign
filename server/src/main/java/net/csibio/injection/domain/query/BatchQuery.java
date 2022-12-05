package net.csibio.injection.domain.query;

import lombok.Data;

@Data
public class BatchQuery extends PageQuery {
    private String id;

    /**
     * 批次编号
     */
    private String batchNo;

    /**
     * 质谱工单id
     */
    private String msOrderId;

    /**
     * 前处理板-板子id
     */
    private String boardId;

    /**
     * 批次状态
     */
    private Integer status;
}

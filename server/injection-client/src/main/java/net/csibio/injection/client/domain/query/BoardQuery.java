package net.csibio.injection.client.domain.query;

import lombok.Data;

@Data
public class BoardQuery extends PageQuery {

    private String Id;

    /**
     * 前处理工单id
     */
    private String preOrderId;

    /**
     * 板子类别
     */
    private String boardType;

    /**
     * 板子索引
     */
    private String boardIndex;

    /**
     * 板子样本数量
     */
    private String sampleCount;

    /**
     * projectId
     */
    private String projectId;


    /**
     * 样本板全局编号
     *
     */
    private String boardNo;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 优先级 (白名单样本列表的优先级)
     */
    private String priority;

}

package net.csibio.injection.client.domain.query;

import lombok.Data;

import java.io.Serial;
import java.util.List;

@Data
public class SamplePositionQuery extends PageQuery{
    @Serial
    private static final long serialVersionUID = 5850017198229604465L;

    /**
     * 主键id
     */
    private String id;

    /**
     * 样本id
     */
    private String sampleId;

    /**
     * 项目id
     */
    private String projectId;

    /**
     * 工单id
     */
    private String preOrderId;

    /**
     * 板子id
     */
    private String boardId;

    /**
     * 样本所处板子索引
     */
    private String boardIndex;

    /**
     * 是否白名单
     */
    private Boolean isWhiteList;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 批次样本列表
     */
    private List<String> batchSampleList;
}

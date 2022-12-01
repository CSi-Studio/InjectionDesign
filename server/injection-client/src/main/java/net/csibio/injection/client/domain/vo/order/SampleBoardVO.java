package net.csibio.injection.client.domain.vo.order;

import lombok.Data;

import java.io.Serializable;

@Data
public class SampleBoardVO implements Serializable {

    /**
     * boardId
     */
    private String boardId;

    /**
     * 样本板个数
     */
    private String boardIndex;

    /**
     * 板子类型
     */
    private String boardType;

    /**
     * 工单名称
     */
    private String orderName;

    /**
     * 样本板信息
     * key: boardIndex, value: true
     */
    private Boolean hasInvalidSample;

    /**
     * 板子样本数量
     */
    private Integer boardSampleSize;
}

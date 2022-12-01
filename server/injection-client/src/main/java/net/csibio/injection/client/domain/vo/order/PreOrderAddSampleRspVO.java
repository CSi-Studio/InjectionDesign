package net.csibio.injection.client.domain.vo.order;

import lombok.Data;

import java.io.Serializable;

@Data
public class PreOrderAddSampleRspVO implements Serializable {

    /**
     * 样本板类型
     */
    private String boardType;

    /**
     * 样本板位置
     */
    private String boardPosition;

    /**
     * 样本板相对位置
     */
    private String relatedBoardIndex;

    /**
     * 样本所需样本板总数
     */
    private long boardSize;

    /**
     * 是否白名单id
     */
    private boolean isWhiteSample;

}

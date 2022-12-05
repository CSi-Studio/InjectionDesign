package net.csibio.injection.domain.vo.SampleLocation;

import lombok.Data;

import java.io.Serializable;

@Data
public class BoardSampleListVO implements Serializable {
    /**
     * 样本编号
     */
    private String sampleNo;

    /**
     * 样本id
     */
    private String sampleId;

    /**
     * 板子序号
     */
    private String boardIndex;

    /**
     * 板子全局编号
     */
    private String boardNo;

    /**
     * 样本板位置
     */
    private String samplePosition;

    /**
     * boardSize
     */
    private long boardSize;
}

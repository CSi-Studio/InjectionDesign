package net.csibio.injection.domain.vo.order;

import lombok.Data;

@Data
public class PreOrderAddSampleListVO {

    /**
     * 样本编号
     */
    private String sampleId;

    /**
     * 样本编号
     */
    private String sampleNo;

    private String dim1;
    private String dim2;
    private String dim3;

    /**
     * 所在板号
     */
    private String boardNo;

    /**
     * 所在位置
     */
    private String samplePosition;
}

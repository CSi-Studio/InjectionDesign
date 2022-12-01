package net.csibio.injection.client.domain.vo.order;

import lombok.Data;

import java.io.Serializable;

@Data
public class ManualSampleListVO implements Serializable {

    /**
     * sampleId
     */
    private String sampleId;

    /**
     * sampleNo
     */
    private String sampleNo;

    /**
     * 9*9位置
     */
    private String nineNinePosition;

    /**
     * 96孔板位置
     */
    private String ninetySixPosition;

    /**
     * ep管位置
     */
    private String epPosition;

    /**
     * 样本index
     */
    private Integer samplePositionIndex;

    /**
     * 样本板号
     */
    private String boardNo;
}

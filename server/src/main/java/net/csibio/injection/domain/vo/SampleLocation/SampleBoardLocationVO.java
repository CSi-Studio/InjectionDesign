package net.csibio.injection.domain.vo.SampleLocation;

import lombok.Data;

import java.io.Serializable;

@Data
public class SampleBoardLocationVO implements Serializable {

    /**
     * 样本 id
     */
    private String sampleId;

    /**
     * 样本板index
     */
    private Integer boardIndex;

    /**
     * 样本位置index
     */
    private Integer sampleBoardIndex;
}

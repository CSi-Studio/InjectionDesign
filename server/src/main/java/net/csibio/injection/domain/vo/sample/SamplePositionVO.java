package net.csibio.injection.domain.vo.sample;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
public class SamplePositionVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 2903385696786398093L;

    /**
     * 样本id
     */
    private String id;

    /**
     * 样本编号
     */
    private String sampleNo;

    private String dim1;
    private String dim2;
    private String dim3;

    /**
     * boardIndex
     */
    private Integer boardIndex;

    /**
     * 9*9板子位置
     */
    private String nineNineSampleBoardPosition;

    /**
     * 96孔板
     */
    private String ninetySixSampleBoardPosition;

    /**
     * ep管
     */
     private String epPosition;

    /**
     * 实验的创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;
}

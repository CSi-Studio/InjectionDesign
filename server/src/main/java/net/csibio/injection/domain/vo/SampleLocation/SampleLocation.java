package net.csibio.injection.domain.vo.SampleLocation;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class SampleLocation implements Serializable {
    @Serial
    private static final long serialVersionUID = 2238365710826633536L;

    /**
     * 板子序号
     */
    private Integer boardIndex;

    /**
     * 样本在样本板中的序号
     */
    private String sampleBoardPosition;

}

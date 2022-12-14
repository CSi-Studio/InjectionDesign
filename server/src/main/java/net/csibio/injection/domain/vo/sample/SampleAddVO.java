package net.csibio.injection.domain.vo.sample;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class SampleAddVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 6146163523605817456L;

    /**
     * 样本编号
     */
    private String sampleNo;

    private String dim1;

    private String dim2;

    private String dim3;

    /**
     * 项目id
     */
    private String projectId;
}

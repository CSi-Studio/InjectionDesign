package net.csibio.injection.domain.vo.sample;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class SampleUpdateVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 3900991639643013535L;

    /**
     * 主键id
     */
    private String id;

    /**
     * 样本编号
     */
    private String sampleNo;

    private String dim1;
    private String dim2;
    private String dim3;


}

package net.csibio.injection.client.domain.vo.SampleLocation;

import lombok.Data;

import java.io.Serializable;
import java.util.Map;

@Data
public class SelectSampleLocationVO implements Serializable {
    /**
     * sampleId
     */
    private String sampleId;

    /**
     * 样本板总数
     */
    private Integer boardSize;

    /**
     * 在哪个板子类型的
     */
    private Map<String, SampleLocation> sampleLocationMap;

}

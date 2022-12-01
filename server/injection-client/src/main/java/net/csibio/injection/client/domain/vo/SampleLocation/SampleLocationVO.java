package net.csibio.injection.client.domain.vo.SampleLocation;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.Map;

@Data
public class SampleLocationVO implements Serializable {
    @Serial
    private static final long serialVersionUID = -2390200475815479385L;

    /**
     * 样本板类型
     * 9*9 96孔板 128孔板
     */
    private String boardType;

    /**
     * 所需样本板个数
     */
    private Integer boardCount;

    /**
     * 样本板中样本个数
     * key: boardIndex 板子序号
     * map: sampleSize 样本数量
     */
    private Map<String, Integer> boardSampleMap;

    /**
     * 样本位置
     * key: sampleId
     * value: SampleLocation
     *      - boardIndex 板子序号
     *      - SampleBoardPosition 样本在样本板中的序号
     */
    private Map<String, SampleLocation> samplePositionMap;
}

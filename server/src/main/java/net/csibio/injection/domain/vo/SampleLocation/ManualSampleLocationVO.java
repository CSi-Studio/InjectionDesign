package net.csibio.injection.domain.vo.SampleLocation;

import lombok.Data;

import java.util.List;

@Data
public class ManualSampleLocationVO extends SampleLocationVO {

    /**
     * 随机序列值
     */
    private List<List<String>> sampleLocationSampleList;
}

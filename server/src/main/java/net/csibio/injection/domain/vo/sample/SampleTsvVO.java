package net.csibio.injection.domain.vo.sample;

import lombok.Data;

@Data
public class SampleTsvVO {

    private String sampleId;
    private String dim1;
    private String dim2;
    private String dim3;

    public SampleTsvVO(String sampleId, String dim1, String dim2, String dim3) {
        this.sampleId = sampleId;
        this.dim1 = dim1;
        this.dim2 = dim2;
        this.dim3 = dim3;
    }

    public SampleTsvVO() {
    }

    public static SampleTsvVO parseTsv(String[] fields) {
        String sampleId = fields[0];
        String dim1 = fields[1];
        String dim2 = fields[2];
        String dim3 = fields[3];
        return new SampleTsvVO(sampleId, dim1, dim2, dim3);
    }


}

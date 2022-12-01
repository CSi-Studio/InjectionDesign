package net.csibio.injection.client.domain.query;

import lombok.Data;

import java.io.Serial;
import java.util.Date;
import java.util.List;

@Data
public class SampleQuery extends PageQuery {
    @Serial
    private static final long serialVersionUID = 3630570146824398176L;

    /**
     * 样本ID
     */
    String id;

    /**
     * 样本编号
     */
    private String sampleNo;

    private String dim1;

    private String dim2;

    private String dim3;

    /**
     * 所属项目id
     */
    private String projectId;

    /**
     * sampleIds
     */
    private List<String> sampleIds;

    public SampleQuery() {
    }

}

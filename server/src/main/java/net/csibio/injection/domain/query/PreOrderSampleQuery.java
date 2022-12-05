package net.csibio.injection.domain.query;

import lombok.Data;

import java.io.Serializable;

@Data
public class PreOrderSampleQuery implements Serializable {

    /**
     * 样本名称
     */
    private String sampleNo;

    /**
     * 项目id
     */
    private String projectId;

    /**
     * 工单id
     */
    private String preOrderId;

}

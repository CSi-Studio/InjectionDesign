package net.csibio.injection.domain.vo.order;

import lombok.Data;

import java.io.Serializable;

@Data
public class PreOrderSampleAddVO implements Serializable {
    /**
     * 样本编号
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

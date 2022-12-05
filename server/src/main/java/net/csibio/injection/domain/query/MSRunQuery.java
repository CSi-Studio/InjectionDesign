package net.csibio.injection.domain.query;

import lombok.Data;

@Data
public class MSRunQuery extends PageQuery {
    private String id;

    /**
     * 质谱工单id
     */
    private String msOrderId;

    /**
     * 样本id
     */
    private String sampleId;

    /**
     * 样本类型 (QC 还是 普通样本)
     */
    private String sampleType;

    /**
     * 设备仪器
     */
    private String device;

    /**
     * 进样类型 (96孔板 和 进样瓶进样)
     */
    private String runSampleType;

    /**
     * 在进样工单的第几块板
     */
    private String boardIndex;

    /**
     * 进样顺序
     */
    private Integer runSampleOrder;

    /**
     * 进样状态
     */
    private Integer status;
}

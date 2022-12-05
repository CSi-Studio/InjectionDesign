package net.csibio.injection.domain.vo.msOrder;

import lombok.Data;

import java.io.Serializable;

@Data
public class MsOrderBatchVO implements Serializable {

    /**
     * 批次id
     */
    private String batchId;

    /**
     * 批次名称
     */
    private String batchName;

    /**
     * 转换状态
     */
    private String convertStatus;

    /**
     * 样本容量
     */
    private long batchSize;
}

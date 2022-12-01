package net.csibio.injection.client.domain.vo.order;

import lombok.Data;

import java.util.List;

@Data
public class PreOrderRemoveSampleVO {

    /**
     * 样本编号list
     */
    private List<String> sampleNoList;

    /**
     * 前处理工单
     */
    private String preOrderId;
}

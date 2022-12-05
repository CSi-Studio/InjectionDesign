package net.csibio.injection.domain.vo.order;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class PreOrderUpdateVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 2528152236367431054L;

    /**
     * 主键id
     */
    private String id;

    /**
     * 工单名称
     */
    private String name;

    /**
     * 随机化方法
     */
    private String randomMethod;

    /**
     * 样本整理
     */
    private String arrangementType;

    /**
     * 前处理
     */
    private String boardType;

    /**
     * 样本总数
     */
    private Integer sampleTotal;

    /**
     * 录入样本量
     */
    private Integer sampleSize;

    /**
     * 负责人
     */
    private String owner;
}

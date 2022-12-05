package net.csibio.injection.domain.vo.msOrder;

import lombok.Data;

import java.io.Serializable;

@Data
public class MsOrderDataVO implements Serializable {

    /**
     * sampleId
     */
    private String sampleNo;

    /**
     * 样本类型
     */
    private String sampleType;

    /**
     * 组别
     */
    private String dim1;
    private String dim2;
    private String dim3;

    /**
     * 进样顺序
     */
    private String injectionOrder;

    /**
     * 进样体积
     */
    private String injectionVolume;

    /**
     * 孔板号
     */
    private String boardIndex;

    /**
     * 全局孔板号
     */
    private String boardNo;

    /**
     * 进样位置
     */
    private String injectionPosition;

    /**
     * 进样设备
     */
    private String device;

    /**
     * 进样平台
     */
    private String platform;

}

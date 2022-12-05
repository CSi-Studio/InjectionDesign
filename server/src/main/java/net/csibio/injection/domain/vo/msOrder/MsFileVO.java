package net.csibio.injection.domain.vo.msOrder;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class MsFileVO implements Serializable {
    /**
     * id
     */
    private String orderId;

    /**
     * 工单名称
     */
    private String msOrderName;

    /**
     * 批次名称
     */
    private String boardNo;

    /**
     * 批次状态
     */
    private Integer status;

    /**
     * 创建时间
     */
    private Date createDate;

}

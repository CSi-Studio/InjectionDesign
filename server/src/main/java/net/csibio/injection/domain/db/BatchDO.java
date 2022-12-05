package net.csibio.injection.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

@Data
@Document(collection = "batch")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchDO implements Serializable {

    /**
     * 主键id
     */
    @Id
    private String id;

    /**
     * 批次编号
     */
    private String batchNo;

    /**
     * 质谱工单id
     */
    @Indexed
    private String msOrderId;

    /**
     * 前处理板-板子id
     */
    private String boardId;

    /**
     * 批次状态
     */
    private Integer status;

    /**
     * 创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;


}

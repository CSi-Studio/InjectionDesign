package net.csibio.injection.client.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
@Document(collection = "sample_position")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SamplePositionDO implements Serializable {

    @Serial
    private static final long serialVersionUID = 7677414930716003964L;

    /**
     * 主键id
     */
    @Id
    private String id;

    /**
     * 样本id
     */
    @Indexed
    private String sampleId;

    /**
     * 前处理工单id
     */
    @Indexed
    private String preOrderId;

    /**
     * 孔板id
     */
    @Indexed
    private String boardId;

    /**
     * 板子索引 (冗余信息)
     */
    private String boardIndex;

    /**
     * 板子编号 (冗余信息)
     */
    private String boardNo;

    /**
     * 板子位置
     */
    private String samplePosition;

    /**
     * 样本前处理是否有效
     */
    private Boolean isValid;

    /**
     * 别名 (用于copy板的需求)
     */
    private String alias;

    /**
     * 状态
     * @see net.csibio.injection.client.constants.enums.SamplePositionStatus
     */
    @Indexed
    private Integer status;

    /**
     * 项目id
     */
    @Indexed
    private String projectId;

    /**
     * 是否已分配
     */
    private Boolean isAssign;

    /**
     * 创建日期
     */
    private Date createDate;

    /**
     * 最后修改日期
     */
    private Date lastModifiedDate;

}

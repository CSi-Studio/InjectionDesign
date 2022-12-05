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
@Document(collection = "board")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardDO implements Serializable {

    /**
     * 主键id
     */
    @Id
    private String id;

    /**
     * 前处理工单id
     */
    @Indexed
    private String preOrderId;

    /**
     * 项目id
     */
    @Indexed
    private String projectId;

    /**
     * 状态
     * @see net.csibio.injection.constants.enums.BoardStatus
     *
     */
    @Indexed
    private Integer status;

    /**
     * 板子类别
     */
    private String boardType;

    /**
     * 板子索引
     */
    @Indexed
    private String boardIndex;

    /**
     * board全局编号
     */
    private String boardNo;

    /**
     * 优先级
     */
    private String priority;

    /**
     * 实验的创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;

}

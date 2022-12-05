package net.csibio.injection.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.csibio.injection.domain.db.base.BaseDO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "pre_order")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreOrderDO extends BaseDO implements Serializable {
    @Serial
    private static final long serialVersionUID = -8829022801170990267L;

    /**
     * 主键id
     */
    @Id
    private String id;

    /**
     * 工单名称
     */
    @Indexed(unique = true)
    private String name;

    /**
     * 样本确认方式
     */
    private Integer saveType;

    /**
     * 样本随机化方法
     */
    private Integer randomMethod;

    /**
     * 样本总数
     */
    private Integer sampleTotal;

    /**
     * 录入样本量
     */
    private Integer sampleSize;

    /**
     * 样本整理
     */
    private String arrangementType;

    /**
     * 前处理板类型
     */
    private String boardType;

    /**
     * 负责人
     */
    private String owner;

    /**
     * sampleList,记录的SampleId
     */
    @Deprecated
    private List<String> sampleList;

    /**
     * 工单状态
     */
    @Indexed
    private Integer status;

    /**
     * projectId
     */
    @Indexed
    private String projectId;

    /**
     * 工单类型
     */
    private Integer type;

    /**
     * 创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;
}

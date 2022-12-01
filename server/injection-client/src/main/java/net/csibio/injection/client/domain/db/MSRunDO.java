package net.csibio.injection.client.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.csibio.injection.client.domain.db.base.MysqlBaseDO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

@Data
@Document(collection = "ms_run")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MSRunDO extends MysqlBaseDO implements Serializable {
    // sampleId 进样
    /**
     * 主键id
     */
    @Id
    private String id;

    /**
     * 质谱工单id
     */
    @Indexed
    private String msOrderId;

    /**
     * 样本id
     */
    private String sampleId;

    /**
     * 样本编号
     */
    private String sampleNo;

    /**
     * 样本板位置
     */
    private String sampleBoardIndex;

    /**
     * 样本类型 (QC 还是 普通样本)
     */
    private String sampleType;

    /**
     * 进样位置
     */
    private String injectionPosition;

    /**
     * 进样顺序
     */
    private Integer injectionOrder;

    /**
     * 文件名
     */
    private String fileName;

    /**
     * 数据保存路径
     */
    private String dataSavePath;

    /**
     * 方法文件路径
     */
    private String mathFilePath;

    /**
     * 板子编号
     */
    private String boardNo;

    /**
     * 在进样工单的第几块板
     */
    private String boardIndex;

    /**
     * col
     */
    private String platePos;

    /**
     * 进样状态
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

package net.csibio.injection.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.csibio.injection.domain.db.base.BaseDO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
@Document(collection = "sample")
@CompoundIndexes({
        @CompoundIndex(name = "uk_projectId_sampleNo", def = "{'projectId':1, 'sampleNo':1}", unique = true)
})
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SampleDO extends BaseDO implements Serializable {

    @Serial
    private static final long serialVersionUID = 2800042673561256753L;

    /**
     * 主键id
     */
    @Id
    private String id;

    @Indexed
    private String sampleNo;

    @Indexed
    private String projectId;

    private String type = "Normal";
    //分类维度1
    private String dim1;

    //分类维度2
    private String dim2;

    //分类维度3
    private String dim3;

    /**
     * 实验的创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;


}


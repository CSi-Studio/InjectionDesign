package net.csibio.injection.client.domain.db;

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
@Document(collection = "config")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConfigDO implements Serializable {

    /**
     * 主键id
     */
    @Id
    private String id;

    /**
     * 编号
     */
    @Indexed
    private String configNo;

    /**
     * 配置名称
     */
    private String configName;

    /**
     * 配置类型
     */
    private String configType;

    /**
     * 配置别名
     */
    private String alias;

    /**
     * 实验的创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;

}

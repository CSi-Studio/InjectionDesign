package net.csibio.injection.domain.db;

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
import java.util.Set;

@Data
@Document(collection = "project")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDO implements Serializable {

    @Serial
    private static final long serialVersionUID = -3258829839112356627L;

    @Id
    String id;

    /**
     * 项目编号, 唯一键
     */
    @Indexed(unique = true)
    String name;

    /**
     * 项目名称,唯一值
     */
    @Indexed(unique = true)
    String alias;

    /**
     * 项目负责人
     */
    String owner;

    /**
     * 用户id
     */
    String userId;

    /**
     * 实验的创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;
}

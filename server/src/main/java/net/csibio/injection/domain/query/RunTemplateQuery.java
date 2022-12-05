package net.csibio.injection.domain.query;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
public class RunTemplateQuery extends PageQuery {
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
     * 设备
     */
    @Indexed
    private String device;

    private String boardType;
}

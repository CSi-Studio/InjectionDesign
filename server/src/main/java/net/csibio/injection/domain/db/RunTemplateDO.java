package net.csibio.injection.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.csibio.injection.domain.vo.runTemplate.InjectOrderVO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "run_template")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RunTemplateDO implements Serializable {

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

    private String owner;

    private String boardType;

    private List<InjectOrderVO> injectOrder;

    /**
     * 创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;

}

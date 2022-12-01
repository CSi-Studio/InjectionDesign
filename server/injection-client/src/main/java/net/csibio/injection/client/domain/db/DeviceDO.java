package net.csibio.injection.client.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.csibio.injection.client.domain.db.base.MysqlBaseDO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
@Document(collection = "device")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeviceDO extends MysqlBaseDO implements Serializable {
    @Serial
    private static final long serialVersionUID = 888685932195181826L;

    /**
     * 主键
     */
    @Id
    private String id;

    /**
     * 设备名称
     */
    @Indexed
    private String name;

    /**
     * 设备型号
     */
    private String deviceMode;

    /**
     * 设备类型
     */
    private String deviceType;

    /**
     * 主要参数
     */
    private String mainParam;

    /**
     * 创建人
     */
    private String owner;

    /**
     * 培训材料
     */
    private String trainingMaterial;

    /**
     * 培训材料名称
     */
    private String trainingMaterialName;

    /**
     * 其他材料
     */
    private String otherMaterial;

    /**
     * 培训材料名称
     */
    private String otherMaterialName;

    /**
     * 提醒信息
     */
    private String remindInfo;

    private String status;

    /**
     * 实验的创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;
}

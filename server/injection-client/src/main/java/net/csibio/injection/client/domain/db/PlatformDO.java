package net.csibio.injection.client.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "platform")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformDO {

    @Id
    private String id;

    /**
     * 平台名称,可自定义,不可重复
     */
    @Indexed
    private String name;

    /**
     * 设备号
     */
    private String device;

    /**
     * 展示排序,当本字段为空时默认会按照name字段进行排序
     */
    private Float order;

    /**
     * 备注
     */
    private String description;

    /**
     * 创建者
     */
    private String owner;


    /**
     * 方法文件路径
     */
    private String mathPath;

    /**
     * 质谱文件路径
     */
    private String msFilePath;

    /**
     * 文件id
     */
    private String fileId;

    /**
     * 文件名称
     */
    private String fileName;

    /**
     * 设备状态
     */
    private String status;

    /**
     * 创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;
}

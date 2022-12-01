package net.csibio.injection.client.domain.vo.config;

import lombok.Data;

import java.io.Serializable;

@Data
public class ConfigUpdateVO implements Serializable {

    /**
     * 主键id
     */
    private String id;

    /**
     * 编号
     */
    private String configNo;

    /**
     * 配置名称
     */
    private String configName;

    /**
     * 配置类型 (species & matrix)
     */
    private String configType;

    /**
     * 配置别名
     */
    private String alias;
}

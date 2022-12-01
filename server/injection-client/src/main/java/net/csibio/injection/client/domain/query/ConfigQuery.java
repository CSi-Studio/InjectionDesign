package net.csibio.injection.client.domain.query;

import lombok.Data;

@Data
public class ConfigQuery extends PageQuery{
    /**
     * 主键id
     */
    private String Id;

    /**
     * 编号
     */
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

}

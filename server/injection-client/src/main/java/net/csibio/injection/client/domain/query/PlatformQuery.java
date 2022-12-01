package net.csibio.injection.client.domain.query;

import lombok.Data;
@Data
public class PlatformQuery extends PageQuery {

    /**
     * 主键id
     */
    private String id;

    /** 平台名称,可自定义,不可重复 */
    private String name;

    /**
     * 设备号
     */
    private String device;

    /** 展示排序,当本字段为空时默认会按照name字段进行排序 */
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
     * fileId
     */
    private String fileId;


    public PlatformQuery(){}
    public PlatformQuery(String name){
        this.name = name;
    }
}

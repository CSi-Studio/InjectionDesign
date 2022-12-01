package net.csibio.injection.client.domain.vo.project;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
public class ProjectUpdateVO {

    /**
     * 项目id
     */
    String id;

    /**
     * 项目编号
     */
    String name;

    /**
     * 项目名称
     */
    String alias;

    /**
     * 项目负责人
     */
    String owner;

    /**
     * 存储平台信息,Key为Platform名称
     */
    Set<String> platforms;

}

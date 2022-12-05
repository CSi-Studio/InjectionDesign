package net.csibio.injection.domain.vo.project;

import lombok.Data;

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
}

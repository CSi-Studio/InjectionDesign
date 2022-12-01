package net.csibio.injection.client.domain.vo.project;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.*;

@Data
public class ProjectAddVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 7174489212640468354L;
    /**
     * 项目编号
     */
    private String name;

    /**
     * 项目名称
     */
    private String alias;

    /**
     * 负责人
     */
    private String owner;

    /**
     * 项目平台
     */
    private Set<String> platforms;
}

package net.csibio.injection.client.domain.vo.runTemplate;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class RunTemplateVO implements Serializable {

    /**
     * 模板名称
     */
    private String templateName;

    /**
     * 负责人
     */
    private String owner;

    /**
     * 设备
     */
    private String device;

    /**
     * boardType
     */
    private String boardType;

    /**
     * 进样顺序
     */
    private List<InjectOrderVO> dataSource;
}

package net.csibio.injection.client.domain.vo.order;

import lombok.Data;
import net.csibio.injection.client.domain.db.BoardDO;

import java.io.Serializable;
import java.util.List;

@Data
public class ProjectBatchVO implements Serializable {
    /**
     * 项目id
     */
    private String projectId;

    /**
     * 项目下的样本板信息
     */
    private List<BoardDO> boardDOList;
}

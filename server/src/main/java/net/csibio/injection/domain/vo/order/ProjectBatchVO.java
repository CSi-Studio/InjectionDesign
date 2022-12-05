package net.csibio.injection.domain.vo.order;

import lombok.Data;
import net.csibio.injection.domain.db.BoardDO;

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

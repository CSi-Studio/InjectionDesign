package net.csibio.injection.client.domain.vo.order;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 工单里的样本板信息
 * 工单里面包含某一样本类型所需的样本板个数，及每个板子里是否前处理为合格的样本
 */
@Data
public class PreOrderSampleBoardVO implements Serializable {

    /**
     * 工单里样本信息
     */
    List<SampleBoardVO> sampleBoardVOList;

}



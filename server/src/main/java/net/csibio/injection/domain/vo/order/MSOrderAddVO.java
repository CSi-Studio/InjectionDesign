package net.csibio.injection.domain.vo.order;

import lombok.Data;
import net.csibio.injection.domain.vo.msOrder.PreHeartDataVO;
import net.csibio.injection.domain.vo.msOrder.WorkCurveDataVO;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
public class MSOrderAddVO implements Serializable {
    @Serial
    private static final long serialVersionUID = -146077277217471720L;

    /**
     * 负责人
     */
    private String owner;

    /**
     * 项目id
     */
    private String projectId;

    /**
     * 样本处理方法
     */
    private List<String> specSampMethod;

    /**
     * 进样样本
     */
    private List<String> incomingSamData;

    /**
     * 预热数据
     */
    private List<PreHeartDataVO> preHeartData;

    /**
     * 工作曲线
     */
    private List<WorkCurveDataVO> workCurveData;

    /**
     * 色谱柱编号
     */
    private String colorSpectrumCode;

}

package net.csibio.injection.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.csibio.injection.domain.db.base.BaseDO;
import net.csibio.injection.domain.vo.msOrder.PreHeartDataVO;
import net.csibio.injection.domain.vo.msOrder.WorkCurveDataVO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "ms_order")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MSOrderDO  extends BaseDO implements Serializable {

    @Serial
    private static final long serialVersionUID = -4879934857871272931L;

    /**
     * 主键id
     */
    @Id
    private String id;

    /**
     * 工单名称
     */
    @Indexed
    private String name;

    /**
     * 设备
     */
    private String device;

    /**
     * 进样方式
     */
    private String runSampleMethod;

    /**
     * 进样样本
     */
    private List<String> runBoardList;

    /**
     * 检测平台
     */
    private String platform;

    /**
     * 负责人
     */
    private String owner;

    /**
     * 预热
     */
    private List<PreHeartDataVO> preHeartData;

    /**
     * 工作曲线
     */
    private List<WorkCurveDataVO> workCurve;

    /**
     * 工单状态
     */
    private Integer status;

    /**
     * 进样状态
     */
    private Integer runSampleStatus;

    /**
     * 色谱柱编号
     */
    private String colorSpectrumCode;


    /**
     * 创建日期
     */
    Date createDate;

    /**
     * 最后修改日期
     */
    Date lastModifiedDate;

    /**
     * 项目id
     */
    private String projectId;

}



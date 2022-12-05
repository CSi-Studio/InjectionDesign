package net.csibio.injection.validate;

import net.csibio.injection.constants.enums.ResultCode;
import net.csibio.injection.domain.vo.msOrder.PreHeartDataVO;
import net.csibio.injection.domain.vo.order.MSOrderAddVO;
import net.csibio.injection.utils.CommonUtil;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MSOrderValidate {

    public Boolean checkMSOrderAdd(MSOrderAddVO msOrderAddVO) {
        CommonUtil.checkIsNotNull(msOrderAddVO, ResultCode.MS_ORDER_VO_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(msOrderAddVO.getOwner(), ResultCode.MS_ORDER_OWNER_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(msOrderAddVO.getProjectId(), ResultCode.MS_ORDER_PROJECT_ID_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(msOrderAddVO.getIncomingSamData(), ResultCode.MS_ORDER_RUN_BOARD_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(msOrderAddVO.getSpecSampMethod(), ResultCode.MS_ORDER_SPEC_SAMPLE_METHOD_CANNOT_BE_EMPTY);

        if (CollectionUtils.isNotEmpty(msOrderAddVO.getPreHeartData())) {
            List<PreHeartDataVO> preHeartDataVOList = msOrderAddVO.getPreHeartData();
            preHeartDataVOList.forEach(preHeartDataVO -> {
                CommonUtil.checkIsNotNull(preHeartDataVO.getFrequency(), ResultCode.MS_ORDER_PRE_HEART_FREQUENCY_CANNOT_BE_EMPTY);
                CommonUtil.checkIsNotNull(preHeartDataVO.getPosition(), ResultCode.MS_ORDER_PRE_HEART_ADDRESS_CANNOT_BE_EMPTY);
                CommonUtil.checkIsNotNull(preHeartDataVO.getMethod(), ResultCode.MS_ORDER_PRE_HEART_METHOD_CANNOT_BE_EMPTY);
            });
        }
        return true;
    }
}

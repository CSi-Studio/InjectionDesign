package net.csibio.injection.core.validate;

import net.csibio.injection.client.constants.enums.ResultCode;
import net.csibio.injection.client.domain.vo.msOrder.PreHeartDataVO;
import net.csibio.injection.client.domain.vo.order.MSOrderAddVO;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static net.csibio.injection.client.utils.CommonUtil.checkIsNotNull;

@Service
public class MSOrderValidate {

    public Boolean checkMSOrderAdd(MSOrderAddVO msOrderAddVO) {
        checkIsNotNull(msOrderAddVO, ResultCode.MS_ORDER_VO_CANNOT_BE_EMPTY);
        checkIsNotNull(msOrderAddVO.getOwner(), ResultCode.MS_ORDER_OWNER_CANNOT_BE_EMPTY);
        checkIsNotNull(msOrderAddVO.getProjectId(), ResultCode.MS_ORDER_PROJECT_ID_CANNOT_BE_EMPTY);
        checkIsNotNull(msOrderAddVO.getIncomingSamData(), ResultCode.MS_ORDER_RUN_BOARD_CANNOT_BE_EMPTY);
        checkIsNotNull(msOrderAddVO.getSpecSampMethod(), ResultCode.MS_ORDER_SPEC_SAMPLE_METHOD_CANNOT_BE_EMPTY);

        if (CollectionUtils.isNotEmpty(msOrderAddVO.getPreHeartData())) {
            List<PreHeartDataVO> preHeartDataVOList = msOrderAddVO.getPreHeartData();
            preHeartDataVOList.forEach(preHeartDataVO -> {
                checkIsNotNull(preHeartDataVO.getFrequency(), ResultCode.MS_ORDER_PRE_HEART_FREQUENCY_CANNOT_BE_EMPTY);
                checkIsNotNull(preHeartDataVO.getPosition(), ResultCode.MS_ORDER_PRE_HEART_ADDRESS_CANNOT_BE_EMPTY);
                checkIsNotNull(preHeartDataVO.getMethod(), ResultCode.MS_ORDER_PRE_HEART_METHOD_CANNOT_BE_EMPTY);
            });
        }
        return true;
    }
}

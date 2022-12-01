package net.csibio.injection.core.validate;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.constants.enums.ResultCode;
import net.csibio.injection.client.constants.enums.SampleSaveType;
import net.csibio.injection.client.domain.vo.order.PreOrderAddVO;
import org.springframework.stereotype.Service;

import static net.csibio.injection.client.utils.CommonUtil.checkIsNotNull;

@Service
@Slf4j
public class PreOrderValidate {

    public Boolean checkPreOrderAdd(PreOrderAddVO preOrderAddVO) {
        checkIsNotNull(preOrderAddVO.getProjectId(), ResultCode.PROJECT_ID_CANNOT_BE_EMPTY);
        if (preOrderAddVO.getSaveType().equals(SampleSaveType.MANUAL_ADD.getCode())) {
            checkIsNotNull(preOrderAddVO.getSampleTotal(), ResultCode.SAMPLE_COUNT_CANNOT_BE_EMPTY);
        }
        if (preOrderAddVO.getSaveType().equals(SampleSaveType.SAMPLE_SELECT.getCode())) {
            checkIsNotNull(preOrderAddVO.getSampleList(), ResultCode.SAMPLE_SELECT_CANNOT_BE_EMPTY);
        }
        if (preOrderAddVO.getSaveType().equals(SampleSaveType.EXCEL_UPLOAD.getCode())) {
            checkIsNotNull(preOrderAddVO.getFile(), ResultCode.EXCEL_UPLOAD_CANNOT_BE_EMPTY);
        }
        return true;

    }

}

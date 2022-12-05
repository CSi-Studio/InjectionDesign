package net.csibio.injection.validate;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.constants.enums.ResultCode;
import net.csibio.injection.constants.enums.SampleSaveType;
import net.csibio.injection.domain.vo.order.PreOrderAddVO;
import net.csibio.injection.utils.CommonUtil;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PreOrderValidate {

    public Boolean checkPreOrderAdd(PreOrderAddVO preOrderAddVO) {
        CommonUtil.checkIsNotNull(preOrderAddVO.getProjectId(), ResultCode.PROJECT_ID_CANNOT_BE_EMPTY);
        if (preOrderAddVO.getSaveType().equals(SampleSaveType.MANUAL_ADD.getCode())) {
            CommonUtil.checkIsNotNull(preOrderAddVO.getSampleTotal(), ResultCode.SAMPLE_COUNT_CANNOT_BE_EMPTY);
        }
        if (preOrderAddVO.getSaveType().equals(SampleSaveType.SAMPLE_SELECT.getCode())) {
            CommonUtil.checkIsNotNull(preOrderAddVO.getSampleList(), ResultCode.SAMPLE_SELECT_CANNOT_BE_EMPTY);
        }
        if (preOrderAddVO.getSaveType().equals(SampleSaveType.EXCEL_UPLOAD.getCode())) {
            CommonUtil.checkIsNotNull(preOrderAddVO.getFile(), ResultCode.EXCEL_UPLOAD_CANNOT_BE_EMPTY);
        }
        return true;

    }

}

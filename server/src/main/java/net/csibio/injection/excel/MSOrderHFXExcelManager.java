package net.csibio.injection.excel;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.db.MSOrderDO;
import net.csibio.injection.domain.query.MSOrderQuery;
import net.csibio.injection.domain.vo.msOrder.MsOrderHSXExcelVO;
import net.csibio.injection.service.IMSOrderService;
import net.csibio.injection.utils.ExcelManagerUtil;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MSOrderHFXExcelManager extends ExcelManagerUtil<MSOrderDO, MSOrderQuery, IMSOrderService, MsOrderHSXExcelVO> {
    public MSOrderHFXExcelManager(IMSOrderService imsOrderService) {
        super(imsOrderService);
    }
}

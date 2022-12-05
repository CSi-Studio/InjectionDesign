package net.csibio.injection.excel;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.db.PreOrderDO;
import net.csibio.injection.domain.query.PreOrderQuery;
import net.csibio.injection.domain.vo.SampleLocation.SampleLocationExcelVO;
import net.csibio.injection.service.IPreOrderService;
import net.csibio.injection.utils.ExcelManagerUtil;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PreOrderExcelManager extends ExcelManagerUtil<PreOrderDO, PreOrderQuery, IPreOrderService, SampleLocationExcelVO> {
    public PreOrderExcelManager(IPreOrderService iPreOrderService) {
        super(iPreOrderService);
    }
}

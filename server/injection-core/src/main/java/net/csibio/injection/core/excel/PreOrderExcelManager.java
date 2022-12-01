package net.csibio.injection.core.excel;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.domain.db.PreOrderDO;
import net.csibio.injection.client.domain.query.PreOrderQuery;
import net.csibio.injection.client.domain.vo.SampleLocation.SampleLocationExcelVO;
import net.csibio.injection.client.service.IPreOrderService;
import net.csibio.injection.core.utils.ExcelManagerUtil;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PreOrderExcelManager extends ExcelManagerUtil<PreOrderDO, PreOrderQuery, IPreOrderService, SampleLocationExcelVO> {
    public PreOrderExcelManager(IPreOrderService iPreOrderService) {
        super(iPreOrderService);
    }
}

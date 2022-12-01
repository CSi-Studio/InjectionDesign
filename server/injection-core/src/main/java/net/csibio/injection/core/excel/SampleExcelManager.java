package net.csibio.injection.core.excel;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.domain.db.SampleDO;
import net.csibio.injection.client.domain.query.SampleQuery;
import net.csibio.injection.client.domain.vo.sample.SampleExcelVO;
import net.csibio.injection.client.service.ISampleService;
import net.csibio.injection.core.utils.ExcelManagerUtil;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SampleExcelManager extends ExcelManagerUtil<SampleDO, SampleQuery, ISampleService, SampleExcelVO> {
    public SampleExcelManager(ISampleService sampleService) {
        super(sampleService);
    }

}

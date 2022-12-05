package net.csibio.injection.excel;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.query.SampleQuery;
import net.csibio.injection.domain.vo.sample.SampleExcelVO;
import net.csibio.injection.service.ISampleService;
import net.csibio.injection.utils.ExcelManagerUtil;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SampleExcelManager extends ExcelManagerUtil<SampleDO, SampleQuery, ISampleService, SampleExcelVO> {
    public SampleExcelManager(ISampleService sampleService) {
        super(sampleService);
    }

}

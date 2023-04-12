package net.csibio.injection.converter.sample;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.vo.sample.SampleExcelVO;
import org.checkerframework.checker.nullness.qual.AssertNonNullIfNonNull;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
public class SampleConverterTest {

    @InjectMocks
    private SampleConverter sampleConverter;

    @Test
    public void convertToSampleDO() {
        SampleDO sampleDO = sampleConverter.convertToSampleDO(new ProjectDO(), new SampleExcelVO());
        Assert.notNull(sampleDO, "not null");
    }
}

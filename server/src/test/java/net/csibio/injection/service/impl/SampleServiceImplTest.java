package net.csibio.injection.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.controller.SampleControllerTest;
import net.csibio.injection.converter.sample.SampleConverter;
import net.csibio.injection.dao.SampleDAO;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.query.SampleQuery;
import net.csibio.injection.domain.vo.sample.SampleExcelVO;
import net.csibio.injection.service.IProjectService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
public class SampleServiceImplTest {
    @InjectMocks
    private SampleServiceImpl sampleService;

    @Mock
    private SampleDAO sampleDAO;

    @Mock
    private SampleConverter sampleConverter;

    @Mock
    private IProjectService projectService;

    @Test
    public void getBySampleNo() {
        Mockito.when(sampleDAO.getBySampleNo(any(), any())).thenReturn(new SampleDO());
        SampleDO sampleDO = sampleService.getBySampleNo(any(), any());
        Assert.notNull(sampleDO, "not null");
    }


    @Test
    public void saveBatchWithExcelVO() {
        Mockito.when(sampleDAO.getBySampleNo(any(), any())).thenReturn(new SampleDO());
        Mockito.when(sampleConverter.convertToSampleDO(any(), any())).thenReturn(new SampleDO());
        Mockito.when(sampleDAO.insert((SampleDO) any())).thenReturn(new SampleDO());

        SampleExcelVO sampleExcelVO = new SampleExcelVO();
        sampleExcelVO.setSampleId("sampleId");
        sampleService.saveBatchWithExcelVO(new ProjectDO(), sampleExcelVO, new ArrayList<>());
    }

}

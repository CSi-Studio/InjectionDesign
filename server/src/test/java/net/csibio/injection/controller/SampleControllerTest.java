package net.csibio.injection.controller;

import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.vo.project.ProjectUpdateVO;
import net.csibio.injection.domain.vo.sample.SampleAddVO;
import net.csibio.injection.excel.SampleExcelManager;
import net.csibio.injection.service.IProjectService;
import net.csibio.injection.service.ISampleService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
public class SampleControllerTest {

    @InjectMocks
    private SampleController sampleController;

    @Mock
    private ISampleService sampleService;

    @Mock
    private SampleExcelManager sampleExcelManager;

    @Mock
    private IProjectService projectService;

    @BeforeEach
    public void init() {
        log.info("-----------TEST START！-------------");
    }

    @AfterEach
    void afterEach() {
        log.info("-----------TEST END！-------------");
    }


    @Test
    void add() {
        ProjectDO projectDO = new ProjectDO();
        projectDO.setName("project");
        Mockito.when(projectService.getById(any())).thenReturn(projectDO);

        SampleDO sampleDO = new SampleDO();
        sampleDO.setId("sampleId");
        Mockito.when(sampleService.getBySampleNo(any(), any())).thenReturn(sampleDO);
        Mockito.when(sampleService.insert((SampleDO) any())).thenReturn(Result.OK());

        SampleAddVO sampleAddVO = new SampleAddVO();
        sampleAddVO.setSampleNo("sampleNO");
        Result update = sampleController.add(sampleAddVO);
        Assert.isTrue(update.isSuccess(), "UPDATE ERROR");

    }

    @Test
    void save() {
    }

    @Test
    void list() {
    }

    @Test
    void all() {
    }

    @Test
    void blurList() {
    }

    @Test
    void update() {
    }

    @Test
    void delete() {
    }

    @Test
    void checkExcel() {
    }

    @Test
    void uploadExcel() {
    }
}

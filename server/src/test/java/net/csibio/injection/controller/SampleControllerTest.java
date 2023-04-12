package net.csibio.injection.controller;

import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.query.SampleQuery;
import net.csibio.injection.domain.vo.project.ProjectUpdateVO;
import net.csibio.injection.domain.vo.sample.SampleAddVO;
import net.csibio.injection.domain.vo.sample.SampleUpdateVO;
import net.csibio.injection.excel.SampleExcelManager;
import net.csibio.injection.service.IProjectService;
import net.csibio.injection.service.ISampleService;
import org.apache.commons.compress.utils.Lists;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
    public void add() {
        ProjectDO projectDO = new ProjectDO();
        projectDO.setName("project");
        Mockito.when(projectService.getById(any())).thenReturn(projectDO);

        Mockito.when(sampleService.getBySampleNo(any(), any())).thenReturn(null);
        Mockito.when(sampleService.insert((SampleDO) any())).thenReturn(Result.OK());

        SampleAddVO sampleAddVO = new SampleAddVO();
        sampleAddVO.setSampleNo("sampleNO");
        sampleAddVO.setProjectId("projectId");
        Result update = sampleController.add(sampleAddVO);
        Assert.isTrue(update.isSuccess(), "UPDATE ERROR");

    }

    @Test
    public void save() {
        ProjectDO projectDO = new ProjectDO();
        projectDO.setName("project");
        Mockito.when(projectService.getById(any())).thenReturn(projectDO);
        Mockito.when(projectService.update(any())).thenReturn(Result.OK());
        Result result = sampleController.save("projectId");
        Assert.isTrue(result.isSuccess(), "SAVE ERROR");
    }

    @Test
    public void list() throws Exception {
        Mockito.when(sampleService.getList(any())).thenReturn(Result.OK());
        Result update = sampleController.list(new SampleQuery());
        Assert.isTrue(update.isSuccess(), "LIST ERROR");
    }

    @Test
    public void all() throws Exception {
        List<SampleDO> sampleDOList = new ArrayList<>();
        Mockito.when(sampleService.getAll(any())).thenReturn(sampleDOList);
        Result result = sampleController.all(new SampleQuery());
        Assert.isTrue(result.isSuccess(), "GET ALL ERROR");

        SampleQuery sampleQuery = new SampleQuery();
        sampleQuery.setProjectId("projectId");
        Result result1 = sampleController.all(new SampleQuery());
        Assert.isTrue(result1.isSuccess(), "GET ALL ERROR");
    }

    @Test
    public void blurList() throws Exception {
        List<SampleDO> sampleDOList = new ArrayList<>();
        Mockito.when(sampleService.getAll(any())).thenReturn(sampleDOList);
        Result result = sampleController.blurList(new SampleQuery());
        Assert.isTrue(result.isSuccess(), "BlurList ALL ERROR");
    }

    @Test
    public void update() {
        Mockito.when(sampleService.getById(any())).thenReturn(new SampleDO());
        Mockito.when(sampleService.update(any())).thenReturn(Result.OK());
        Result result = sampleController.update(new SampleUpdateVO());
        Assert.isTrue(result.isSuccess(), "SAVE ERROR");
    }

    @Test
    public void delete() {
        Mockito.when(sampleService.getById(any())).thenReturn(new SampleDO());
        Mockito.when(sampleService.remove((String) any())).thenReturn(Result.OK());
        Result result = sampleController.delete("sampleId");
        Assert.isTrue(result.isSuccess(), "remove ERROR");
    }

}

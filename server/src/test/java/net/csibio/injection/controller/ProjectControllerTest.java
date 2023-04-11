package net.csibio.injection.controller;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.vo.project.ProjectUpdateVO;
import net.csibio.injection.exceptions.XException;
import net.csibio.injection.service.IProjectService;
import net.csibio.injection.service.ISampleService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
public class ProjectControllerTest {

    @Mock
    private IProjectService projectService;

    @Mock
    private ISampleService sampleService;

    @InjectMocks
    private ProjectController projectController;

    @BeforeEach
    public void init() {
        log.info("-----------TEST START！-------------");
    }

    @AfterEach
    void afterEach() {
        log.info("-----------TEST END！-------------");
    }

    @Test
    public void update() {
        ProjectDO projectDO = new ProjectDO();
        Mockito.when(projectService.getById(any())).thenReturn(projectDO);
        Mockito.when(projectService.update(any())).thenReturn(Result.OK());
        ProjectUpdateVO projectAddVO = new ProjectUpdateVO();
        projectAddVO.setName("project");
        Result update = projectController.update(projectAddVO);
        Assert.isTrue(update.isSuccess(), "UPDATE ERROR");
    }

    @Test
    public void delete() throws Exception {
        ProjectDO projectDO = new ProjectDO();
        Mockito.when(projectService.tryGetById(any(), any())).thenReturn(projectDO);
        Mockito.doNothing().when(sampleService).clearByProjectDO(any());
        Mockito.when(projectService.remove(anyString())).thenReturn(Result.OK());

        String projectId = "project";
        Result update = projectController.delete(projectId);
        Assert.isTrue(update.isSuccess(), "DELETE ERROR");
    }

    @Test
    public void list() {
        ProjectDO projectDO = new ProjectDO();
        Mockito.when(projectService.getById(any())).thenReturn(projectDO);
        Mockito.when(projectService.update(any())).thenReturn(Result.OK());
        ProjectUpdateVO projectAddVO = new ProjectUpdateVO();
        projectAddVO.setName("project");
        Result update = projectController.update(projectAddVO);
        Assert.isTrue(update.isSuccess(), "LIST ERROR");
    }

    @Test
    public void detail() {
        ProjectDO projectDO = new ProjectDO();
        Mockito.when(projectService.getById(any())).thenReturn(projectDO);
        Result update = projectController.detail("project");
        Assert.isTrue(update.isSuccess(), "DETAIl ERROR");
    }
}

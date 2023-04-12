package net.csibio.injection.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.dao.ProjectDAO;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.db.SysUserDO;
import org.junit.Test;
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
public class ProjectServiceImplTest {

    @InjectMocks
    private ProjectServiceImpl projectService;

    @Mock
    private ProjectDAO projectDAO;


    @Test
    public void getByAlias() {
        Mockito.when(projectDAO.getByAlias(any())).thenReturn(new ProjectDO());
        ProjectDO projectDO = projectService.getByAlias("alias");
        Assert.notNull(projectDO, "not null");
    }

    @Test
    public void getByName() {
        Mockito.when(projectDAO.getByName(any())).thenReturn(new ProjectDO());
        ProjectDO projectDO = projectService.getByName("alias");
        Assert.notNull(projectDO, "not null");

    }
}

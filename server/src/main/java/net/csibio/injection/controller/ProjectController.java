package net.csibio.injection.controller;

import net.csibio.injection.constants.Constants;
import net.csibio.injection.constants.enums.*;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.vo.project.ProjectAddVO;
import net.csibio.injection.domain.vo.project.ProjectUpdateVO;
import net.csibio.injection.validate.ProjectValidate;
import net.csibio.injection.domain.db.*;
import net.csibio.injection.domain.query.*;
import net.csibio.injection.service.*;
import net.csibio.injection.utils.CommonUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("project")
public class ProjectController extends BaseController<ProjectDO, ProjectQuery> {

    @Autowired
    IProjectService projectService;

    @Autowired
    ProjectValidate projectValidate;

    @Autowired
    ISampleService sampleService;

    @Override
    BaseService<ProjectDO, ProjectQuery> getBaseService() {
        return projectService;
    }

    @PostMapping(value = "/add")
    Result add(ProjectAddVO projectAdd, HttpServletRequest request) {
        String token = request.getHeader(Constants.X_ACCESS_TOKEN);
        if (StringUtils.isBlank(token)) {
            token = request.getParameter("token");
        }
        projectValidate.checkAddProject(projectAdd);
        Result result = projectService.insert(buildProjectDO(projectAdd, token));
        if (result.isFailed()) {
            return result;
        }
        return Result.OK();
    }

    @RequestMapping(value = "/update")
    Result update(ProjectUpdateVO projectUpdate) {
        ProjectDO project = projectService.getById(projectUpdate.getId());
        CommonUtil.checkIsNotNull(project, ResultCode.PROJECT_NOT_EXISTED);
        BeanUtils.copyProperties(projectUpdate, project);
        return projectService.update(project);
    }

    @RequestMapping(value = "/delete")
    Result delete(@RequestParam(value = "id", required = true) String projectId) throws Exception {
        ProjectDO project = projectService.tryGetById(projectId, ResultCode.PROJECT_NOT_EXISTED);
        sampleService.clearByProjectDO(project);
        return projectService.remove(projectId);
    }

    @RequestMapping(value = "/list")
    Result list(ProjectQuery query, HttpServletRequest request) {
        String token = request.getHeader(Constants.X_ACCESS_TOKEN);
        if (StringUtils.isBlank(token)) {
            token = request.getParameter("token");
        }
        // 按创建时间倒排
        query.setOrderBy(Sort.Direction.DESC);
        query.setSortColumn("createDate");
        query.setUserId(token);
        Result<List<ProjectDO>> res = projectService.getList(query);
        return res;
    }

    @RequestMapping(value = "/detail")
    Result detail(@RequestParam(value = "id", required = true) String id) {
        ProjectDO projectDO = projectService.getById(id);
        check(projectDO, ResultCode.PROJECT_NOT_EXISTED);
        return Result.build(projectDO);
    }

    private ProjectDO buildProjectDO(ProjectAddVO projectAdd, String userId) {
        return ProjectDO.builder().name(projectAdd.getName())
                .alias(projectAdd.getAlias())
                .owner(projectAdd.getOwner())
                .userId(userId)
                .build();
    }
}

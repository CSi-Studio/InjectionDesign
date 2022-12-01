package net.csibio.injection.core.controller;

import net.csibio.injection.client.constants.Constants;
import net.csibio.injection.client.constants.enums.*;
import net.csibio.injection.client.domain.Result;
import net.csibio.injection.client.domain.db.*;
import net.csibio.injection.client.domain.query.*;
import net.csibio.injection.client.domain.vo.project.ProjectAddVO;
import net.csibio.injection.client.domain.vo.project.ProjectUpdateVO;
import net.csibio.injection.client.service.*;
import net.csibio.injection.core.validate.ProjectValidate;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

import static net.csibio.injection.client.utils.CommonUtil.checkIsNotNull;

@RestController
@RequestMapping("project")
public class ProjectController extends BaseController<ProjectDO, ProjectQuery> {

    @Autowired
    IProjectService projectService;

    @Autowired
    ProjectValidate projectValidate;

    @Autowired
    IPreOrderService preOrderService;

    @Autowired
    IBoardService boardService;

    @Autowired
    ISamplePositionService samplePositionService;

    @Autowired
    ISampleService sampleService;

    @Autowired
    IMSOrderService msOrderService;

    @Autowired
    IBatchService batchService;

    @Autowired
    IMSRunSampleService runSampleService;

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
        checkIsNotNull(project, ResultCode.PROJECT_NOT_EXISTED);
        BeanUtils.copyProperties(projectUpdate, project);
        return projectService.update(project);
    }

    @RequestMapping(value = "/delete")
    Result delete(@RequestParam(value = "id", required = true) String projectId) throws Exception {
        ProjectDO project = projectService.tryGetById(projectId, ResultCode.PROJECT_NOT_EXISTED);
        // 删除对应的前处理工单
        List<PreOrderDO> preOrderDOList = preOrderService.getByProjectId(projectId);
        if (CollectionUtils.isNotEmpty(preOrderDOList)) {
            // 删除对应的孔板信息
            preOrderDOList.forEach(preOrder -> {
                BoardQuery boardQuery = new BoardQuery();
                boardQuery.setPreOrderId(preOrder.getId());
                boardQuery.setStatus(BoardStatus.VALID.getCode());
                List<BoardDO> boardDOList = boardService.getAll(boardQuery);
                // 删除对应的孔板样本
                if (CollectionUtils.isNotEmpty(boardDOList)) {
                    boardDOList.forEach(boardDO -> {
                        SamplePositionQuery samplePositionQuery = new SamplePositionQuery();
                        samplePositionQuery.setBoardId(boardDO.getId());
                        samplePositionQuery.setStatus(SamplePositionStatus.VALID.getCode());
                        List<SamplePositionDO> samplePositionDOList = samplePositionService.getAll(samplePositionQuery);
                        if (CollectionUtils.isNotEmpty(samplePositionDOList)) {
                            samplePositionDOList.forEach(samplePositionDO -> {
                                // 更新samplePosition无效
                                samplePositionDO.setStatus(SamplePositionStatus.INVALID.getCode());
                                samplePositionService.update(samplePositionDO);
                            });
                        }
                        // 更新boardStatus 无效
                        boardDO.setStatus(BoardStatus.INVALID.getCode());
                        boardService.update(boardDO);
                    });
                }
                // 更新preOrderStatus 无效
                preOrder.setStatus(PreOrderStatus.INVALID.getCode());
                preOrderService.update(preOrder);
            });
        }

        MSOrderQuery msOrderQuery = new MSOrderQuery();
        msOrderQuery.setProjectId(projectId);
        msOrderQuery.setStatus(MSOrderStatus.VALID.getCode());
        List<MSOrderDO> msOrderDOList = msOrderService.getAll(msOrderQuery);
        // 删除对应的质谱工单
        if (CollectionUtils.isNotEmpty(msOrderDOList)) {
            // 删除批次进样
            msOrderDOList.forEach(msOrderDO -> {
                BatchQuery batchQuery = new BatchQuery();
                batchQuery.setMsOrderId(msOrderDO.getId());
                List<BatchDO> batchDOList = batchService.getAll(batchQuery);
                if (CollectionUtils.isNotEmpty(batchDOList)) {
                    batchDOList.forEach(batchDO -> {
                    });
                }

                // 删除对应的进样
                MSRunQuery runQuery = new MSRunQuery();
                runQuery.setMsOrderId(msOrderDO.getId());
                runQuery.setStatus(MSOrderStatus.VALID.getCode());
                List<MSRunDO> msRunDOList = runSampleService.getAll(runQuery);
                if (CollectionUtils.isNotEmpty(msRunDOList)) {
                    msRunDOList.forEach(msRunDO -> {
                    });
                }

                // 更新质谱状态无效
                msOrderDO.setStatus(MSOrderStatus.INVALID.getCode());
                msOrderService.update(msOrderDO);
            });
        }

        // 删除对应的样本
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
                .platforms(projectAdd.getPlatforms())
                .userId(userId)
                .build();
    }
}

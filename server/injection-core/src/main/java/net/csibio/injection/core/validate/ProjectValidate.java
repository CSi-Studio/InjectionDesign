package net.csibio.injection.core.validate;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.constants.enums.ResultCode;
import net.csibio.injection.client.domain.db.ProjectDO;
import net.csibio.injection.client.domain.vo.project.ProjectAddVO;
import net.csibio.injection.client.exceptions.ParamsCheckException;
import net.csibio.injection.client.service.IProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static net.csibio.injection.client.utils.CommonUtil.checkIsNotNull;

@Service
@Slf4j
public class ProjectValidate {

    @Autowired
    private IProjectService projectService;

    public Boolean checkAddProject(ProjectAddVO projectAdd) {
        checkIsNotNull(projectAdd.getAlias(), ResultCode.PROJECT_NAME_CANNOT_BE_EMPTY);
        checkIsNotNull(projectAdd.getName(), ResultCode.PROJECT_NO_CANNOT_BE_EMPTY);

        // 检查项目编号是否重复
        ProjectDO projectNoExist = projectService.getByName(projectAdd.getName());
        if (projectNoExist != null) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "projectValidate", "checkAddProject", ResultCode.SAME_PROJECT_EXISTED);
            log.error(errMsg);
            throw new ParamsCheckException(ResultCode.SAME_PROJECT_NO_EXISTED.getCode(), ResultCode.SAME_PROJECT_NO_EXISTED.getMessage());
        }
        return true;
    }
}

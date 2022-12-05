package net.csibio.injection.validate;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.constants.enums.ResultCode;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.vo.project.ProjectAddVO;
import net.csibio.injection.exceptions.ParamsCheckException;
import net.csibio.injection.service.IProjectService;
import net.csibio.injection.utils.CommonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ProjectValidate {

    @Autowired
    private IProjectService projectService;

    public Boolean checkAddProject(ProjectAddVO projectAdd) {
        CommonUtil.checkIsNotNull(projectAdd.getAlias(), ResultCode.PROJECT_NAME_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(projectAdd.getName(), ResultCode.PROJECT_NO_CANNOT_BE_EMPTY);

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

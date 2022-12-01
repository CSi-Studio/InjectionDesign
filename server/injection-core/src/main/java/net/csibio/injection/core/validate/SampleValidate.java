package net.csibio.injection.core.validate;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.constants.enums.ResultCode;
import net.csibio.injection.client.domain.db.ProjectDO;
import net.csibio.injection.client.domain.db.SampleDO;
import net.csibio.injection.client.domain.vo.sample.SampleAddVO;
import net.csibio.injection.client.exceptions.ParamsCheckException;
import net.csibio.injection.client.service.IProjectService;
import net.csibio.injection.client.service.ISampleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static net.csibio.injection.client.utils.CommonUtil.checkIsNotNull;

@Service
@Slf4j
public class SampleValidate {
    @Autowired
    private ISampleService sampleService;

    @Autowired
    private IProjectService projectService;

    public Boolean checkSampleAdd(SampleAddVO sampleAdd) {
        return true;
    }


}

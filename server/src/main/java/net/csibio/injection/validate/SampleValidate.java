package net.csibio.injection.validate;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.vo.sample.SampleAddVO;
import net.csibio.injection.service.IProjectService;
import net.csibio.injection.service.ISampleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

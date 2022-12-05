package net.csibio.injection.converter.sample;

import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.vo.sample.SampleExcelVO;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class SampleConverter {
    public SampleDO convertToSampleDO(ProjectDO project, SampleExcelVO sampleExcelVO) {
        return SampleDO.builder()
                .sampleNo(sampleExcelVO.getSampleId())
                .projectId(project.getName())
                .dim1(sampleExcelVO.getDim1())
                .dim2(sampleExcelVO.getDim2())
                .dim3(sampleExcelVO.getDim3())
                .createDate(new Date())
                .lastModifiedDate(new Date())
                .build();

    }
}

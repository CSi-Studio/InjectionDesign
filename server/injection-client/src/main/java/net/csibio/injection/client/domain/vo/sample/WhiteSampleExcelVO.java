package net.csibio.injection.client.domain.vo.sample;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

@Data
public class    WhiteSampleExcelVO {

    @ExcelProperty(value = "SampleID")
    private String sampleId;


    @ExcelProperty(value = "priority")
    private String priority;

}

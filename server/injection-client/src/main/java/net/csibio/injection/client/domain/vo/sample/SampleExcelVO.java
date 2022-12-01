package net.csibio.injection.client.domain.vo.sample;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

@Data
public class SampleExcelVO {

    @ExcelProperty(value = "SampleID")
    private String sampleId;

    @ExcelProperty(value = "Dim1")
    private String dim1;

    @ExcelProperty(value = "Dim2")
    private String dim2;

    @ExcelProperty(value = "Dim3")
    private String dim3;

}

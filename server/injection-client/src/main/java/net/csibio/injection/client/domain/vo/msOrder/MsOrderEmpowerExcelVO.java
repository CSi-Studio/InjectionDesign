package net.csibio.injection.client.domain.vo.msOrder;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

@Data
public class MsOrderEmpowerExcelVO {
    @ExcelProperty(value = "Plate/Well", index = 0)
    private String plate;

    @ExcelProperty(value = "inj Vol(μL)", index = 1)
    private String volume;

    @ExcelProperty(value = "# of injs)", index = 2)
    private String injs;

    @ExcelProperty(value = "Label", index = 3)
    private String label;

    @ExcelProperty(value = "SampleName", index = 4)
    private String sampleName;

    @ExcelProperty(value = "Level", index = 5)
    private String level;

    @ExcelProperty(value = "Function", index = 6)
    private String function;

    @ExcelProperty(value = "Method Set/Report of Export Method", index = 7)
    private String exportMethod;

    @ExcelProperty(value = "Processing", index = 8)
    private String processing;

    @ExcelProperty(value = "Run Time (Minutes)", index = 9)
    private String runTime;

    @ExcelProperty(value = "SampleWeight", index = 10)
    private String sampleWeight;

    @ExcelProperty(value = "Dilution", index = 11)
    private String dilution;


}

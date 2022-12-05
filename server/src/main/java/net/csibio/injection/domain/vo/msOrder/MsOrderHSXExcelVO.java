package net.csibio.injection.domain.vo.msOrder;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class MsOrderHSXExcelVO implements Serializable {

    @ExcelProperty(value = "Sample Type", index = 0)
    private String sampleType;

    @ExcelProperty(value = "File Name", index = 1)
    private String fileName;

    @ExcelProperty(value = "Sample ID", index = 2)
    private String sampleId;

    @ExcelProperty(value = "Path", index = 3)
    private String path;

    @ExcelProperty(value = "Instrument Method", index = 4)
    private String instrumentMethod;

    @ExcelProperty(value = "Position", index = 5)
    private String position;

    @ExcelProperty(value = "Inj Vol", index = 6)
    private String injVol;

    @ExcelProperty(value = "Sample Name", index = 7)
    private String sampleName;
}

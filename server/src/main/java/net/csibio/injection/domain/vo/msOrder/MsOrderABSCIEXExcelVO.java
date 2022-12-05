package net.csibio.injection.domain.vo.msOrder;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

@Data
public class MsOrderABSCIEXExcelVO {

    @ExcelProperty(value = "% header=SampleName", index = 0)
    private String sampleName;

    @ExcelProperty(value = "SampleID", index = 1)
    private String sampleId;

    @ExcelProperty(value = "Comments", index = 2)
    private String comments;

    @ExcelProperty(value = "AcqMethod", index = 3)
    private String acqMethod;

    @ExcelProperty(value = "ProcMethod", index = 4)
    private String procMethodRackCode;

    @ExcelProperty(value = "RackCode", index = 5)
    private String rackCode;

    @ExcelProperty(value = "PlateCode", index = 6)
    private String plateCode;

    @ExcelProperty(value = "VialPos", index = 7)
    private String vialPos;

    @ExcelProperty(value = "SmplInjVol", index = 8)
    private String smplInjVol;

    @ExcelProperty(value = "DilutFact", index = 9)
    private String dilutFact;

    @ExcelProperty(value = "WghtToVol", index = 10)
    private String wghtToVol;

    @ExcelProperty(value = "Type", index = 11)
    private String type;

    @ExcelProperty(value = "RackPos", index = 12)
    private String rackPos;

    @ExcelProperty(value = "PlatePos", index = 13)
    private String platePos;

    @ExcelProperty(value = "OutputFile", index = 14)
    private String outputFile;

}

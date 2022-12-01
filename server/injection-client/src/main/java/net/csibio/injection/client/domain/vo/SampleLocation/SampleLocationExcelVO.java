package net.csibio.injection.client.domain.vo.SampleLocation;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

import java.util.List;

@Data
public class SampleLocationExcelVO {

    /**
     * 样本id
     */
    @ExcelProperty(value = "样本id", index = 0)
    private String sampleId;

    /**
     * 样本编号
     */
    @ExcelProperty(value = "样本编号", index = 1)
    private String sampleNo;

    @ExcelProperty(value = "维度1", index = 2)
    private String dim1;
    @ExcelProperty(value = "维度2", index = 3)
    private String dim2;
    @ExcelProperty(value = "维度3", index = 4)
    private String dim3;

    /**
     * 样本整理位置
     */
    @ExcelProperty(value = "样本整理位置", index = 5)
    private String sampleLocation;

    /**
     * 9*9位置
     */
    @ExcelProperty(value = "9*9位置", index = 6)
    private String nineNineSampleBoardPosition;

    /**
     * 96孔板位置
     */
    @ExcelProperty(value = "96孔板位置", index = 7)
    private String ninetySixSampleBoardPosition;

    /**
     * ep管位置
     */
    @ExcelProperty(value = "ep管位置", index = 8)
    private String epPosition;

}

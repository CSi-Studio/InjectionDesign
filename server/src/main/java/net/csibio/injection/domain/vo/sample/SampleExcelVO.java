package net.csibio.injection.domain.vo.sample;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

import java.lang.reflect.Field;

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

    // 判断所有属性是否为空
    public boolean areAllFieldsEmpty() {
        Field[] fields = this.getClass().getDeclaredFields();
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                if (field.get(this) != null) {
                    return false;
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return true;
    }

}

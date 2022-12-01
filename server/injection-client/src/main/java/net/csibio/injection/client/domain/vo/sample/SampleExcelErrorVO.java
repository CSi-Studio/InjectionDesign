package net.csibio.injection.client.domain.vo.sample;

import lombok.Data;

@Data
public class SampleExcelErrorVO extends SampleExcelVO {
    /**
     * 错误原因
     */
    private String errorMsg;

}

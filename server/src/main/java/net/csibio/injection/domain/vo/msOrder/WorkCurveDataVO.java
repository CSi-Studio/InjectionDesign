package net.csibio.injection.domain.vo.msOrder;

import lombok.Data;

import java.io.Serializable;

@Data
public class WorkCurveDataVO implements Serializable {

    private String key;

    private String position;

    private String concentration;

    private String frequency;

    private String fileName;

    private String method;
}

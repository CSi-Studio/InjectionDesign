package net.csibio.injection.client.domain.vo.msOrder;

import lombok.Data;

import java.io.Serializable;

@Data
public class PreHeartDataVO implements Serializable {
    /**
     * key
     */
    private  String key;

    /**
     * address
     */
    private  String position;

    private String type;

    private String frequency;

    private String method;

    private String fileName;
}

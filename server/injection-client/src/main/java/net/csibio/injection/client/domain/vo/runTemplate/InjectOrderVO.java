package net.csibio.injection.client.domain.vo.runTemplate;

import lombok.Data;

import java.io.Serializable;

@Data
public class InjectOrderVO implements Serializable {
    private String key;

    private String name;

    private String times;

    private String index;
}

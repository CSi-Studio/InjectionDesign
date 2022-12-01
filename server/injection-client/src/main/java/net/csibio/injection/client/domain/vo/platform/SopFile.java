package net.csibio.injection.client.domain.vo.platform;

import lombok.Data;

import java.io.Serializable;

@Data
public class SopFile implements Serializable {
    /**
     * 文件objectId
     */
    private String objectId;

    /**
     * 文件名称
     */
    private String fileName;

}

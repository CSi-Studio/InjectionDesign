package net.csibio.injection.client.domain.vo.platform;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serial;
import java.io.Serializable;

@Data
public class PlatformAddVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 7384919594561500911L;

    /**
     * 平台名称
     */
    private String name;

    /**
     * 设备号
     */
    private String device;

    /**
     * sop文件
     */
    private MultipartFile file;

    /**
     * fileName
     */
    private String fileName;

    /**
     * 创建者
     */
    private String owner;

    /**
     * 方法文件路径
     */
    private String mathPath;

    /**
     * 质谱文件路径
     */
    private String msFilePath;

}

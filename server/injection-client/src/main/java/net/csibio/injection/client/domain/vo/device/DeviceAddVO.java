package net.csibio.injection.client.domain.vo.device;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serial;
import java.io.Serializable;

@Data
public class DeviceAddVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 4263336602786660308L;

    /**
     * 设备 名称
     */
    private String name;

    /**
     * 设备型号
     */
    private String deviceModel;

    /**
     * 设备类型
     */
    private String deviceType;

    /**
     * 负责人
     */
    private String owner;

    /**
     * 主要参数
     */
    private String mainParam;

    /**
     * 训练材料
     */
    private MultipartFile trainingMaterial;

    /**
     * 其他材料
     */
    private MultipartFile otherMaterial;

}

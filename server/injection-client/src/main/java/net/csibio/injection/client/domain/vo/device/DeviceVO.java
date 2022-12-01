package net.csibio.injection.client.domain.vo.device;

import lombok.Data;
import net.csibio.injection.client.domain.db.PlatformDO;

import java.io.Serializable;
import java.util.List;

@Data
public class DeviceVO implements Serializable {

    /**
     * id
     */
    private String id;


    /**
     * 设备名称：
     */
    private String deviceName;

    /**
     * 设备下的检测平台
     */
    private List<PlatformDO> platformList;

}

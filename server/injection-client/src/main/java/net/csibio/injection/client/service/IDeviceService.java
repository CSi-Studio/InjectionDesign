package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.DeviceDO;
import net.csibio.injection.client.domain.query.DeviceQuery;

public interface IDeviceService extends BaseService<DeviceDO, DeviceQuery>{
    DeviceDO getByName(String name);
}

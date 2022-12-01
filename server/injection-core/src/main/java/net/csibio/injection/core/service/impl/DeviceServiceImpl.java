package net.csibio.injection.core.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.domain.db.DeviceDO;
import net.csibio.injection.client.domain.db.SampleDO;
import net.csibio.injection.client.domain.query.DeviceQuery;
import net.csibio.injection.client.exceptions.XException;
import net.csibio.injection.client.service.IDAO;
import net.csibio.injection.client.service.IDeviceService;
import net.csibio.injection.core.dao.DeviceDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service("deviceService")
@Slf4j
public class DeviceServiceImpl implements IDeviceService {

    @Autowired
    DeviceDAO deviceDAO;

    @Override
    public IDAO<DeviceDO, DeviceQuery> getBaseDAO() {
        return deviceDAO;
    }

    @Override
    public void beforeInsert(DeviceDO device) throws XException {
        device.setCreateDate(new Date());
        device.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(DeviceDO device) throws XException {
        device.setLastModifiedDate(new Date());
    }

    @Override
    public DeviceDO getByName(String name) {
        try {
            return deviceDAO.getByName(name);
        } catch (Exception e) {
            log.warn(e.getMessage());
            return null;
        }
    }
}

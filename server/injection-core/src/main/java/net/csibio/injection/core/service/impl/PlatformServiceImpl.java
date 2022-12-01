package net.csibio.injection.core.service.impl;


import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.domain.db.MSOrderDO;
import net.csibio.injection.client.domain.db.PlatformDO;
import net.csibio.injection.client.domain.query.PlatformQuery;
import net.csibio.injection.client.exceptions.XException;
import net.csibio.injection.client.service.IDAO;
import net.csibio.injection.client.service.IPlatformService;
import net.csibio.injection.core.dao.PlatformDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import static net.csibio.injection.core.InjectionApplication.logger;

@Service("platformService")
@Slf4j
public class PlatformServiceImpl implements IPlatformService {
    @Autowired
    PlatformDAO platformDAO;

    @Override
    public IDAO<PlatformDO, PlatformQuery> getBaseDAO() {
        return platformDAO;
    }

    @Override
    public void beforeInsert(PlatformDO order) throws XException {
        order.setCreateDate(new Date());
        order.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(PlatformDO order) throws XException {
        order.setLastModifiedDate(new Date());
    }

    @Override
    public List<PlatformDO> getByDevice(String deviceName) {
        try {
            return platformDAO.getByDevice(deviceName);
        } catch (Exception e) {
            logger.warn(e.getMessage());
            return null;
        }
    }

    @Override
    public PlatformDO getByName(String name, String device) {
        try {
            return platformDAO.getByName(name, device);
        } catch (Exception e) {
            logger.warn(e.getMessage());
            return null;
        }
    }
}

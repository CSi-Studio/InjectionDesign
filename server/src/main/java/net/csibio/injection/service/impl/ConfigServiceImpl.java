package net.csibio.injection.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.db.ConfigDO;
import net.csibio.injection.domain.query.ConfigQuery;
import net.csibio.injection.dao.ConfigDAO;
import net.csibio.injection.exceptions.XException;
import net.csibio.injection.service.IConfigService;
import net.csibio.injection.service.IDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service("configService")
@Slf4j
public class ConfigServiceImpl implements IConfigService {

    @Autowired
    ConfigDAO configDAO;

    @Override
    public IDAO<ConfigDO, ConfigQuery> getBaseDAO() {
        return configDAO;
    }

    @Override
    public ConfigDO getByConfigNoAndType(String configNo, String configType) {
        try {
            return configDAO.getByConfigDO(configNo, configType);
        } catch (Exception e) {
            log.warn(e.getMessage());
            return null;
        }
    }

    @Override
    public void beforeInsert(ConfigDO configDO) throws XException {
        configDO.setCreateDate(new Date());
        configDO.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(ConfigDO configDO) throws XException {
        configDO.setLastModifiedDate(new Date());
    }
}

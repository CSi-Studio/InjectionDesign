package net.csibio.injection.service;

import net.csibio.injection.domain.db.ConfigDO;
import net.csibio.injection.domain.query.ConfigQuery;

public interface IConfigService extends BaseService<ConfigDO, ConfigQuery> {

    ConfigDO getByConfigNoAndType(String configNo, String configType);
}

package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.ConfigDO;
import net.csibio.injection.client.domain.query.ConfigQuery;

public interface IConfigService extends BaseService<ConfigDO, ConfigQuery> {

    ConfigDO getByConfigNoAndType(String configNo, String configType);
}

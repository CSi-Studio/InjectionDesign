package net.csibio.injection.core.dao;

import net.csibio.injection.client.domain.db.ConfigDO;
import net.csibio.injection.client.domain.db.SampleDO;
import net.csibio.injection.client.domain.query.ConfigQuery;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class ConfigDAO extends BaseDAO<ConfigDO, ConfigQuery> {

    public static String CollectionName = "config";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<ConfigDO> getDomainClass() {
        return ConfigDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(ConfigQuery configQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(configQuery.getConfigNo())) {
            query.addCriteria(where("configNo").is(configQuery.getConfigNo()));
        }
        if (StringUtils.isNotBlank(configQuery.getId())) {
            query.addCriteria(where("id").is(configQuery.getId()));
        }
        if (StringUtils.isNotBlank(configQuery.getConfigType())) {
            query.addCriteria(where("configType").is(configQuery.getConfigType()));
        }
        if (StringUtils.isNotBlank(configQuery.getConfigName())) {
            query.addCriteria(where("configName").is(configQuery.getConfigName()));
        }
        if (StringUtils.isNotBlank(configQuery.getAlias())) {
            query.addCriteria(where("alias").is(configQuery.getAlias()));
        }
        return query;
    }

    public ConfigDO getByConfigDO(String configNo, String configType) {
        ConfigQuery configQuery = new ConfigQuery();
        configQuery.setConfigNo(configNo);
        configQuery.setConfigType(configType);
        return mongoTemplate.findOne(buildQuery(configQuery), ConfigDO.class, CollectionName);
    }
}

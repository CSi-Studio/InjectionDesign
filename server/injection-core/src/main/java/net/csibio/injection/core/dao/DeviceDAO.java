package net.csibio.injection.core.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.client.domain.db.ConfigDO;
import net.csibio.injection.client.domain.db.DeviceDO;
import net.csibio.injection.client.domain.query.ConfigQuery;
import net.csibio.injection.client.domain.query.DeviceQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class DeviceDAO extends BaseDAO<DeviceDO, DeviceQuery> {

    public static String CollectionName = "device";
    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<DeviceDO> getDomainClass() {
        return DeviceDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(DeviceQuery deviceQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(deviceQuery.getId())) {
            query.addCriteria(where("id").is(deviceQuery.getId()));
        }
        if (StringUtils.isNotBlank(deviceQuery.getDeviceMode())) {
            query.addCriteria(where("deviceMode").is(deviceQuery.getDeviceMode()));
        }
        if (StringUtils.isNotBlank(deviceQuery.getName())) {
            query.addCriteria(where("name").is(deviceQuery.getName()));
        }
        return query;
    }

    public DeviceDO getByName(String name) {
        DeviceQuery deviceQuery = new DeviceQuery();
        deviceQuery.setName(name);
        return mongoTemplate.findOne(buildQuery(deviceQuery), DeviceDO.class, CollectionName);
    }
}

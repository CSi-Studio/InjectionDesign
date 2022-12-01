package net.csibio.injection.core.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.client.domain.db.MSOrderDO;
import net.csibio.injection.client.domain.db.PlatformDO;
import net.csibio.injection.client.domain.db.SampleDO;
import net.csibio.injection.client.domain.query.MSOrderQuery;
import net.csibio.injection.client.domain.query.PlatformQuery;
import net.csibio.injection.client.domain.query.SampleQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class PlatformDAO extends BaseDAO<PlatformDO, PlatformQuery>  {

    public static String CollectionName = "platform";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<PlatformDO> getDomainClass() {
        return PlatformDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(PlatformQuery platformQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(platformQuery.getId())) {
            query.addCriteria(where("id").is(platformQuery.getId()));
        }
        if (StringUtils.isNotBlank(platformQuery.getName())) {
            query.addCriteria(where("name").is(platformQuery.getName()));
        }
        if (StringUtils.isNotBlank(platformQuery.getDevice())) {
            query.addCriteria(where("device").is(platformQuery.getDevice()));
        }
        return query;
    }

    public List<PlatformDO> getByDevice(String deviceName) {
        PlatformQuery query = new PlatformQuery();
        query.setDevice(deviceName);
        return mongoTemplate.find(buildQuery(query), PlatformDO.class, CollectionName);
    }

    public PlatformDO getByName(String name, String device) {
        PlatformQuery query = new PlatformQuery();
        query.setName(name);
        query.setDevice(device);
        return mongoTemplate.findOne(buildQuery(query), PlatformDO.class, CollectionName);
    }
}

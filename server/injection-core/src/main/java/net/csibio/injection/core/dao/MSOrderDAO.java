package net.csibio.injection.core.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.client.domain.db.BoardDO;
import net.csibio.injection.client.domain.db.MSOrderDO;
import net.csibio.injection.client.domain.query.BoardQuery;
import net.csibio.injection.client.domain.query.MSOrderQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class MSOrderDAO extends BaseDAO<MSOrderDO, MSOrderQuery>  {

    public static String CollectionName = "ms_order";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<MSOrderDO> getDomainClass() {
        return MSOrderDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(MSOrderQuery msOrderQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(msOrderQuery.getId())) {
            query.addCriteria(where("id").is(msOrderQuery.getId()));
        }
        if (StringUtils.isNotBlank(msOrderQuery.getName())) {
            query.addCriteria(where("name").is(msOrderQuery.getName()));
        }
        if (StringUtils.isNotBlank(msOrderQuery.getProjectId())) {
            query.addCriteria(where("projectId").is(msOrderQuery.getProjectId()));
        }
        if (msOrderQuery.getStatus() != null) {
            query.addCriteria(where("status").is(msOrderQuery.getStatus()));
        }
        if (msOrderQuery.getRunSampleStatus() != null) {
            query.addCriteria(where("runSampleStatus").is(msOrderQuery.getRunSampleStatus()));
        }
        return query;
    }

    public MSOrderDO getByName(String msOrderName) {
        MSOrderQuery query = new MSOrderQuery();
        query.setName(msOrderName);
        return mongoTemplate.findOne(buildQuery(query), MSOrderDO.class, CollectionName);
    }
}

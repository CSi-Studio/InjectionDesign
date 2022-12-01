package net.csibio.injection.core.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.client.domain.db.PreOrderDO;
import net.csibio.injection.client.domain.query.PreOrderQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class PreOrderDAO extends BaseDAO<PreOrderDO, PreOrderQuery> {

    public static String CollectionName = "pre_order";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<PreOrderDO> getDomainClass() {
        return PreOrderDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(PreOrderQuery preOrderQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(preOrderQuery.getId())) {
            query.addCriteria(where("id").is(preOrderQuery.getId()));
        }
        if (StringUtils.isNotBlank(preOrderQuery.getName())) {
            query.addCriteria(where("name").is(preOrderQuery.getName()));
        }
        if (StringUtils.isNotBlank(preOrderQuery.getProjectId())) {
            query.addCriteria(where("projectId").is(preOrderQuery.getProjectId()));
        }
        if (preOrderQuery.getType() != null) {
            query.addCriteria(where("type").is(preOrderQuery.getType()));
        }
        if (preOrderQuery.getStatus() != null) {
            query.addCriteria(where("status").is(preOrderQuery.getStatus()));
        }
        return query;
    }
}

package net.csibio.injection.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.domain.db.BatchDO;
import net.csibio.injection.domain.query.BatchQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class BatchDAO extends BaseDAO<BatchDO, BatchQuery>{

    public static String CollectionName = "batch";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<BatchDO> getDomainClass() {
        return BatchDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(BatchQuery batchQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(batchQuery.getId())) {
            query.addCriteria(where("id").is(batchQuery.getId()));
        }
        if (StringUtils.isNotBlank(batchQuery.getBatchNo())) {
            query.addCriteria(where("batchNo").is(batchQuery.getBatchNo()));
        }
        if (StringUtils.isNotBlank(batchQuery.getBoardId())) {
            query.addCriteria(where("boardId").is(batchQuery.getBoardId()));
        }
        if (batchQuery.getStatus() != null) {
            query.addCriteria(where("status").is(batchQuery.getStatus()));
        }
        if (batchQuery.getMsOrderId() != null) {
            query.addCriteria(where("msOrderId").is(batchQuery.getMsOrderId()));
        }
        return query;
    }
}

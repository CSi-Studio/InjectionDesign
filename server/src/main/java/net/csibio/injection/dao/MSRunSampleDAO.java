package net.csibio.injection.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.domain.db.MSRunDO;
import net.csibio.injection.domain.query.MSRunQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class MSRunSampleDAO extends BaseDAO<MSRunDO, MSRunQuery> {

    public static String CollectionName = "ms_run";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<MSRunDO> getDomainClass() {
        return MSRunDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(MSRunQuery msRunQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(msRunQuery.getId())) {
            query.addCriteria(where("id").is(msRunQuery.getId()));
        }
        if (StringUtils.isNotBlank(msRunQuery.getSampleId())) {
            query.addCriteria(where("sampleId").is(msRunQuery.getSampleId()));
        }
        if (StringUtils.isNotBlank(msRunQuery.getMsOrderId())) {
            query.addCriteria(where("msOrderId").is(msRunQuery.getMsOrderId()));
        }
        if (StringUtils.isNotBlank(msRunQuery.getSampleType())) {
            query.addCriteria(where("sampleType").is(msRunQuery.getSampleType()));
        }
        if (StringUtils.isNotBlank(msRunQuery.getDevice())) {
            query.addCriteria(where("device").is(msRunQuery.getDevice()));
        }
        if (StringUtils.isNotBlank(msRunQuery.getRunSampleType())) {
            query.addCriteria(where("runSampleType").is(msRunQuery.getRunSampleType()));
        }
        if (msRunQuery.getStatus() != null) {
            query.addCriteria(where("status").is(msRunQuery.getStatus()));
        }
        if (StringUtils.isNotBlank(msRunQuery.getBoardIndex())) {
            query.addCriteria(where("boardIndex").is(msRunQuery.getBoardIndex()));
        }
        return query;
    }
}

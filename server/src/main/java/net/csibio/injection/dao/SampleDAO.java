package net.csibio.injection.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.query.SampleQuery;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class SampleDAO extends BaseDAO<SampleDO, SampleQuery> {

    public static String CollectionName = "sample";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<SampleDO> getDomainClass() {
        return SampleDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(SampleQuery sampleQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(sampleQuery.getId())) {
            query.addCriteria(where("id").is(sampleQuery.getId()));
        }
        if (StringUtils.isNotBlank(sampleQuery.getSampleNo())) {
            query.addCriteria(where("sampleNo").regex(sampleQuery.getSampleNo()));
        }
        if (StringUtils.isNotBlank(sampleQuery.getDim1())) {
            query.addCriteria(where("dim1").is(sampleQuery.getDim1()));
        }
        if (StringUtils.isNotBlank(sampleQuery.getDim2())) {
            query.addCriteria(where("dim2").is(sampleQuery.getDim2()));
        }
        if (StringUtils.isNotBlank(sampleQuery.getDim3())) {
            query.addCriteria(where("dim3").is(sampleQuery.getDim3()));
        }
        if (StringUtils.isNotBlank(sampleQuery.getProjectId())) {
            query.addCriteria(where("projectId").is(sampleQuery.getProjectId()));
        }
        if (CollectionUtils.isNotEmpty(sampleQuery.getSampleIds())) {
            query.addCriteria(where("id").in(sampleQuery.getSampleIds()));
        }
        return query;
    }

    public SampleDO getBySampleNo(String sampleNo, String projectId) {
        SampleQuery query = new SampleQuery();
        query.setSampleNo(sampleNo);
        query.setProjectId(projectId);
        return mongoTemplate.findOne(buildQuery(query), SampleDO.class, CollectionName);
    }


}

package net.csibio.injection.core.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.client.constants.enums.SamplePositionStatus;
import net.csibio.injection.client.domain.db.SamplePositionDO;
import net.csibio.injection.client.domain.query.SamplePositionQuery;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.Objects;

import static org.springframework.data.mongodb.core.query.Criteria.where;


@Service
public class SamplePositionDAO extends BaseDAO<SamplePositionDO, SamplePositionQuery> {

    public static String CollectionName = "sample_position";

    public SamplePositionDO getBySampleId(String sampleId, String orderId) {
        SamplePositionQuery query = new SamplePositionQuery();
        query.setSampleId(sampleId);
        query.setPreOrderId(orderId);
        query.setStatus(SamplePositionStatus.VALID.getCode());
        return mongoTemplate.findOne(buildQuery(query), SamplePositionDO.class, CollectionName);
    }

    public SamplePositionDO getBySampleIdAndProjectId(String sampleId, String projectId) {
        SamplePositionQuery query = new SamplePositionQuery();
        query.setSampleId(sampleId);
        query.setProjectId(projectId);
        query.setStatus(SamplePositionStatus.VALID.getCode());
        return mongoTemplate.findOne(buildQuery(query), SamplePositionDO.class, CollectionName);
    }


    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<SamplePositionDO> getDomainClass() {
        return SamplePositionDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(SamplePositionQuery samplePositionQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(samplePositionQuery.getSampleId())) {
            query.addCriteria(where("sampleId").is(samplePositionQuery.getSampleId()));
        }
        if (StringUtils.isNotBlank(samplePositionQuery.getPreOrderId())) {
            query.addCriteria(where("preOrderId").is(samplePositionQuery.getPreOrderId()));
        }
        if (StringUtils.isNotBlank(samplePositionQuery.getBoardId())) {
            query.addCriteria(where("boardId").is(samplePositionQuery.getBoardId()));
        }

        if (StringUtils.isNotBlank(samplePositionQuery.getBoardIndex())) {
            query.addCriteria(where("boardIndex").is(samplePositionQuery.getBoardIndex()));
        }
        if (Objects.equals(samplePositionQuery.getIsWhiteList(), false)) {
            query.addCriteria(where("samplePosition").ne(null));
        }

        if (StringUtils.isNotBlank(samplePositionQuery.getProjectId())) {
            query.addCriteria(where("projectId").is(samplePositionQuery.getProjectId()));
        }
        if (samplePositionQuery.getStatus() != null) {
            query.addCriteria(where("status").is(samplePositionQuery.getStatus()));
        }
        if (CollectionUtils.isNotEmpty(samplePositionQuery.getBatchSampleList())) {
            query.addCriteria(where("sampleId").in(samplePositionQuery.getBatchSampleList()));
        }
        return query;
    }
}

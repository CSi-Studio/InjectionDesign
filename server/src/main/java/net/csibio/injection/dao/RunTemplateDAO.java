package net.csibio.injection.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.domain.db.RunTemplateDO;
import net.csibio.injection.domain.query.RunTemplateQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class RunTemplateDAO extends BaseDAO<RunTemplateDO, RunTemplateQuery> {

    public static String CollectionName = "run_template";


    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<RunTemplateDO> getDomainClass() {
        return RunTemplateDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(RunTemplateQuery runTemplateQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(runTemplateQuery.getId())) {
            query.addCriteria(where("id").is(runTemplateQuery.getId()));
        }
        if (StringUtils.isNotBlank(runTemplateQuery.getName())) {
            query.addCriteria(where("name").is(runTemplateQuery.getName()));
        }
        return query;
    }
}

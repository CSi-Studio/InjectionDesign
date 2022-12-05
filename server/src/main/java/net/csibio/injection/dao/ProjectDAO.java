package net.csibio.injection.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.query.ProjectQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

/**
 * Created by James Lu MiaoShan
 * Time: 2019-01-10 13:16
 */
@Service
public class ProjectDAO extends BaseDAO<ProjectDO, ProjectQuery>{

    public static String CollectionName = "project";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class getDomainClass() {
        return ProjectDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(ProjectQuery projectQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(projectQuery.getId())) {
            query.addCriteria(where("id").is(projectQuery.getId()));
        }
        if (StringUtils.isNotBlank(projectQuery.getAlias())) {
            //projectName采用模糊查询的方法, 用于project界面的搜索框
            query.addCriteria(where("alias").regex(projectQuery.getAlias(), "i"));
        }
        if (StringUtils.isNotBlank(projectQuery.getOwner())) {
            //projectName采用模糊查询的方法, 用于project界面的搜索框
            query.addCriteria(where("owner").regex(projectQuery.getOwner(), "i"));
        }
        if (StringUtils.isNotBlank(projectQuery.getName())) {
            query.addCriteria(where("name").is(projectQuery.getName()));
        }
        if (StringUtils.isNotBlank(projectQuery.getUserId())) {
            query.addCriteria(where("userId").is(projectQuery.getUserId()));
        }
        return query;
    }

    public ProjectDO getByAlias(String alias) {
        ProjectQuery query = new ProjectQuery();
        query.setAlias(alias);
        return mongoTemplate.findOne(buildQuery(query), ProjectDO.class, CollectionName);
    }

    public ProjectDO getByName(String name) {
        ProjectQuery query = new ProjectQuery();
        query.setName(name);
        return mongoTemplate.findOne(buildQuery(query), ProjectDO.class, CollectionName);
    }
}

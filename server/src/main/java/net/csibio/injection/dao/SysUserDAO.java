package net.csibio.injection.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.domain.db.SysUserDO;
import net.csibio.injection.domain.query.SysUserQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;


@Service
public class SysUserDAO extends BaseDAO<SysUserDO, SysUserQuery> {

    public static String CollectionName = "sysUser";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<SysUserDO> getDomainClass() {
        return SysUserDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(SysUserQuery sysUserQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(sysUserQuery.getId())) {
            query.addCriteria(where("id").is(sysUserQuery.getId()));
        }
        if (StringUtils.isNotBlank(sysUserQuery.getUserName())) {
            query.addCriteria(where("userName").is(sysUserQuery.getUserName()));
        }
        if (StringUtils.isNotBlank(sysUserQuery.getPasswd())) {
            query.addCriteria(where("passwd").is(sysUserQuery.getPasswd()));
        }
        return query;
    }
}

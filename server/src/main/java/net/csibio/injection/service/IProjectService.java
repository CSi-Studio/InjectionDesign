package net.csibio.injection.service;

import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.query.ProjectQuery;


public interface IProjectService extends BaseService<ProjectDO, ProjectQuery> {

    ProjectDO getByAlias(String alias);

    ProjectDO getByName(String name);
}

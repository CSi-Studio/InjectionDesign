package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.ProjectDO;
import net.csibio.injection.client.domain.query.ProjectQuery;


public interface IProjectService extends BaseService<ProjectDO, ProjectQuery>{

    ProjectDO getByAlias(String alias);

    ProjectDO getByName(String name);
}

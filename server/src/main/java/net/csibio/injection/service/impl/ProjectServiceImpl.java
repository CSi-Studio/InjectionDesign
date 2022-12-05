package net.csibio.injection.service.impl;

import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.query.ProjectQuery;
import net.csibio.injection.dao.ProjectDAO;
import net.csibio.injection.exceptions.XException;
import net.csibio.injection.service.IDAO;
import net.csibio.injection.service.IProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service("projectService")
public class ProjectServiceImpl implements IProjectService {

    public final Logger logger = LoggerFactory.getLogger(ProjectServiceImpl.class);

    @Autowired
    ProjectDAO projectDAO;

    @Override
    public ProjectDO getByAlias(String alias) {
        try {
            return projectDAO.getByAlias(alias);
        } catch (Exception e) {
            logger.warn(e.getMessage());
            return null;
        }
    }

    @Override
    public ProjectDO getByName(String name) {
        try {
            return projectDAO.getByName(name);
        } catch (Exception e) {
            logger.warn(e.getMessage());
            return null;
        }
    }

    @Override
    public IDAO<ProjectDO, ProjectQuery> getBaseDAO() {
        return projectDAO;
    }

    @Override
    public void beforeInsert(ProjectDO project) throws XException {
        project.setId(project.getName());
        project.setCreateDate(new Date());
        project.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(ProjectDO project) throws XException {
        project.setLastModifiedDate(new Date());
    }
}

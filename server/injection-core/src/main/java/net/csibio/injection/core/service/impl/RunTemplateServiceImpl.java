package net.csibio.injection.core.service.impl;

import net.csibio.injection.client.domain.db.ProjectDO;
import net.csibio.injection.client.domain.db.RunTemplateDO;
import net.csibio.injection.client.domain.query.RunTemplateQuery;
import net.csibio.injection.client.exceptions.XException;
import net.csibio.injection.client.service.IDAO;
import net.csibio.injection.client.service.IRunTemplateService;
import net.csibio.injection.core.dao.RunTemplateDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service("runTemplateService")
public class RunTemplateServiceImpl implements IRunTemplateService {

    public final Logger logger = LoggerFactory.getLogger(RunTemplateServiceImpl.class);

    @Autowired
    RunTemplateDAO runTemplateDAO;


    @Override
    public void beforeInsert(RunTemplateDO runTemplate) throws XException {
        runTemplate.setId(runTemplate.getName());
        runTemplate.setCreateDate(new Date());
        runTemplate.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(RunTemplateDO runTemplate) throws XException {
        runTemplate.setLastModifiedDate(new Date());
    }

    @Override
    public IDAO<RunTemplateDO, RunTemplateQuery> getBaseDAO() {
        return runTemplateDAO;
    }
}

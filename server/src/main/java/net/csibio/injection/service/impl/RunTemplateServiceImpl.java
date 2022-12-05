package net.csibio.injection.service.impl;

import net.csibio.injection.domain.db.RunTemplateDO;
import net.csibio.injection.domain.query.RunTemplateQuery;
import net.csibio.injection.dao.RunTemplateDAO;
import net.csibio.injection.exceptions.XException;
import net.csibio.injection.service.IDAO;
import net.csibio.injection.service.IRunTemplateService;
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

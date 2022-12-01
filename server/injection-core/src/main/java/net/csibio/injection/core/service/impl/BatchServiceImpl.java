package net.csibio.injection.core.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.domain.db.BatchDO;
import net.csibio.injection.client.domain.query.BatchQuery;
import net.csibio.injection.client.exceptions.XException;
import net.csibio.injection.client.service.IBatchService;
import net.csibio.injection.client.service.IDAO;
import net.csibio.injection.core.dao.BatchDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service("batchService")
@Slf4j
public class BatchServiceImpl implements IBatchService {

    @Autowired
    BatchDAO batchDAO;

    @Override
    public IDAO<BatchDO, BatchQuery> getBaseDAO() {
        return batchDAO;
    }

    @Override
    public void beforeInsert(BatchDO batch) throws XException {
        batch.setCreateDate(new Date());
        batch.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(BatchDO batch) throws XException {
        batch.setLastModifiedDate(new Date());
    }

}

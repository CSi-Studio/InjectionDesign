package net.csibio.injection.service;

import net.csibio.injection.domain.db.MSOrderDO;
import net.csibio.injection.domain.db.MSRunDO;
import net.csibio.injection.domain.query.MSRunQuery;
import net.csibio.injection.exceptions.XException;

import java.util.List;

public interface IMSRunSampleService extends BaseService<MSRunDO, MSRunQuery> {
    List<MSRunDO> getRunOrder(MSOrderDO msOrderDO) throws XException;
}

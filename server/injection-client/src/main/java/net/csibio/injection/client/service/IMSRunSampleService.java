package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.MSOrderDO;
import net.csibio.injection.client.domain.db.MSRunDO;
import net.csibio.injection.client.domain.query.MSRunQuery;
import net.csibio.injection.client.domain.vo.order.MSOrderAddVO;
import net.csibio.injection.client.exceptions.XException;

import java.util.List;

public interface IMSRunSampleService extends BaseService<MSRunDO, MSRunQuery> {
    List<MSRunDO> getRunOrder(MSOrderDO msOrderDO) throws XException;
}

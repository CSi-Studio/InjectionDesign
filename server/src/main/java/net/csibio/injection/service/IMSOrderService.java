package net.csibio.injection.service;

import net.csibio.injection.domain.db.MSOrderDO;
import net.csibio.injection.domain.query.MSOrderQuery;

public interface IMSOrderService extends BaseService<MSOrderDO, MSOrderQuery> {
    MSOrderDO getByName(String msOrderName);
}

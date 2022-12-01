package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.MSOrderDO;
import net.csibio.injection.client.domain.query.MSOrderQuery;

public interface IMSOrderService extends BaseService<MSOrderDO, MSOrderQuery> {
    MSOrderDO getByName(String msOrderName);
}

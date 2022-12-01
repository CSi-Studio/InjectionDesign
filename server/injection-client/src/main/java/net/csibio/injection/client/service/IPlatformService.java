package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.PlatformDO;
import net.csibio.injection.client.domain.query.PlatformQuery;

import java.util.List;

public interface IPlatformService extends BaseService<PlatformDO, PlatformQuery> {

    List<PlatformDO> getByDevice(String name);

    PlatformDO getByName(String name, String device);
}

package net.csibio.injection.core.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.domain.db.SysUserDO;
import net.csibio.injection.client.domain.query.SysUserQuery;
import net.csibio.injection.client.service.IDAO;
import net.csibio.injection.client.service.ISysUserService;
import net.csibio.injection.core.dao.SysUserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service("sysUserService")
@Slf4j
public class SysUserServiceImpl implements ISysUserService {

    @Autowired
    SysUserDAO sysUserDAO;

    @Override
    public IDAO<SysUserDO, SysUserQuery> getBaseDAO() {
        return sysUserDAO;
    }
}

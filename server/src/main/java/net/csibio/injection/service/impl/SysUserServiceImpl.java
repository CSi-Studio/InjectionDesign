package net.csibio.injection.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.db.SysUserDO;
import net.csibio.injection.domain.query.SysUserQuery;
import net.csibio.injection.dao.SysUserDAO;
import net.csibio.injection.service.IDAO;
import net.csibio.injection.service.ISysUserService;
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

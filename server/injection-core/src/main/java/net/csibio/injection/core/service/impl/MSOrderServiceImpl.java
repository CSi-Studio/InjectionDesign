package net.csibio.injection.core.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.domain.db.MSOrderDO;
import net.csibio.injection.client.domain.query.MSOrderQuery;
import net.csibio.injection.client.exceptions.XException;
import net.csibio.injection.client.service.IDAO;
import net.csibio.injection.client.service.IMSOrderService;
import net.csibio.injection.core.dao.MSOrderDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service("msOrderService")
@Slf4j
public class MSOrderServiceImpl implements IMSOrderService {

    @Autowired
    MSOrderDAO msOrderDAO;

    @Override
    public IDAO<MSOrderDO, MSOrderQuery> getBaseDAO() {
        return msOrderDAO;
    }

    @Override
    public void beforeInsert(MSOrderDO order) throws XException {
        order.setCreateDate(new Date());
        order.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(MSOrderDO order) throws XException {
        order.setLastModifiedDate(new Date());
    }

    @Override
    public MSOrderDO getByName(String msOrderName) {
        try {
            return msOrderDAO.getByName(msOrderName);
        } catch (Exception e) {
            log.warn(e.getMessage());
            return null;
        }
    }
}

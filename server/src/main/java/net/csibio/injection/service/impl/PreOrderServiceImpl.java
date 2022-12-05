package net.csibio.injection.service.impl;

import com.alibaba.excel.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.db.PreOrderDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.query.PreOrderQuery;
import net.csibio.injection.domain.vo.sample.SampleExcelVO;
import net.csibio.injection.dao.PreOrderDAO;
import net.csibio.injection.dao.SampleDAO;
import net.csibio.injection.exceptions.XException;
import net.csibio.injection.service.IDAO;
import net.csibio.injection.service.IPreOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service("preOrderService")
@Slf4j
public class PreOrderServiceImpl implements IPreOrderService {

    public final Logger logger = LoggerFactory.getLogger(PreOrderServiceImpl.class);

    @Autowired
    PreOrderDAO preOrderDAO;

    @Autowired
    SampleDAO sampleDAO;

    @Override
    public IDAO<PreOrderDO, PreOrderQuery> getBaseDAO() {
        return preOrderDAO;
    }

    @Override
    public void beforeInsert(PreOrderDO order) throws XException {
        order.setCreateDate(new Date());
        order.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(PreOrderDO order) throws XException {
        order.setLastModifiedDate(new Date());
    }

    @Override
    public List<PreOrderDO> getByProjectId(String projectId) {
        return null;
    }

    @Override
    public void saveBatchWithExcelVO(SampleExcelVO sampleExcelVO, String projectId, List<String> sampleIdList) {
        if (StringUtils.isBlank(sampleExcelVO.getSampleId())) {
            log.error("sampleExcelVO is empty");
            return;
        }
        SampleDO sampleDO;
        try {
            sampleDO = sampleDAO.getBySampleNo(sampleExcelVO.getSampleId(), projectId);
            if (sampleDO == null) {
                log.error("sampleExcelVO sampleDO is empty");
                return;
            }
            sampleIdList.add(sampleDO.getId());
        } catch (Exception e) {
            logger.error("sampleExcelVO sampleDO is empty, errorMsg:", e);
        }
    }
}

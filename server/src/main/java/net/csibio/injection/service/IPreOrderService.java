package net.csibio.injection.service;

import net.csibio.injection.domain.db.PreOrderDO;
import net.csibio.injection.domain.query.PreOrderQuery;
import net.csibio.injection.domain.vo.sample.SampleExcelVO;

import java.util.List;

public interface IPreOrderService extends BaseService<PreOrderDO, PreOrderQuery> {

    List<PreOrderDO> getByProjectId(String projectId);

    void saveBatchWithExcelVO(SampleExcelVO vo, String projectId, List<String> sampleIdList);
}

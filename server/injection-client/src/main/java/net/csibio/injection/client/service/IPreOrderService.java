package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.PreOrderDO;
import net.csibio.injection.client.domain.query.PreOrderQuery;
import net.csibio.injection.client.domain.vo.sample.SampleExcelVO;
import net.csibio.injection.client.domain.vo.sample.WhiteSampleExcelVO;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface IPreOrderService extends BaseService<PreOrderDO, PreOrderQuery>{

    List<PreOrderDO> getByProjectId(String projectId);

    void saveBatchWithExcelVO(SampleExcelVO vo, String projectId, List<String> sampleIdList);

    void saveWhiteListBatchWithExcelVO(WhiteSampleExcelVO vo, String project, Map<String, List<String>> prioritySampleList);
}

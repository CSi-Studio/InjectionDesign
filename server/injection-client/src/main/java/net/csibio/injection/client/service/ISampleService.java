package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.ProjectDO;
import net.csibio.injection.client.domain.db.SampleDO;
import net.csibio.injection.client.domain.query.SampleQuery;
import net.csibio.injection.client.domain.vo.sample.SampleExcelErrorVO;
import net.csibio.injection.client.domain.vo.sample.SampleExcelVO;
import net.csibio.injection.client.domain.vo.sample.WhiteSampleExcelVO;

import java.util.List;

public interface ISampleService extends BaseService<SampleDO, SampleQuery> {

    /**
     * 根据样本编号查询
     * @param sampleNo
     * @param projectId
     * @return
     */
    SampleDO getBySampleNo(String sampleNo, String projectId);

    /**
     * 校验样本格式
     * @param sampleExcelVO
     * @param errorMsg
     */
    void checkBatchWithExcelVO(SampleExcelVO sampleExcelVO, List<SampleExcelErrorVO> errorMsg);

    /**
     * 存储excel
     * @param projectDO
     * @param sampleExcelVO
     * @param errorMsg
     */
    void saveBatchWithExcelVO(ProjectDO projectDO, SampleExcelVO sampleExcelVO, List<String> errorMsg);

    /**
     * 清空样本
     * @param projectId
     * @throws Exception
     */
    void clearByProjectDO(ProjectDO projectId) throws Exception;
}

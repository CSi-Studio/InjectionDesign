package net.csibio.injection.service;

import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.query.SampleQuery;
import net.csibio.injection.domain.vo.sample.SampleExcelErrorVO;
import net.csibio.injection.domain.vo.sample.SampleExcelVO;
import net.csibio.injection.domain.vo.sample.SampleTsvVO;

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
     * 校验样本格式
     * @param sampleTsvVO
     * @param errorMsg
     */
    void checkBatchWithTsvVO(SampleTsvVO sampleTsvVO, List<SampleExcelErrorVO> errorMsg);

    /**
     * 存储excel
     * @param projectDO
     * @param sampleExcelVO
     * @param errorMsg
     */
    void saveBatchWithExcelVO(ProjectDO projectDO, SampleExcelVO sampleExcelVO, List<String> errorMsg);
    /**
     * 存储excel
     * @param projectDO
     * @param sampleTsvVO
     * @param errorMsg
     */
    void saveBatchWithTsvVO(ProjectDO projectDO, SampleTsvVO sampleTsvVO, List<String> errorMsg);
    /**
     * 清空样本
     * @param projectId
     * @throws Exception
     */
    void clearByProjectDO(ProjectDO projectId) throws Exception;
}

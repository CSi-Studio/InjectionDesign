package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.PreOrderDO;
import net.csibio.injection.client.domain.db.SampleDO;
import net.csibio.injection.client.domain.db.SamplePositionDO;
import net.csibio.injection.client.domain.query.SamplePositionQuery;
import net.csibio.injection.client.domain.vo.SampleLocation.SampleBoardLocationVO;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 样本位置服务
 */
public interface ISamplePositionService extends BaseService<SamplePositionDO, SamplePositionQuery>{

    /**
     * 获取前处理工单里某样本在样本板的位置信息
     * @param sampleId
     * @param orderId
     * @return
     */
    SamplePositionDO getBySampleIdAndOrderId(String sampleId, String orderId);

    /**
     * 获取前处理工单里某样本在样本板的位置信息 (白名单工单)
     * @param sampleId
     * @param projectId
     * @return
     */
    SamplePositionDO getBySampleIdAndProjectId(String sampleId, String projectId);

    /**
     * 获取人工样本录入位置
     * 支持指定boardIndx
     * @param preOrderDO
     * @param sampleDO
     * @return
     */
    SampleBoardLocationVO getManualSampleLoc(PreOrderDO preOrderDO, SampleDO sampleDO, Integer boardIndex);

    /**
     * 获取某一类型样本板的位置映射
     * @param boardType
     * @return
     */
    List<String> getSamplePositionMapping(String boardType);

    /**
     * 批量获取多类型的位置映射
     */
    Map<String, String> getMultiSamplePositionMapping(List<String> boardType, Integer sampleIndex);

    /**
     * 根据位置index获取样本板位置映射
     * @param sampleIndex
     * @return
     */
    Map<String, String> getAllBoardTypeMapping(Integer sampleIndex);

    /**
     * 获取样本随机位置映射
     * @param sampleIds
     * @param boardSize
     * @return
     */
     List<SampleBoardLocationVO> getSampleBoardLoc(List<String> sampleIds, Integer boardSize);


    /**
     * 获取样本随机位置映射
     * @param sampleIds
     * @param boardSize
     * @return
     */
    List<SampleBoardLocationVO> getSampleBoardLoc(List<String> sampleIds, Integer boardSize, PreOrderDO preOrderDO);


    /**
     * 获取板子随机位置映射
     */
    List<SampleBoardLocationVO> getWhiteListSampleBoardLoc(List<String> sampleIds, Integer boardSize, int initValue, int randomMethod);


}

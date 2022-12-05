package net.csibio.injection.service.impl;

import com.alibaba.excel.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.converter.sample.SampleConverter;
import net.csibio.injection.constants.enums.ResultCode;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.query.SampleQuery;
import net.csibio.injection.domain.vo.sample.SampleExcelErrorVO;
import net.csibio.injection.domain.vo.sample.SampleExcelVO;
import net.csibio.injection.dao.SampleDAO;
import net.csibio.injection.exceptions.XException;
import net.csibio.injection.service.IDAO;
import net.csibio.injection.service.IProjectService;
import net.csibio.injection.service.ISampleService;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

import static net.csibio.injection.constants.Constants.SAMPLE_EXCEL_ERROR_PREFIX;

@Service("sampleService")
@Slf4j
public class SampleServiceImpl implements ISampleService {

    @Autowired
    SampleDAO sampleDAO;

    @Resource
    SampleConverter sampleConverter;

    @Resource
    IProjectService projectService;

    @Override
    public IDAO<SampleDO, SampleQuery> getBaseDAO() {
        return sampleDAO;
    }

    @Override
    public void beforeInsert(SampleDO sample) throws XException {
        sample.setCreateDate(new Date());
        sample.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(SampleDO sample) throws XException {
        sample.setLastModifiedDate(new Date());
    }

    @Override
    public SampleDO getBySampleNo(String sampleNo, String projectId) {
        try {
            return sampleDAO.getBySampleNo(sampleNo, projectId);
        } catch (Exception e) {
            log.warn(e.getMessage());
            return null;
        }
    }

    @Override
    public void checkBatchWithExcelVO(SampleExcelVO sampleExcelVO, List<SampleExcelErrorVO> errorMsgList) {
        SampleExcelErrorVO sampleExcelErrorVO = new SampleExcelErrorVO();
        if (ObjectUtils.isEmpty(sampleExcelVO)) {
            String errorMsg = ResultCode.SAMPLE_LIST_IS_EMPTY.getMessage();
            sampleExcelErrorVO.setErrorMsg(errorMsg);
            errorMsgList.add(sampleExcelErrorVO);
            return;
        }
        BeanUtils.copyProperties(sampleExcelVO, sampleExcelErrorVO);
        if (StringUtils.isBlank(sampleExcelVO.getSampleId())) {
            String errorMsg = ResultCode.SAMPLE_NO_CANNOT_BE_EMPTY.getMessage();
            sampleExcelErrorVO.setErrorMsg(errorMsg);
            errorMsgList.add(sampleExcelErrorVO);
        }
    }

    /**
     * 从excel中批量读取
     *
     * @param projectDO
     * @param sampleExcelVO
     * @return
     */
    @Override
    public void saveBatchWithExcelVO(ProjectDO projectDO, SampleExcelVO sampleExcelVO, List<String> errorMsg) {
        String errorKey = String.format("%s:", SAMPLE_EXCEL_ERROR_PREFIX);
        if (StringUtils.isBlank(sampleExcelVO.getSampleId())) {
            errorMsg.add(errorKey + ResultCode.SAMPLE_NO_CANNOT_BE_EMPTY.getMessage());
            return;
        }
        // 判断样本是否存在
        SampleDO sampleDO = sampleDAO.getBySampleNo(sampleExcelVO.getSampleId(), projectDO.getId());
        if (sampleDO != null) {
            log.info(String.format("sampleId:%s has been exist in projectId:%s", sampleExcelVO.getSampleId(), projectDO.getId()));
            return;
        }
        // 样本导入
        try {
            sampleDAO.insert(sampleConverter.convertToSampleDO(projectDO, sampleExcelVO));
        } catch (Exception e) {
            log.error("insert sample db error, errorMsg:", e);
            return;
        }
    }


    @Override
    public void clearByProjectDO(ProjectDO projectDO) throws Exception {
        try {
            SampleQuery sampleQuery = new SampleQuery();
            sampleQuery.setProjectId(projectDO.getId());
            sampleDAO.remove(sampleQuery);
            projectDO.setLastModifiedDate(new Date());
            projectService.update(projectDO);
        } catch (Exception e) {
            log.error(String.format("method:%s|result:%s|error:%s", "clearByProjectId", "clear sample error", e));
            throw new Exception(e);
        }
    }
}

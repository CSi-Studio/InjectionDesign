package net.csibio.injection.controller;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.constants.Constants;
import net.csibio.injection.constants.enums.ResultCode;
import net.csibio.injection.constants.enums.UploadType;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.ProjectDO;
import net.csibio.injection.domain.db.SampleDO;
import net.csibio.injection.domain.vo.sample.SampleExcelErrorVO;
import net.csibio.injection.excel.SampleExcelManager;
import net.csibio.injection.domain.query.SampleQuery;
import net.csibio.injection.domain.vo.sample.SampleAddVO;
import net.csibio.injection.domain.vo.sample.SampleUpdateVO;
import net.csibio.injection.exceptions.ParamsCheckException;
import net.csibio.injection.service.BaseService;
import net.csibio.injection.service.IProjectService;
import net.csibio.injection.service.ISampleService;
import net.csibio.injection.utils.CommonUtil;
import org.apache.commons.compress.utils.Lists;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import static net.csibio.injection.constants.enums.ResultCode.PROJECT_NOT_EXISTED;
import static net.csibio.injection.constants.enums.ResultCode.UPLOAD_FILES_IS_NULL;

@RestController
@Slf4j
@RequestMapping("sample")
public class SampleController extends BaseController<SampleDO, SampleQuery> {

    @Autowired
    private ISampleService sampleService;

    @Resource
    private SampleExcelManager sampleExcelManager;

    @Autowired
    private IProjectService projectService;

    @Override
    BaseService<SampleDO, SampleQuery> getBaseService() {
        return sampleService;
    }


    /**
     * ????????????
     *
     * @param sampleAdd
     * @return
     */
    @PostMapping(value = "/add")
    Result add(SampleAddVO sampleAdd) {
        CommonUtil.checkIsNotNull(sampleAdd.getSampleNo(), ResultCode.SAMPLE_NO_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(sampleAdd.getProjectId(), ResultCode.PROJECT_ID_CANNOT_BE_EMPTY);
        // ??????projectId????????????
        ProjectDO project = projectService.getById(sampleAdd.getProjectId());
        if (project == null) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "sampleValidate", "checkSampleAdd", PROJECT_NOT_EXISTED.getMessage());
            log.error(errMsg);
            throw new ParamsCheckException(PROJECT_NOT_EXISTED.getCode(), PROJECT_NOT_EXISTED.getMessage());
        }

        // ??????????????????????????????
        SampleDO exist = sampleService.getBySampleNo(sampleAdd.getSampleNo(), sampleAdd.getProjectId());
        if (exist != null) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "sampleValidate", "checkSampleAdd", ResultCode.SAME_SAMPLE_EXISTED.getMessage());
            log.error(errMsg);
            throw new ParamsCheckException(ResultCode.SAME_PROJECT_EXISTED.getCode(), ResultCode.SAME_SAMPLE_EXISTED.getMessage());
        }

        Result result = sampleService.insert(buildSampleDo(sampleAdd));
        if (result.isFailed()) {
            return result;
        }
        return Result.OK();
    }

    /**
     * ?????????????????????
     */
    @PostMapping(value = "/save")
    Result save(@RequestParam(value = "projectId", required = true) String projectId) {
        ProjectDO project = projectService.getById(projectId);
        CommonUtil.checkIsNotNull(project, PROJECT_NOT_EXISTED);
        return projectService.update(project);
    }

    /**
     * ??????????????????
     *
     * @param query
     * @return
     */
    @RequestMapping(value = "/list")
    Result list(SampleQuery query) throws Exception {
        query.setOrderBy(Sort.Direction.ASC);
        Result<List<SampleDO>> res;
        try {
            res = sampleService.getList(query);
        } catch (Exception e) {
            log.error("????????????????????????,msg???", e);
            throw new Exception("????????????, ?????????");
        }
        return res;
    }

    /**
     * ??????????????????
     *
     * @param query
     * @return
     */
    @RequestMapping(value = "/all")
    Result all(SampleQuery query) throws Exception {
        if (query.getProjectId() == null){
            return Result.OK();
        }
        query.setOrderBy(Sort.Direction.ASC);
        try {
            List<SampleDO> list = sampleService.getAll(query);
//            list.stream().collect(Collectors.groupingBy())
            return Result.OK(list);
        } catch (Exception e) {
            log.error("????????????????????????,msg???", e);
            throw new Exception("????????????, ?????????");
        }
    }

    /**
     * ???????????????????????????
     *
     * @param query
     * @return
     */
    @RequestMapping(value = "/blurList")
    Result blurList(SampleQuery query) throws Exception {
        query.setOrderBy(Sort.Direction.ASC);
        List<SampleDO> res;
        try {
            res = sampleService.getAll(query);
        } catch (Exception e) {
            log.error("????????????????????????,msg???", e);
            throw new Exception("????????????, ?????????");
        }
        return Result.OK(res);
    }


    /**
     * ????????????
     *
     * @param sampleUpdate
     * @return
     */
    @RequestMapping(value = "/update")
    Result update(SampleUpdateVO sampleUpdate) {
        SampleDO sample = sampleService.getById(sampleUpdate.getId());
        check(sample, ResultCode.SAMPLE_NOT_EXISTED);
        BeanUtils.copyProperties(sampleUpdate, sample);
        return sampleService.update(sample);
    }

    /**
     * ????????????
     *
     * @param sampleId
     * @return
     */
    @RequestMapping(value = "/delete")
    Result delete(@RequestParam(value = "id", required = true) String sampleId) {
        SampleDO sample = sampleService.getById(sampleId);
        check(sample, ResultCode.SAMPLE_NOT_EXISTED);
        return sampleService.remove(sampleId);
    }

    /**
     * ????????????check
     */
    @PostMapping(value = "/check/excel")
    Result checkExcel(@RequestParam("file") MultipartFile file) throws Exception {
        CommonUtil.checkIsNotNull(file, UPLOAD_FILES_IS_NULL);
        List<SampleExcelErrorVO> errorSampleList = Lists.newArrayList();
        try {
            sampleExcelManager.importExcel(file, (vo) -> {
                sampleService.checkBatchWithExcelVO(vo, errorSampleList);
            });
        } catch (Exception e) {
            log.error("excel????????????, msg:", e);
            return Result.Error("excel????????????????????????????????????????????????");
        }

        return Result.OK(errorSampleList);
    }

    /**
     * ????????????excel
     *
     * @param file
     * @param projectId
     * @param uploadType
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/upload/excel")
    Result uploadExcel(@RequestParam("file") MultipartFile file, @RequestParam(value = "projectId", required = false) String projectId, @RequestParam("uploadType") Integer uploadType, HttpServletRequest request) throws Exception {
        String token = request.getHeader(Constants.X_ACCESS_TOKEN);
        ProjectDO project = null;
        if (projectId == null){
            project = new ProjectDO();
            String name = new SimpleDateFormat("yyyyMMdd-HHmmss").format(new Date());
            project.setName(name);
            project.setId(name);
            project.setAlias(name);
            project.setUserId(token);
            projectService.insert(project);
            projectId = project.getId();
        } else {
            project = projectService.getById(projectId);
        }
        CommonUtil.checkIsNotNull(file, UPLOAD_FILES_IS_NULL);
        CommonUtil.checkIsNotNull(project, PROJECT_NOT_EXISTED);
        // ??????project?????????????????????,????????????projectId????????????
        if (Objects.equals(uploadType, UploadType.OVERRIDE.getCode())) {
            sampleService.clearByProjectDO(project);
        }
        List<String> errorMsg = Lists.newArrayList();
        ProjectDO finalProject = project;
        sampleExcelManager.importExcel(file, (vo) -> {
            sampleService.saveBatchWithExcelVO(finalProject, vo, errorMsg);
        });
        Result result = Result.OK(errorMsg);
        HashMap<String, String> map = new HashMap<>();
        map.put("projectId", projectId);
        result.setFeatureMap(map);
        return result;
    }

    private SampleDO buildSampleDo(SampleAddVO sampleAdd) {
        return SampleDO.builder().sampleNo(sampleAdd.getSampleNo())
                .dim1(sampleAdd.getDim1())
                .dim2(sampleAdd.getDim2())
                .dim3(sampleAdd.getDim3())
                .projectId(sampleAdd.getProjectId())
                .build();
    }
}

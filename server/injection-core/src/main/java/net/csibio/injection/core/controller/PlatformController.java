package net.csibio.injection.core.controller;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSDownloadStream;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.gridfs.GridFSDBFile;
import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.constants.enums.PlatformStatus;
import net.csibio.injection.client.constants.enums.ResultCode;
import net.csibio.injection.client.domain.Result;
import net.csibio.injection.client.domain.db.PlatformDO;
import net.csibio.injection.client.domain.query.PlatformQuery;
import net.csibio.injection.client.domain.vo.platform.PlatformAddVO;
import net.csibio.injection.client.domain.vo.platform.PlatformUpdateVO;
import net.csibio.injection.client.domain.vo.platform.SopFile;
import net.csibio.injection.client.exceptions.ParamsCheckException;
import net.csibio.injection.client.service.BaseService;
import net.csibio.injection.client.service.IPlatformService;
import net.csibio.injection.core.validate.PlatformValidate;
import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;


import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import static net.csibio.injection.client.utils.CommonUtil.checkIsNotNull;

@RestController
@RequestMapping("platform")
@Slf4j
public class PlatformController extends BaseController<PlatformDO, PlatformQuery> {

    @Autowired
    private IPlatformService platformService;

    @Autowired
    private PlatformValidate platformValidate;

    @Resource
    private GridFsTemplate gridFsTemplate;

    @Resource
    private GridFSBucket gridFSBucket;

    @Override
    BaseService<PlatformDO, PlatformQuery> getBaseService() {
        return platformService;
    }

    @PostMapping(value = "/add")
    Result manualAdd(PlatformAddVO platformAddVO) {
        platformValidate.checkPlatformAdd(platformAddVO);

        //查询平台名称是否重复
        PlatformDO exist = platformService.getByName(platformAddVO.getName(), platformAddVO.getDevice());
        if (exist != null) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "PlatformController", "add", ResultCode.DEVICE_NAME_HAS_EXIST.getMessage());
            log.error(errMsg);
            throw new ParamsCheckException(ResultCode.DEVICE_NAME_HAS_EXIST.getCode(), ResultCode.DEVICE_NAME_HAS_EXIST.getMessage());
        }

        // 处理数据流
        ObjectId fileId = null;
        try {
            if (platformAddVO.getFile() != null) {
                fileId = gridFsTemplate.store(platformAddVO.getFile().getInputStream(), platformAddVO.getFileName(), "");
            }
        } catch (Exception e) {
            throw new RuntimeException();
        }

        Result result = platformService.insert(buildPlatformDO(platformAddVO, String.valueOf(fileId), platformAddVO.getFileName()));
        if (result.isFailed()) {
            return result;
        }
        return Result.OK();
    }

    @RequestMapping(value = "/list")
    Result list(PlatformQuery query) {
        query.setOrderBy(Sort.Direction.ASC);
        Result<List<PlatformDO>> res = platformService.getList(query);
        return res;
    }

    @RequestMapping(value = "/update")
    Result update(PlatformUpdateVO platformUpdateVO) {
        checkIsNotNull(platformUpdateVO.getId(), ResultCode.PLATFORM_ID_CANNOT_BE_EMPTY);
        PlatformDO platformDO = platformService.getById(platformUpdateVO.getId());
        checkIsNotNull(platformDO, ResultCode.PLATFORM_IS_EMPTY);
        BeanUtils.copyProperties(platformUpdateVO, platformDO);
        return platformService.update(platformDO);
    }

    @RequestMapping(value = "/delete")
    Result delete(@RequestParam(value = "id", required = true) String platformId) {
        PlatformDO platform = platformService.getById(platformId);
        checkIsNotNull(platform, ResultCode.PLATFORM_IS_EMPTY);
        return platformService.remove(platformId);
    }

    @GetMapping("/file/download")
    void download(HttpServletResponse response, HttpServletRequest request, @RequestParam(value = "fileId", required = true) String id) throws IOException {
        GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
        //打开下载流对象
        GridFSDownloadStream gridFS = gridFSBucket.openDownloadStream(gridFSFile.getObjectId());
        //创建gridFsSource，用于获取流对象
        GridFsResource gridFsResource = new GridFsResource(gridFSFile, gridFS);

        String fileName = gridFSFile.getFilename().replace(",", "");
        //处理中文文件名乱码
        if (request.getHeader("User-Agent").toUpperCase().contains("MSIE") ||
                request.getHeader("User-Agent").toUpperCase().contains("TRIDENT")
                || request.getHeader("User-Agent").toUpperCase().contains("EDGE")) {
            fileName = java.net.URLEncoder.encode(fileName, "UTF-8");
        } else {
            //非IE浏览器的处理：
            fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
        }
        // 通知浏览器进行文件下载
        response.setHeader("Content-Disposition", "attachment;filename=\"" + fileName + "\"");
        IOUtils.copy(gridFsResource.getInputStream(), response.getOutputStream());
    }


    private PlatformDO buildPlatformDO(PlatformAddVO platformAddVO, String fileId, String fileName) {
        return PlatformDO.builder()
                .msFilePath(platformAddVO.getMsFilePath())
                .mathPath(platformAddVO.getMathPath())
                .device(platformAddVO.getDevice())
                .owner(platformAddVO.getOwner())
                .status(PlatformStatus.VALID.getMessage())
                .fileId(fileId)
                .fileName(fileName)
                .name(platformAddVO.getName())
                .build();
    }
}


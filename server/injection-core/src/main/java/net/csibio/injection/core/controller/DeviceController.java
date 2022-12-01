package net.csibio.injection.core.controller;

import com.mongodb.client.MongoCursor;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.GridFSDownloadStream;
import com.mongodb.client.gridfs.GridFSFindIterable;
import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.constants.enums.DeviceStatus;
import net.csibio.injection.client.constants.enums.ResultCode;
import net.csibio.injection.client.domain.Result;
import net.csibio.injection.client.domain.db.DeviceDO;
import net.csibio.injection.client.domain.db.PlatformDO;
import net.csibio.injection.client.domain.query.DeviceQuery;
import net.csibio.injection.client.domain.vo.device.DeviceAddVO;
import net.csibio.injection.client.domain.vo.device.DeviceUpdateVO;
import net.csibio.injection.client.domain.vo.device.DeviceVO;
import net.csibio.injection.client.exceptions.ParamsCheckException;
import net.csibio.injection.client.service.BaseService;
import net.csibio.injection.client.service.IDeviceService;
import net.csibio.injection.client.service.IPlatformService;
import org.apache.poi.util.IOUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsCriteria;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequestMapping("device")
public class DeviceController extends BaseController<DeviceDO, DeviceQuery> {

    @Autowired
    private IDeviceService deviceService;

    @Resource
    private IPlatformService platformService;

    @Resource
    private GridFsTemplate gridFsTemplate;

    @Resource
    private GridFSBucket gridFSBucket;

    @Override
    BaseService<DeviceDO, DeviceQuery> getBaseService() {
        return deviceService;
    }

    /**
     * 新增设备
     * @param deviceAdd
     * @return
     * @throws IOException
     */
    @PostMapping(value = "/create")
    Result add(DeviceAddVO deviceAdd) throws IOException {
        // 判断configNO是否已经存在
        DeviceDO exist = deviceService.getByName(deviceAdd.getName());
        if (exist != null) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "DeviceController", "add", ResultCode.DEVICE_NAME_HAS_EXIST.getMessage());
            log.error(errMsg);
            throw new ParamsCheckException(ResultCode.DEVICE_NAME_HAS_EXIST.getCode(), ResultCode.DEVICE_NAME_HAS_EXIST.getMessage());
        }
        // 处理数据流
        ObjectId trainingMaterial = null;
        ObjectId otherMaterial = null;
        try {
            if (deviceAdd.getOtherMaterial() != null) {
                trainingMaterial = gridFsTemplate.store(deviceAdd.getTrainingMaterial().getInputStream(), deviceAdd.getTrainingMaterial().getOriginalFilename(), "");
            }
            if (deviceAdd.getOtherMaterial() != null) {
                otherMaterial = gridFsTemplate.store(deviceAdd.getOtherMaterial().getInputStream(), deviceAdd.getOtherMaterial().getOriginalFilename(), "");
            }
        } catch (Exception e) {
            throw new RuntimeException();
        }

        Result result = deviceService.insert(buildDeviceDO(deviceAdd, String.valueOf(otherMaterial), String.valueOf(trainingMaterial)));
        if (result.isFailed()) {
            return result;
        }
        return Result.OK();
    }

    /**
     * 文件瞎下载
     * @param response
     * @param request
     * @param id
     * @throws IOException
     */
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
        org.apache.commons.io.IOUtils.copy(gridFsResource.getInputStream(), response.getOutputStream());
    }

    /**
     * 设备列表
     * @param query
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "/list")
    Result list(DeviceQuery query) throws IOException {
        query.setOrderBy(Sort.Direction.ASC);
        Result<List<DeviceDO>> res = deviceService.getList(query);
        return res;
    }

    /**
     * 获取指定设备平台列表
     */
    @RequestMapping(value = "/getPlatforms")
    Result getPlatforms(@RequestParam(value = "deviceName", required = true) String deviceName) {
        List<PlatformDO> platformDOList = platformService.getByDevice(deviceName);
        return  Result.OK(platformDOList);
    }


    /**
     * 获取平台列表
     * @param query
     * @return
     */
    @RequestMapping(value = "/listPlatform")
    Result listPlatform(DeviceQuery query) {
        query.setOrderBy(Sort.Direction.ASC);
        List<DeviceDO> res = deviceService.getAll(query);
        List<DeviceVO> deviceVOList = res.stream().map(deviceDO -> {
            DeviceVO deviceVO = new DeviceVO();
            List<PlatformDO> platformDO = platformService.getByDevice(deviceDO.getName());
            deviceVO.setDeviceName(deviceDO.getName());
            deviceVO.setId(deviceDO.getId());
            deviceVO.setPlatformList(platformDO);
            return deviceVO;
        }).collect(Collectors.toList());
        return Result.OK(deviceVOList);
    }

    /**
     * 更新设备
     * @param deviceUpdate
     * @return
     */
    @RequestMapping(value = "/update")
    Result update(DeviceUpdateVO deviceUpdate) {
        DeviceDO device = deviceService.getById(deviceUpdate.getId());
        check(device, ResultCode.DEVICE_ID_CANNOT_BE_EMPTY);
        BeanUtils.copyProperties(deviceUpdate, device);
        return deviceService.update(device);
    }

    /**
     * 删除设备
     * @param sampleId
     * @return
     */
    @RequestMapping(value = "/delete")
    Result delete(@RequestParam(value = "id", required = true) String sampleId) {
        DeviceDO deviceDO = deviceService.getById(sampleId);
        check(deviceDO, ResultCode.DEVICE_IS_EMPTY);
        return deviceService.remove(sampleId);
    }

    private DeviceDO buildDeviceDO(DeviceAddVO deviceAdd, String otherMaterial, String trainingMaterial) {
        return DeviceDO.builder()
                .name(deviceAdd.getName())
                .deviceMode(deviceAdd.getDeviceModel())
                .deviceType(deviceAdd.getDeviceType())
                .mainParam(deviceAdd.getMainParam())
                .otherMaterial(otherMaterial)
                .otherMaterialName(deviceAdd.getOtherMaterial() != null? deviceAdd.getOtherMaterial().getOriginalFilename() : null)
                .trainingMaterial(trainingMaterial)
                .trainingMaterialName(deviceAdd.getTrainingMaterial() != null? deviceAdd.getTrainingMaterial().getOriginalFilename() : null)
                .owner(deviceAdd.getOwner())
                .status(DeviceStatus.VALID.getMessage())
                .build();
    }

    private GridFsResource[] test(String fileName) {
        GridFSFindIterable files = gridFsTemplate.find(Query.query(GridFsCriteria.whereFilename().regex(fileName)));
        List<GridFsResource> resources = new ArrayList();
        MongoCursor iterator = files.iterator();

        while (iterator.hasNext()) {
            GridFSFile file = (GridFSFile) iterator.next();
            resources.add(gridFsTemplate.getResource(file));
        }
        return resources.toArray(new GridFsResource[0]);
    }

}

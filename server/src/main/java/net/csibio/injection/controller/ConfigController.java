package net.csibio.injection.controller;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.constants.enums.ResultCode;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.ConfigDO;
import net.csibio.injection.domain.query.ConfigQuery;
import net.csibio.injection.domain.vo.config.ConfigAddVO;
import net.csibio.injection.domain.vo.config.ConfigUpdateVO;
import net.csibio.injection.exceptions.ParamsCheckException;
import net.csibio.injection.service.BaseService;
import net.csibio.injection.service.IConfigService;
import net.csibio.injection.utils.CommonUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("config")
public class ConfigController extends BaseController<ConfigDO, ConfigQuery> {

    @Autowired
    private IConfigService configService;

    @Override
    BaseService<ConfigDO, ConfigQuery> getBaseService() {
        return configService;
    }

    /**
     * 增加配置
     */
    @PostMapping(value = "/add")
    Result add(ConfigAddVO configAddVO) {
        CommonUtil.checkIsNotNull(configAddVO.getConfigNo(), ResultCode.CONFIG_NO_CANNOT_BE_EMPTY);
        CommonUtil.checkIsNotNull(configAddVO.getConfigName(), ResultCode.CONFIG_NAME_CANNOT_BE_EMPTY);

        // 判断configNO是否已经存在
        ConfigDO exist = configService.getByConfigNoAndType(configAddVO.getConfigNo(), configAddVO.getConfigType());
        if (exist != null) {
            String errMsg = String.format("class:%s|method:%s|error:%s", "configController", "configAdd", ResultCode.CONFIG_NO_ALREADY_EXISTED.getMessage());
            log.error(errMsg);
            throw new ParamsCheckException(ResultCode.CONFIG_NO_ALREADY_EXISTED.getCode(), ResultCode.CONFIG_NO_ALREADY_EXISTED.getMessage());

        }
        Result result = configService.insert(buildConfigDo(configAddVO));
        if (result.isFailed()) {
            return result;
        }
        return Result.OK();
    }

    /**
     * 配置列表展示
     *
     * @param query
     * @return
     */
    @RequestMapping(value = "/list")
    Result list(ConfigQuery query) {
        query.setOrderBy(Sort.Direction.ASC);
        Result<List<ConfigDO>> res = configService.getList(query);
        return res;
    }

    /**
     * 配置更新
     *
     * @param sampleUpdate
     * @return
     */
    @RequestMapping(value = "/update")
    Result update(ConfigUpdateVO sampleUpdate) {
        ConfigDO config = configService.getById(sampleUpdate.getId());
        check(config, ResultCode.SAMPLE_NOT_EXISTED);
        BeanUtils.copyProperties(sampleUpdate, config);
        return configService.update(config);
    }

    /**
     * 配置删除
     *
     * @param configId
     * @return
     */
    @RequestMapping(value = "/delete")
    Result delete(@RequestParam(value = "id", required = true) String configId) {
        ConfigDO config = configService.getById(configId);
        check(config, ResultCode.SAMPLE_NOT_EXISTED);
        return configService.remove(configId);
    }

    private ConfigDO buildConfigDo(ConfigAddVO configAddVO) {
        return ConfigDO.builder()
                .configNo(configAddVO.getConfigNo())
                .configName(configAddVO.getConfigName())
                .configType(configAddVO.getConfigType())
                .alias(configAddVO.getAlias())
                .build();
    }
}

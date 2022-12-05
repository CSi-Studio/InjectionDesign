package net.csibio.injection.controller;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.RunTemplateDO;
import net.csibio.injection.domain.query.RunTemplateQuery;
import net.csibio.injection.domain.vo.runTemplate.RunTemplateVO;
import net.csibio.injection.service.BaseService;
import net.csibio.injection.service.IRunTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 进样模板controller
 */
@RestController
@RequestMapping("runTemplate")
@Slf4j
public class RunTemplateController extends BaseController<RunTemplateDO, RunTemplateQuery>{

    @Autowired
    private IRunTemplateService runTemplateService;

    @Override
    BaseService<RunTemplateDO, RunTemplateQuery> getBaseService() {
        return runTemplateService;
    }

    @PostMapping(value = "/add")
    Result add(@RequestBody RunTemplateVO runTemplateVO) {
        Result result = runTemplateService.insert(buildRunTemplateDO(runTemplateVO));
        if (result.isFailed()) {
            return result;
        }
        return Result.OK();
    }

    @RequestMapping(value = "/list")
    Result list(RunTemplateQuery query) {
        // 按创建时间倒排
        query.setOrderBy(Sort.Direction.DESC);
        query.setSortColumn("createDate");
        Result<List<RunTemplateDO>> res = runTemplateService.getList(query);
        return res;
    }

    @RequestMapping(value = "/getByName")
    Result getName(@RequestParam(value = "name", required = true) String name) {
        RunTemplateQuery runTemplateQuery = new RunTemplateQuery();
        runTemplateQuery.setName(name);
        List<RunTemplateDO> template = runTemplateService.getAll(runTemplateQuery);
        return Result.OK(template.get(0));
    }



    private RunTemplateDO buildRunTemplateDO(RunTemplateVO runTemplateVO) {
        return RunTemplateDO.builder()
                .device(runTemplateVO.getDevice())
                .boardType(runTemplateVO.getBoardType())
                .name(runTemplateVO.getTemplateName())
                .owner(runTemplateVO.getOwner())
                .injectOrder(runTemplateVO.getDataSource())
                .build();
    }

}

package net.csibio.injection.controller;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.constants.enums.ResultCode;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.query.PageQuery;
import net.csibio.injection.exceptions.ParamsCheckException;
import net.csibio.injection.service.BaseService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public abstract class BaseController<T, Q extends PageQuery> {

    abstract BaseService<T, Q> getBaseService();

    @RequestMapping("/remove")
    Result remove(@RequestParam(value = "ids") String[] ids) {
        Result<List<String>> result = new Result<List<String>>();
        List<String> errorList = new ArrayList<>();
        List<String> deletedIds = new ArrayList<>();
        for (String id : ids) {
            Result removeResult = getBaseService().remove(id);
            if (removeResult.isSuccess()) {
                deletedIds.add(id);
            } else {
                errorList.add(removeResult.getMsgInfo());
            }
        }
        if (deletedIds.size() != 0) {
            result.setData(deletedIds);
            result.setSuccess(true);
        }
        if (errorList.size() != 0) {
            result.setErrorList(errorList);
        }
        return result;
    }

    protected <T> void check(T t, ResultCode resultCode) {
        if (t == null) {
            throw new ParamsCheckException(resultCode);
        }
    }

    protected void check(List tList, ResultCode resultCode) {
        if (tList == null || tList.size() == 0) {
            throw new ParamsCheckException(resultCode);
        }
    }

    protected void check(Result result){
        if (result.isFailed()){
            throw new ParamsCheckException(result.getMsgCode(), result.getMsgInfo());
        }
    }
}

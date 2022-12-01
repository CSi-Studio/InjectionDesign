package net.csibio.injection.client.service;

import net.csibio.injection.client.constants.enums.ResultCode;
import net.csibio.injection.client.domain.Result;
import net.csibio.injection.client.domain.query.PageQuery;
import net.csibio.injection.client.exceptions.XException;

import java.util.HashMap;
import java.util.List;

public interface BaseMultiService<T, Q extends PageQuery> {

    default T tryGetById(String id, String routerId, ResultCode code) throws XException {
        T t;
        try {
            t = getBaseDAO().getById(id, routerId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        if (t == null) {
            throw new XException(code);
        }
        return t;
    }

    default <K> K tryGetById(String id, Class<K> clazz, String routerId, ResultCode code) throws XException {
        K k;
        try {
            k = getBaseDAO().getById(id, clazz, routerId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        if (k == null) {
            throw new XException(code);
        }
        return k;
    }

    default T getById(String id, String routerId) {
        try {
            return getBaseDAO().getById(id, routerId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    default <K> K getById(String id, Class<K> clazz, String routerId) {
        try {
            return getBaseDAO().getById(id, clazz, routerId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    default boolean exists(Q q, String routerId) {
        try {
            return getBaseDAO().exists(q, routerId);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    default Result remove(String id, String routerId) {
        if (id == null || id.isEmpty()) {
            return Result.Error(ResultCode.ID_CANNOT_BE_NULL_OR_ZERO);
        }
        try {
            beforeRemove(id, routerId);
            getBaseDAO().remove(id, routerId);
            return Result.OK();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.Error(ResultCode.DELETE_ERROR);
        }
    }

    default Result remove(Q q, String routerId) {
        try {
            getBaseDAO().remove(q, routerId);
            return Result.OK();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.Error(ResultCode.DELETE_ERROR);
        }
    }

    default Result<T> insert(T t, String routerId) {
        try {
            beforeInsert(t, routerId);
            getBaseDAO().insert(t, routerId);
            return Result.OK(t);
        } catch (XException xe) {
            xe.printStackTrace();
            return Result.Error(xe.getCode(), xe.getMessage());
        } catch (Exception e) {
            return Result.Error(ResultCode.INSERT_ERROR);
        }
    }

    default Result<List<T>> insert(List<T> tList, String routerId) {
        try {
            for (T t : tList) {
                beforeInsert(t, routerId);
            }
            getBaseDAO().insert(tList, routerId);
            return Result.OK(tList);
        } catch (XException xe) {
            xe.printStackTrace();
            return Result.Error(xe.getCode(), xe.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return Result.Error(ResultCode.INSERT_ERROR);
        }
    }

    default Result<List<T>> update(List<T> tList, String routerId) {
        try {
            for (T t : tList) {
                beforeUpdate(t, routerId);
            }
            getBaseDAO().update(tList, routerId);
            return Result.OK(tList);
        } catch (XException xe) {
            xe.printStackTrace();
            return Result.Error(xe.getCode(), xe.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return Result.Error(ResultCode.UPDATE_ERROR);
        }
    }

    default Result<T> update(T t, String routerId) {
        try {
            beforeUpdate(t, routerId);
            getBaseDAO().update(t, routerId);
            return Result.OK(t);
        } catch (XException xe) {
            xe.printStackTrace();
            return Result.Error(xe.getCode(), xe.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return Result.Error(ResultCode.UPDATE_ERROR);
        }
    }

    default Result updateFirst(HashMap<String, Object> queryMap, HashMap<String, Object> fieldMap, String routerId) {
        boolean res = getBaseDAO().updateFirst(queryMap, fieldMap, routerId);
        if (res) {
            return Result.OK();
        } else {
            return Result.Error(ResultCode.UPDATE_ERROR);
        }
    }

    default Result updateAll(HashMap<String, Object> queryMap, HashMap<String, Object> fieldMap, String routerId) {
        boolean res = getBaseDAO().updateAll(queryMap, fieldMap, routerId);
        if (res) {
            return Result.OK();
        } else {
            return Result.Error(ResultCode.UPDATE_ERROR);
        }
    }

    default <K> K getOne(Q q, Class<K> clazz, String routerId) {
        return getBaseDAO().getOne(q, clazz, routerId);
    }

    default Result<List<T>> getList(Q q, String routerId) {
        List<T> tList = getBaseDAO().getList(q, routerId);
        long totalCount = getBaseDAO().count(q, routerId);
        Result<List<T>> result = new Result<>(true);
        result.setData(tList);
        result.setTotal(totalCount);
        result.setPageSize(q.getPageSize());
        return result;
    }

    default <K> Result<List<K>> getList(Q q, Class<K> clazz, String routerId) {
        List<K> tList = getBaseDAO().getList(q, clazz, routerId);
        long totalCount = getBaseDAO().count(q, routerId);
        Result<List<K>> result = new Result<>(true);
        result.setData(tList);
        result.setTotal(totalCount);
        result.setPageSize(q.getPageSize());
        return result;
    }

    default List<T> getAll(Q q, String routerId) {
        return getBaseDAO().getAll(q, routerId);
    }

    default <K> List<K> getAll(Q q, Class<K> clazz, String routerId) {
        return getBaseDAO().getAll(q, clazz, routerId);
    }

    default long count(Q q, String routerId) {
        return getBaseDAO().count(q, routerId);
    }

    default long estimatedCount(String routerId) {
        return getBaseDAO().estimatedCount(routerId);
    }

    IMultiDAO<T, Q> getBaseDAO();

    void beforeInsert(T t, String routerId) throws XException;

    void beforeUpdate(T t, String routerId) throws XException;

    void beforeRemove(String id, String routerId) throws XException;
}

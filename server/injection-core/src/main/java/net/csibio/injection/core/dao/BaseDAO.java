package net.csibio.injection.core.dao;

import net.csibio.aird.bean.common.IdName;
import net.csibio.aird.bean.common.IdNameType;
import net.csibio.injection.client.domain.query.PageQuery;
import net.csibio.injection.client.service.IDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.util.HashMap;
import java.util.List;

import static org.springframework.data.mongodb.core.query.Criteria.where;

public abstract class BaseDAO<T, Q extends PageQuery> implements IDAO<T, Q> {

    public final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    MongoTemplate mongoTemplate;

    protected abstract String getCollectionName();

    protected abstract Class<T> getDomainClass();

    protected abstract boolean allowSort();

    protected abstract Query buildQueryWithoutPage(Q query);

    public T getById(String id) {
        return (T) mongoTemplate.findById(id, getDomainClass(), getCollectionName());
    }

    public <K> K getById(String id, Class<K> clazz) {
        return mongoTemplate.findById(id, clazz, getCollectionName());
    }

    public T getOne(Q query) {
        return (T) mongoTemplate.findOne(buildQueryWithoutPage(query), getDomainClass(), getCollectionName());
    }

    public <K> K getOne(Q query, Class<K> clazz) {
        return mongoTemplate.findOne(buildQueryWithoutPage(query), clazz, getCollectionName());
    }

    public boolean exists(Q query) {
        return mongoTemplate.exists(buildQueryWithoutPage(query), getDomainClass(), getCollectionName());
    }

    @SuppressWarnings("Carefully Using!!!")
    public List<T> getAll(Q query) {
        return mongoTemplate.find(buildQueryWithoutPage(query), getDomainClass(), getCollectionName());
    }

    public <K> List<K> getAll(Q query, Class<K> clazz) {
        return mongoTemplate.find(buildQueryWithoutPage(query), clazz, getCollectionName());
    }

    public List<T> getList(Q query) {
        return mongoTemplate.find(buildQuery(query), getDomainClass(), getCollectionName());
    }

    public <K> List<K> getList(Q query, Class<K> clazz) {
        return mongoTemplate.find(buildQuery(query), clazz, getCollectionName());
    }

    public long count(Q query) {
        return mongoTemplate.count(buildQueryWithoutPage(query), getDomainClass(), getCollectionName());
    }

    public long estimatedCount(){
        return mongoTemplate.estimatedCount(getCollectionName());
    }

    public T insert(T t) {
        mongoTemplate.insert(t, getCollectionName());
        return t;
    }

    public List<T> insert(List<T> list) {
        mongoTemplate.insert(list, getCollectionName());
        return list;
    }

    public T update(T t) {
        mongoTemplate.save(t, getCollectionName());
        return t;
    }

    public List<T> update(List<T> list) {
        mongoTemplate.save(list, getCollectionName());
        return list;
    }

    public boolean updateFirst(HashMap<String, Object> queryMap, HashMap<String, Object> fieldMap){
        if(queryMap == null || queryMap.size() == 0 || fieldMap == null || fieldMap.size() == 0){
            return false;
        }

        Query query = new Query();
        queryMap.forEach((key, value) -> query.addCriteria(Criteria.where(key).is(value)));
        Update update = new Update();
        fieldMap.forEach(update::set);
        return mongoTemplate.updateFirst(query, update, getCollectionName()).wasAcknowledged();
    }

    public boolean updateAll(HashMap<String, Object> queryMap,HashMap<String, Object> fieldMap){
        if(queryMap == null || queryMap.size() == 0 || fieldMap == null || fieldMap.size() == 0){
            return false;
        }

        Query query = new Query();
        queryMap.forEach((key, value) -> query.addCriteria(Criteria.where(key).is(value)));
        Update update = new Update();
        fieldMap.forEach(update::set);
        return mongoTemplate.updateMulti(query, update, getCollectionName()).wasAcknowledged();
    }


    public void remove(String id) {
        Query query = new Query(where("id").is(id));
        mongoTemplate.findAllAndRemove(query, getDomainClass(), getCollectionName());
    }

    public void remove(Q query) {
        mongoTemplate.findAllAndRemove(buildQueryWithoutPage(query), getDomainClass(), getCollectionName());
    }

    public List<IdName> getIdNameList(Q query){
        return mongoTemplate.find(buildQueryWithoutPage(query), IdName.class, getCollectionName());
    }

    public List<IdNameType> getIdNameTypeList(Q query){
        return mongoTemplate.find(buildQueryWithoutPage(query), IdNameType.class, getCollectionName());
    }

    public Query buildQuery(Q targetQuery) {
        Query query = buildQueryWithoutPage(targetQuery);

        query.skip((targetQuery.getCurrent() - 1) * targetQuery.getPageSize());
        query.limit(targetQuery.getPageSize());
        if (allowSort()) {
            if (targetQuery.getSortColumn() != null && targetQuery.getOrderBy() != null) {
                query.with(Sort.by(targetQuery.getOrderBy(), targetQuery.getSortColumn()));
            }
        }
        return query;
    }
}

package net.csibio.injection.core.dao;

import com.alibaba.excel.util.StringUtils;
import net.csibio.injection.client.constants.enums.BoardStatus;
import net.csibio.injection.client.domain.db.BoardDO;
import net.csibio.injection.client.domain.query.BoardQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class BoardDAO extends BaseDAO<BoardDO, BoardQuery> {

    public static String CollectionName = "board";

    @Override
    protected String getCollectionName() {
        return CollectionName;
    }

    @Override
    protected Class<BoardDO> getDomainClass() {
        return BoardDO.class;
    }

    @Override
    protected boolean allowSort() {
        return true;
    }

    @Override
    protected Query buildQueryWithoutPage(BoardQuery boardQuery) {
        Query query = new Query();
        if (StringUtils.isNotBlank(boardQuery.getId())) {
            query.addCriteria(where("id").is(boardQuery.getId()));
        }
        if (StringUtils.isNotBlank(boardQuery.getPreOrderId())) {
            query.addCriteria(where("preOrderId").is(boardQuery.getPreOrderId()));
        }
        if (StringUtils.isNotBlank(boardQuery.getBoardType())) {
            query.addCriteria(where("boardType").is(boardQuery.getBoardType()));
        }
        if (StringUtils.isNotBlank(boardQuery.getBoardIndex())) {
            query.addCriteria(where("boardIndex").is(boardQuery.getBoardIndex()));
        }
        if (StringUtils.isNotBlank(boardQuery.getBoardNo())) {
            query.addCriteria(where("boardNo").is(boardQuery.getBoardNo()));
        }

        if (boardQuery.getStatus() != null) {
            query.addCriteria(where("status").is(boardQuery.getStatus()));
        }
        if (StringUtils.isNotBlank(boardQuery.getProjectId())) {
            query.addCriteria(where("projectId").is(boardQuery.getProjectId()));
        }
        if (boardQuery.getPriority() != null) {
            query.addCriteria(where("priority").is(boardQuery.getPriority()));
        }
        return query;
    }

    public BoardDO getByOrderIdAndType(String orderId, String boardType, String boardIndex) {
        BoardQuery query = new BoardQuery();
        query.setBoardType(boardType);
        query.setPreOrderId(orderId);
        query.setBoardIndex(boardIndex);
        query.setStatus(BoardStatus.VALID.getCode());
        return mongoTemplate.findOne(buildQuery(query), BoardDO.class, CollectionName);
    }

    public BoardDO getByOrderIdAndIndex(String orderId, String boardIndex) {
        BoardQuery query = new BoardQuery();
        query.setPreOrderId(orderId);
        query.setBoardIndex(boardIndex);
        query.setStatus(BoardStatus.VALID.getCode());
        return mongoTemplate.findOne(buildQuery(query), BoardDO.class, CollectionName);
    }

    public BoardDO getByBoardNo(String boardNo) {
        BoardQuery query = new BoardQuery();
        query.setBoardNo(boardNo);
        query.setStatus(BoardStatus.VALID.getCode());
        return mongoTemplate.findOne(buildQuery(query), BoardDO.class, CollectionName);
    }
}

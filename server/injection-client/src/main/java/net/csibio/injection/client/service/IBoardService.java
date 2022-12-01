package net.csibio.injection.client.service;

import net.csibio.injection.client.domain.db.BoardDO;
import net.csibio.injection.client.domain.query.BoardQuery;

import java.util.List;

public interface IBoardService extends BaseService<BoardDO, BoardQuery>{
    BoardDO getByOrderIdAndType(String id, String boardType, String boardIndex);

    BoardDO getByOrderIdAndIndex(String orderId, String boardIndex);

    BoardDO getByBoardNo(String boardNo);
}

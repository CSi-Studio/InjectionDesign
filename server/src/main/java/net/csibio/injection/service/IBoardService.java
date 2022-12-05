package net.csibio.injection.service;

import net.csibio.injection.domain.db.BoardDO;
import net.csibio.injection.domain.query.BoardQuery;

public interface IBoardService extends BaseService<BoardDO, BoardQuery> {
    BoardDO getByOrderIdAndType(String id, String boardType, String boardIndex);

    BoardDO getByOrderIdAndIndex(String orderId, String boardIndex);

    BoardDO getByBoardNo(String boardNo);
}

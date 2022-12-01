package net.csibio.injection.core.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.client.domain.db.BoardDO;
import net.csibio.injection.client.domain.query.BoardQuery;
import net.csibio.injection.client.exceptions.XException;
import net.csibio.injection.client.service.IBoardService;
import net.csibio.injection.client.service.IDAO;
import net.csibio.injection.core.dao.BoardDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

import static net.csibio.injection.core.InjectionApplication.logger;


@Service("boardService")
@Slf4j
public class BoardServiceImpl implements IBoardService {

    @Autowired
    BoardDAO boardDAO;

    @Override
    public IDAO<BoardDO, BoardQuery> getBaseDAO() {
        return boardDAO;
    }

    @Override
    public void beforeInsert(BoardDO boardDO) throws XException {
        boardDO.setCreateDate(new Date());
        boardDO.setLastModifiedDate(new Date());
    }

    @Override
    public void beforeUpdate(BoardDO boardDO) throws XException {
        boardDO.setLastModifiedDate(new Date());
    }

    @Override
    public BoardDO getByOrderIdAndType(String orderId, String boardType, String boardIndex) {
        try {
            return boardDAO.getByOrderIdAndType(orderId, boardType, boardIndex);
        } catch (Exception e) {
            logger.warn(e.getMessage());
            return null;
        }
    }

    @Override
    public BoardDO getByOrderIdAndIndex(String orderId, String boardIndex) {
        try {
            return boardDAO.getByOrderIdAndIndex(orderId, boardIndex);
        } catch (Exception e) {
            logger.warn(e.getMessage());
            return null;
        }
    }

    @Override
    public BoardDO getByBoardNo(String boardNo) {
        try {
            return boardDAO.getByBoardNo(boardNo);
        } catch (Exception e) {
            logger.warn(e.getMessage());
            return null;
        }
    }

}

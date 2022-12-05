package net.csibio.injection.constants.enums;

import java.util.ArrayList;
import java.util.List;

public enum BoardType {
    /**
     * 9*9样本板
     */
    NINE_NINE(1, "9*9样本板", 81),

    /**
     * 96孔板
     */
    NINETY_SIX(2, "96孔板", 81),

    /**
     * 128孔板
     */
    ONE_HUNDRED_AND_EIGHT(3, "128孔板", 128),

    /**
     * 48孔板
     */
    SIX_POINT_EIGHT(6, "48孔板", 48),

    /**
     * ep管
     */
    EP(4, "ep管", 1),

    /**
     * 进样瓶
     */
    RUN_SAMPLE_BOARD(5, "进样瓶", 0);

    private Integer code;
    private String message;
    private Integer quota;

    BoardType(Integer code, String message, Integer quota) {
        this.code = code;
        this.message = message;
        this.quota = quota;
    }

    public static BoardType of(int value) {
        BoardType[] values = values();
        for (BoardType boardType : values) {
            if (boardType.code == value) {
                return boardType;
            }
        }
        return null;
    }

    public Integer getQuota() {
        return quota;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public List<BoardType> getAllBoardType() {
        List<BoardType> boardTypeList = new ArrayList<>();
        boardTypeList.add(BoardType.NINE_NINE);
        boardTypeList.add(BoardType.EP);
        boardTypeList.add(BoardType.NINETY_SIX);
        return boardTypeList;
    }
}

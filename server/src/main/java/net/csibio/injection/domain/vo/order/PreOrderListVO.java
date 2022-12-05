package net.csibio.injection.domain.vo.order;

import lombok.Data;
import net.csibio.injection.domain.db.PreOrderDO;

import java.util.List;

@Data
public class PreOrderListVO extends PreOrderDO {

    /**
     * 已使用孔板号
     */
    List<String> boardNoList;
}

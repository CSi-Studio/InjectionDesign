package net.csibio.injection.client.domain.vo.order;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

@Data
public class WhiteListPreOrderVO implements Serializable {

    /**
     * 负责人名称
     *
     */
    private String owner;

    /**
     * 白名单excel
     */
    private MultipartFile whiteExcelFile;

    /**
     * projectid
     */
    private String projectId;

    /**
     * 随机化方法
     */
    private Integer randomMethod;

    /**
     * 批次样本确认
     */
    private Integer saveType;
}

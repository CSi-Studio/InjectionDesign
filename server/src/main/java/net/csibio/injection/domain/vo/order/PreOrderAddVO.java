package net.csibio.injection.domain.vo.order;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
public class PreOrderAddVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 4635563926586249746L;

    /**
     * 负责人名称
     */
    private String owner;

    /**
     * 随机化方法
     */
    private Integer randomMethod;

    /**
     * 批次样本确认
     */
    private Integer saveType;

    /**
     * 样本总数
     */
    private Integer sampleTotal;

    /**
     * 样本id
     */
    private List<String> sampleList;

    /**
     * 项目id
     */
    private String projectId;

    /**
     * excelFile
     */
    private MultipartFile file;

    /**
     * 白名单excel
     */
    private MultipartFile whiteExcelFile;
}

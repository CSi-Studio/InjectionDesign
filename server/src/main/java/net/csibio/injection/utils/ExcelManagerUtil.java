package net.csibio.injection.utils;


import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.support.ExcelTypeEnum;
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.constants.*;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.base.BaseDO;
import net.csibio.injection.domain.query.PageQuery;
import net.csibio.injection.service.BaseService;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
public abstract class ExcelManagerUtil<D extends BaseDO, Q extends PageQuery, S extends BaseService<D, Q>, V> extends AnalysisEventListener<V> {

    protected S s;
    protected Class<V> clavv;
    protected Class<D> cladd;
    protected Function<V, D> function;
    protected Consumer<V> action;

    protected boolean forFunction = false;
    /**
     * 批量处理的数量可以重新赋值，改变批量的数量
     */
    protected int batchCount = 3000;
    List<V> list = new ArrayList<>();

    public ExcelManagerUtil(S s) {
        // 1获取子类的class(在创建子类对象的时候,会返回父类的构造方法)
        Class<? extends ExcelManagerUtil> clazz = this.getClass(); // Student
        // 2获取当前类的带有泛型的父类类型
        ParameterizedType type = (ParameterizedType) clazz.getGenericSuperclass();
        // 3返回实际参数类型(泛型可以写多个)
        Type[] types = type.getActualTypeArguments();
        // 4 获取第一个参数(泛型的具体类) Person.class
        if (!ObjectUtils.isEmpty(types) && types.length == 4) {
            this.cladd = (Class<D>) types[0];
            this.clavv = (Class<V>) types[3];
        }
        this.s = s;
    }

    public void exportExcel(HttpServletResponse response, Q q) throws Exception {
        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        preExcelHandle(response, StringConstants.TEXT_STR);
        EasyExcel.write(response.getOutputStream(), clavv).sheet(ExcelTableNameConstants.TABLE_ONE).doWrite(data(q));
    }

    public void exportExcel(HttpServletResponse response, Collection<V> vList) throws Exception {
        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        exportExcel(response, vList, StringConstants.TEXT_STR);
    }

    public void exportExcel(HttpServletResponse response, Collection<V> vList, String fileNameStr) throws Exception {
        preExcelHandle(response, fileNameStr);
        EasyExcel.write(response.getOutputStream(), clavv).excelType(ExcelTypeEnum.XLS).sheet(ExcelTableNameConstants.TABLE_ONE).doWrite(vList);
    }

    public void exportExcel(HttpServletResponse response, Collection<V> vList, String fileNameStr, ExcelTypeEnum excelTypeEnum) throws Exception {
        if (Objects.equals(excelTypeEnum, ExcelTypeEnum.XLS)) {
            preExcelHandle(response, fileNameStr, FileConstants.XLS);
        }
        else if (Objects.equals(excelTypeEnum, ExcelTypeEnum.XLSX)) {
            preExcelHandle(response, fileNameStr, FileConstants.XLSX);
        }
        else if (Objects.equals(excelTypeEnum, ExcelTypeEnum.CSV)) {
            preExcelHandle(response, fileNameStr, FileConstants.CSV);
        }

        EasyExcel.write(response.getOutputStream(), clavv).excelType(excelTypeEnum).sheet(ExcelTableNameConstants.TABLE_ONE).doWrite(vList);
    }

    private void preExcelHandle(HttpServletResponse response, String fileNameStr) throws UnsupportedEncodingException {
        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        response.setContentType(HttpConstants.EXCEL_CONTENT_TYPE);
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
        String fileName = URLEncoder.encode(fileNameStr, StandardCharsets.UTF_8).replaceAll("\\+", ViewConstants.SPACE);
        response.setHeader(HttpConstants.CONTENT_DISPOSITION, "attachment;filename*=utf-8''" + fileName + FileConstants.XLS);
    }

    private void preExcelHandle(HttpServletResponse response, String fileNameStr, String filePrefix) throws UnsupportedEncodingException {
        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        response.setContentType(HttpConstants.EXCEL_CONTENT_TYPE);
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
        String fileName = URLEncoder.encode(fileNameStr, StandardCharsets.UTF_8).replaceAll("\\+", ViewConstants.SPACE);
        response.setHeader(HttpConstants.CONTENT_DISPOSITION, "attachment;filename*=utf-8''" + fileName + filePrefix);
    }


    //    D:\ideaProject\Injection\injection-core\src\main\resources\msOrderTemplate.xlsx
    public void exportExcel(HttpServletResponse response, Collection<V> vList, String fileNameStr, String templateFile) throws Exception {
        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        preExcelHandle(response, fileNameStr);
        InputStream templateInputStream = new ClassPathResource(templateFile).getInputStream();
        EasyExcel.write(response.getOutputStream()).withTemplate(templateInputStream).excelType(ExcelTypeEnum.XLSX).autoCloseStream(Boolean.FALSE).sheet(0).relativeHeadRowIndex(-1).doWrite(vList);
    }

    public void exportExcel(HttpServletResponse response, Collection<V> vList, String fileNameStr, String templateFile, ExcelTypeEnum excelTypeEnum) throws Exception {
        if (Objects.equals(excelTypeEnum, ExcelTypeEnum.XLS)) {
            preExcelHandle(response, fileNameStr, FileConstants.XLS);
        }
        else if (Objects.equals(excelTypeEnum, ExcelTypeEnum.XLSX)) {
            preExcelHandle(response, fileNameStr, FileConstants.XLSX);
        }
        else if (Objects.equals(excelTypeEnum, ExcelTypeEnum.CSV)) {
            preExcelHandle(response, fileNameStr, FileConstants.CSV);
        }
        InputStream templateInputStream = new ClassPathResource(templateFile).getInputStream();
        EasyExcel.write(response.getOutputStream()).withTemplate(templateInputStream).excelType(excelTypeEnum).autoCloseStream(Boolean.FALSE).sheet(0).relativeHeadRowIndex(-1).doWrite(vList);
    }


    private Collection<V> data(Q q) {
        Result<List<D>> result = this.s.getList(q);
        if (result != null && result.isSuccess() && !ObjectUtils.isEmpty(result.getData())) {
            return DomainConversionUtils.getVOsByDOs(clavv, result.getData());
        }
        return new ArrayList<>();
    }


    public void importExcel(MultipartFile file) throws IOException {
        EasyExcel.read(file.getInputStream(), clavv, this).sheet().doRead();
    }

    /**
     * 载入文件，定义转化方式
     *
     * @param file     excel 文件
     * @param function 转换方式
     * @throws IOException io 错误
     */
    public void importExcel(MultipartFile file, Function<V, D> function) throws IOException {
        this.function = function;
        EasyExcel.read(file.getInputStream(), clavv, this).sheet().doRead();
    }

    /**
     * 载入文件，定义转化方式
     *
     * @param file   excel 文件
     * @param action 转换方式,自定义插入时机
     * @throws IOException io 错误
     */
    public void importExcel(MultipartFile file, Consumer<V> action) throws IOException {
        this.action = action;
        EasyExcel.read(file.getInputStream(), clavv, this).sheet().doRead();
    }

    public void importExcel(MultipartFile file, Consumer<V> action, ExcelTypeEnum excelTypeEnum) throws IOException {
        this.action = action;
        EasyExcel.read(file.getInputStream(), clavv, this).excelType(excelTypeEnum).sheet().doRead();
    }

    public void importExcel(InputStream inputStream, Consumer<V> action) throws IOException {
        this.action = action;
        EasyExcel.read(inputStream, clavv, this).sheet().doRead();
    }

    @Override
    public void invoke(V v, AnalysisContext analysisContext) {
        log.debug("解析到一条数据:{}", JSON.toJSONString(v));
        list.add(v);
        // 达到BATCH_COUNT了，需要去存储一次数据库，防止数据几万条数据在内存，容易OOM
        if (list.size() >= batchCount) {
            saveData();
            // 存储完成清理 list
            list.clear();
        }
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext analysisContext) {
        // 这里也要保存数据，确保最后遗留的数据也存储到数据库
        saveData();
        // 清空转化方式
        this.function = null;
        this.action = null;
        list.clear();
        log.debug("所有数据解析完成！");
    }

    /**
     * 加上存储数据库
     */
    public void saveData() {
        log.debug("{}条数据，开始存储数据库！", list.size());
        if (this.forFunction) {
            for (V v : list) {
                this.saveData(v);
            }
        } else if (!ObjectUtils.isEmpty(this.action)) {
            list.forEach(this.action);
        } else {
            List<D> dos = list.stream().map(ObjectUtils.isEmpty(this.function) ? this::voConvertDoHandle : this.function).filter(Objects::nonNull).collect(Collectors.toList());
            s.insert(dos);
        }
        log.debug("存储数据库成功！");
    }

    protected void saveData(V v) {

    }

    /**
     * vo 转化为 do 的路径如果有对过程的其他操作请重写此方法
     *
     * @return 持久类对象
     */
    public D voConvertDoHandle(V v) {
        if (ObjectUtils.isEmpty(v)) {
            return null;
        }
        D domain = null;
        try {
            domain = cladd.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(v, domain);
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException |
                 NoSuchMethodException e) {
            e.printStackTrace();
        }
        return domain;

    }
}

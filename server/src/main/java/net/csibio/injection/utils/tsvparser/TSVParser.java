package net.csibio.injection.utils.tsvparser;

import net.csibio.injection.domain.vo.sample.SampleTsvVO;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
public class TSVParser {
    public List<SampleTsvVO> parse(MultipartFile file, TsvReader reader) {
        List<SampleTsvVO> sampleTsvVOS = new ArrayList<>();
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line;

            while ((line = br.readLine()) != null) {
                String[] fields = line.split("\t");
                SampleTsvVO sampleTsvVO = SampleTsvVO.parseTsv(fields);
                reader.readLine(sampleTsvVO);
                sampleTsvVOS.add(sampleTsvVO);
            }

            br.close();

            br.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return sampleTsvVOS;
    }

    // 可以添加其他通用的解析方法，根据需要进行扩展
}

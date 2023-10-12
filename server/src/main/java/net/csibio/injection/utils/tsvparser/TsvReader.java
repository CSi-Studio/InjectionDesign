package net.csibio.injection.utils.tsvparser;

import net.csibio.injection.domain.vo.sample.SampleTsvVO;

@FunctionalInterface
public interface TsvReader {
    void readLine(SampleTsvVO sampleTsvVO);
}

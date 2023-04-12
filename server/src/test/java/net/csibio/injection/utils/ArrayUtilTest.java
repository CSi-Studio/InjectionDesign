package net.csibio.injection.utils;

import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.units.qual.A;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
public class ArrayUtilTest {

    @Test
    public void toArray() {
        List<Double> test = new ArrayList<>();
        test.add(Double.valueOf("0.1"));
        test.add(Double.valueOf("0.2"));
        test.add(Double.valueOf("0.3"));

        double[] doubles = ArrayUtil.toArray(test);
        Assert.notNull(doubles, "notNUll");

    }
}

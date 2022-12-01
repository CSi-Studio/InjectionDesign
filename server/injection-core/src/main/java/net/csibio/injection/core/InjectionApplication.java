package net.csibio.injection.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
@EnableAsync
@EnableCaching
@EnableScheduling
@EnableAspectJAutoProxy
public class InjectionApplication {

    public static final Logger logger = LoggerFactory.getLogger(InjectionApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(InjectionApplication.class, args);
    }
}

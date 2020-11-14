package com.trump.cms.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration
public class MyConfig {

    public static Integer pageNum;

    public static Integer pageSize;

    @Value("${page.pageNum}")
    public static void setPageNum(Integer pageNum) {
        MyConfig.pageNum = pageNum;
    }

    @Value("${page.pageSize}")
    public static void setPageSize(Integer pageSize) {
        MyConfig.pageSize = pageSize;
    }

}

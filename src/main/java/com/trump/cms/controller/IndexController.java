package com.trump.cms.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

    @RequestMapping({"/", "/index", "/index.html"})
    public String index() {

        return "index/index";

    }

    @RequestMapping({"/open"})
    public String open() throws Exception {

        throw new Exception("123");

    }

}

package com.trump.cms.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AuthenticationController {

    @RequestMapping({"/login"})
    public String index() {

        return "authentication/login";

    }

}

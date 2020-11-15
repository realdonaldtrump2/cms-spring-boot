package com.trump.cms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import com.trump.cms.entity.vo.ArticleCategoryVo;
import com.trump.cms.service.ArticleCategoryService;

@Controller
public class ArticleCategoryController {

    @Autowired
    ArticleCategoryService articleCategoryService;

    @RequestMapping("/article-category/index")
    public String index(
            Model model
    ) {

        List<ArticleCategoryVo> articleCategoryVoList = articleCategoryService.all();
        model.addAttribute("articleCategoryVoList", articleCategoryVoList);
        return "article-category/index";

    }

}

package com.trump.cms.controller;


import com.trump.cms.entity.ArticleCategory;
import com.trump.cms.service.ArticleCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


@Controller
public class ArticleCategoryController {

    @Autowired
    ArticleCategoryService articleCategoryService;

    @RequestMapping("/article-category/index")
    public String index(
            Model model,
            @RequestParam(value = "name", defaultValue = "") String name
    ) {

        List<ArticleCategory> articleCategoryList = articleCategoryService.all();
        model.addAttribute("articleCategoryList", articleCategoryList);
        return "article-category/index";

    }


}

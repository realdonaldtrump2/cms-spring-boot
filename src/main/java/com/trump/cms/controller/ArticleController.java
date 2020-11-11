package com.trump.cms.controller;


import com.trump.cms.entity.Article;
import com.trump.cms.entity.ArticleCategory;
import com.trump.cms.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class ArticleController {

    @Autowired
    ArticleRepository articleRepository;

    @RequestMapping("/article/index")
    public void index(
            Model model,
            @RequestParam(value = "title", defaultValue = "") String title
    ) {

        List<Article> articleList = articleRepository.findAll();
        for (Article value : articleList) {
            System.out.println(value.toString());
        }

    }


}

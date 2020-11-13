package com.trump.cms.controller;


import com.trump.cms.entity.Article;
import com.trump.cms.param.ArticleParam;
import com.trump.cms.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Iterator;


@Controller
public class ArticleController {

    @Autowired
    ArticleService articleService;

    @RequestMapping("/article/index")
    public String index(
            Model model,
            @RequestParam(value = "pageNum", defaultValue = "0") int pageNum,
            @RequestParam(value = "pageSize", defaultValue = "2") int pageSize,
            @RequestParam(value = "title", defaultValue = "") String title
    ) {

        Page<Article> articlePage = articleService.page(pageNum, pageSize, new ArticleParam(title));
        System.out.println("总页数" + articlePage.getTotalPages());
        System.out.println("当前页是：" + pageNum);
        System.out.println("分页数据：");
        Iterator<Article> article = articlePage.iterator();
        while (article.hasNext()) {
            System.out.println(article.next().toString());
        }
        model.addAttribute("articlePage", articlePage);

        return "article/index";

    }


}

package com.trump.cms.controller;

import com.trump.cms.entity.so.ArticleSo;
import com.trump.cms.entity.vo.ArticleVo;
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

        ArticleSo articleSo = new ArticleSo();
        articleSo.setTitle(title);
        articleSo.setPageNum(pageNum);
        articleSo.setPageSize(pageSize);

        Page<ArticleVo> articleVoPage = articleService.page(articleSo);
        Iterator<ArticleVo> articleVoIterator = articleVoPage.iterator();
        while (articleVoIterator.hasNext()) {
            System.out.println(articleVoIterator.next().toString());
        }
        model.addAttribute("articleVoPage", articleVoPage);
        return "article/index";

    }


    @RequestMapping("/article/view")
    public String view(
            Model model,
            @RequestParam(value = "id", defaultValue = "0") int id
    ) {

        ArticleVo articleVo = articleService.find(id);
        if (articleVo == null) {
            throw new RuntimeException("参数错误");
        }

        model.addAttribute("articleVo", articleVo);
        return "article/view";

    }


}

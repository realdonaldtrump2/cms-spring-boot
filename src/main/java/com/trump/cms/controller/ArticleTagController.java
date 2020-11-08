package com.trump.cms.controller;

import com.trump.cms.entity.ArticleTag;
import com.trump.cms.param.ArticleTagParam;
import com.trump.cms.service.ArticleTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;
import java.util.Iterator;


@Controller
public class ArticleTagController {

    @Autowired
    ArticleTagService articleTagService;

    @RequestMapping("/article-tag/index")
    public String index(
            Model model,
            @RequestParam(value = "pageNum", defaultValue = "0") int pageNum,
            @RequestParam(value = "pageSize", defaultValue = "2") int pageSize,
            @RequestParam(value = "title", defaultValue = "") String title
    ) {

        Page<ArticleTag> articleTagPage = articleTagService.getPage(pageNum, pageSize, new ArticleTagParam(title));
        System.out.println("总页数" + articleTagPage.getTotalPages());
        System.out.println("当前页是：" + pageNum);
        System.out.println("分页数据：");
        Iterator<ArticleTag> articleTag = articleTagPage.iterator();
        while (articleTag.hasNext()) {
            System.out.println(articleTag.next().toString());
        }
        model.addAttribute("articleTagPage", articleTagPage);
        return "article-tag/index";

    }


    @RequestMapping(value = "/article-tag/create", method = RequestMethod.GET)
    public String create(Model model) {
        model.addAttribute("articleTag", new ArticleTag());
        return "article-tag/create";
    }


    @RequestMapping(value = "/article-tag/create", method = RequestMethod.POST)
    public String save(@Valid ArticleTag articleTag, BindingResult bindingResult) {
        System.out.println(articleTag);
        if (bindingResult.hasErrors()) {
            return "article-tag/create";
        }

        ArticleTag articleTag2 = articleTagService.create(articleTag);
        System.out.println(articleTag2);
        return "redirect:/article-tag/index";
    }


}

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

    @RequestMapping("/article-tag/view")
    public String view(
            Model model,
            @RequestParam(value = "id", defaultValue = "0") int id
    ) {

        ArticleTag articleTag = articleTagService.find(id);
        if (articleTag == null) {
            throw new RuntimeException("参数错误");
        }
        model.addAttribute("articleTag", articleTag);
        return "article-tag/view";

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


    @RequestMapping(value = "/article-tag/update", method = RequestMethod.GET)
    public String update(
            @RequestParam(value = "id", defaultValue = "0") int id,
            Model model
    ) {

        ArticleTag articleTag = articleTagService.find(id);
        if (articleTag == null) {
            throw new RuntimeException("参数错误");
        }
        model.addAttribute("articleTag", articleTag);
        return "article-tag/update";
    }


    @RequestMapping(value = "/article-tag/update", method = RequestMethod.POST)
    public String modify(
            @RequestParam(value = "id", defaultValue = "0") int id,
            @Valid ArticleTag articleTag, BindingResult bindingResult
    ) {

        ArticleTag articleTag2 = articleTagService.find(id);
        if (articleTag2 == null) {
            throw new RuntimeException("参数错误");
        }

        articleTagService.update(articleTag2, articleTag);
        System.out.println(articleTag2);
        return "redirect:/article-tag/index";

    }


    @RequestMapping(value = "/article-tag/delete", method = RequestMethod.GET)
    public String delete(
            @RequestParam(value = "id", defaultValue = "0") int id
    ) {

        ArticleTag articleTag = articleTagService.find(id);
        if (articleTag == null) {
            throw new RuntimeException("参数错误");
        }
        articleTagService.delete(articleTag);
        return "redirect:/article-tag/index";

    }


}

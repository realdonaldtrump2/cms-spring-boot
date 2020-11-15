package com.trump.cms.controller;

import com.trump.cms.config.MyConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;

import com.trump.cms.entity.po.ArticleTag;
import com.trump.cms.entity.fo.ArticleTagFo;
import com.trump.cms.entity.so.ArticleTagSo;
import com.trump.cms.entity.vo.ArticleTagVo;
import com.trump.cms.service.ArticleTagService;


@Controller
public class ArticleTagController {

    @Autowired
    ArticleTagService articleTagService;

    @Autowired
    MyConfig myConfig;

    @RequestMapping("/article-tag/index")
    public String index(
            Model model,
            @RequestParam(value = "pageNum", defaultValue = "0") int pageNum,
            @RequestParam(value = "pageSize", defaultValue = "2") int pageSize,
            @RequestParam(value = "title", defaultValue = "") String title
    ) {

        System.out.println(myConfig.getPageNum());

        ArticleTagSo articleTagSo = new ArticleTagSo();
        articleTagSo.setTitle(title);
        articleTagSo.setPageNum(pageNum);
        articleTagSo.setPageSize(pageSize);

        Page<ArticleTagVo> articleTagVoPage = articleTagService.page(articleTagSo);
//        Iterator<ArticleTagVo> articleTagVoIterator = articleTagVoPage.iterator();
        model.addAttribute("articleTagVoPage", articleTagVoPage);
        return "article-tag/index";

    }

    @RequestMapping("/article-tag/view")
    public String view(
            Model model,
            @RequestParam(value = "id", defaultValue = "0") int id
    ) {

        ArticleTagVo articleTagVo = articleTagService.find(id);
        if (articleTagVo == null) {
            throw new RuntimeException("参数错误");
        }
        model.addAttribute("articleTagVo", articleTagVo);
        return "article-tag/view";

    }


    @RequestMapping(value = "/article-tag/create", method = RequestMethod.GET)
    public String create(Model model) {

        ArticleTagFo articleTagFo = new ArticleTagFo();
        model.addAttribute("articleTagFo", articleTagFo);
        return "article-tag/create";

    }

    @RequestMapping(value = "/article-tag/create", method = RequestMethod.POST)
    public String save(@Valid ArticleTagFo articleTagFo, BindingResult bindingResult) {
        System.out.println(articleTagFo);
        if (bindingResult.hasErrors()) {
            return "article-tag/create";
        }

        articleTagService.create(articleTagFo);
        return "redirect:/article-tag/index";
    }


    @RequestMapping(value = "/article-tag/update", method = RequestMethod.GET)
    public String update(
            @RequestParam(value = "id", defaultValue = "0") int id,
            Model model
    ) {

        ArticleTagFo articleTagFo = articleTagService.findFo(id);
        ;
        if (articleTagFo == null) {
            throw new RuntimeException("参数错误");
        }
        model.addAttribute("articleTagFo", articleTagFo);
        return "article-tag/update";

    }


    @RequestMapping(value = "/article-tag/update", method = RequestMethod.POST)
    public String modify(
            @RequestParam(value = "id", defaultValue = "0") int id,
            @Valid ArticleTagFo articleTagFo, BindingResult bindingResult
    ) {

        if (bindingResult.hasErrors()) {
            return "article-tag/update";
        }
        articleTagService.update(id, articleTagFo);
        return "redirect:/article-tag/index";

    }


    @RequestMapping(value = "/article-tag/delete", method = RequestMethod.GET)
    public String delete(
            @RequestParam(value = "id", defaultValue = "0") int id
    ) {

        articleTagService.delete(id);
        return "redirect:/article-tag/index";

    }


}

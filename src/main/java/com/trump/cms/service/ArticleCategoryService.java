package com.trump.cms.service;

import com.trump.cms.repository.ArticleCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.trump.cms.entity.po.ArticleCategory;
import com.trump.cms.entity.vo.ArticleCategoryVo;
import com.trump.cms.entity.vo.ArticleTagVo;


@Service
public class ArticleCategoryService implements InterfaceArticleCategoryService {

    @Autowired
    ArticleCategoryRepository articleCategoryRepository;

    public List<ArticleCategoryVo> all(){

        List<ArticleCategory> articleCategoryList = articleCategoryRepository.findAll();

        List<ArticleCategoryVo> articleCategoryVoList = articleCategoryList.stream().map(articleCategory -> {
            ArticleCategoryVo articleCategoryVo = new ArticleCategoryVo(
                    articleCategory.getId(),
                    articleCategory.getName(),
                    articleCategory.getIsDelete(),
                    articleCategory.getCreateDatetime(),
                    articleCategory.getUpdateDatetime()
            );
            return articleCategoryVo;
        }).collect(Collectors.toList());

        return articleCategoryVoList;

    }




}

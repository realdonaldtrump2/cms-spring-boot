package com.trump.cms.service;


import com.trump.cms.entity.ArticleCategory;
import com.trump.cms.repository.ArticleCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleCategoryService implements InterfaceArticleCategoryService {

    @Autowired
    ArticleCategoryRepository articleCategoryRepository;

    public List<ArticleCategory> all(){

        List<ArticleCategory> articleCategoryList = articleCategoryRepository.findAll();
        return articleCategoryList;

    }



}

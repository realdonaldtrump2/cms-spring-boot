package com.trump.cms.service;


import com.trump.cms.entity.Article;
import com.trump.cms.param.ArticleParam;
import org.springframework.data.domain.Page;


public interface InterfaceArticleService {

    Page<Article> page(Integer pageNum, Integer pageLimit, ArticleParam articleParam);


}

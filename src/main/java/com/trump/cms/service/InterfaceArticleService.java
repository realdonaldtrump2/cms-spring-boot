package com.trump.cms.service;


import com.trump.cms.entity.so.ArticleSo;
import com.trump.cms.entity.vo.ArticleVo;
import org.springframework.data.domain.Page;

public interface InterfaceArticleService {

    Page<ArticleVo> page(ArticleSo articleSo);

}

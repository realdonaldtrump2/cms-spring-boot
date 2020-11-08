package com.trump.cms.service;

import com.trump.cms.entity.ArticleTag;
import com.trump.cms.param.ArticleTagParam;
import org.springframework.data.domain.Page;

public interface InterfaceArticleTagService {


    Page<ArticleTag> getPage(Integer pageNum, Integer pageLimit, ArticleTagParam articleTagParam);


    ArticleTag create(ArticleTag articleTag);


}

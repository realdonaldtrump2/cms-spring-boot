package com.trump.cms.service;

import com.trump.cms.entity.po.ArticleTag;
import com.trump.cms.entity.fo.ArticleTagFo;
import com.trump.cms.entity.so.ArticleTagSo;
import com.trump.cms.entity.vo.ArticleTagVo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface InterfaceArticleTagService {

    Page<ArticleTagVo> page(ArticleTagSo articleTagSo);

    List<ArticleTagVo> all();

    ArticleTagVo find(Integer id);

    ArticleTagFo findFo(Integer id);

    ArticleTagVo create(ArticleTagFo articleTagFo);

    ArticleTagVo update(Integer id, ArticleTagFo articleTagFo);

    void delete(Integer id);

}

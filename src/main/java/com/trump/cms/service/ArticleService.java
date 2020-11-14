package com.trump.cms.service;

import com.trump.cms.entity.po.ArticleCategory;
import com.trump.cms.entity.po.ArticleDetail;
import com.trump.cms.entity.po.ArticleTag;
import com.trump.cms.entity.vo.ArticleCategoryVo;
import com.trump.cms.entity.vo.ArticleDetailVo;
import com.trump.cms.entity.vo.ArticleTagVo;
import com.trump.cms.repository.ArticleTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.Predicate;
import java.util.*;
import java.util.stream.Collectors;

import com.trump.cms.repository.ArticleRepository;
import com.trump.cms.entity.so.ArticleSo;
import com.trump.cms.entity.vo.ArticleVo;
import com.trump.cms.entity.po.Article;


@Service
public class ArticleService implements InterfaceArticleService {

    @Autowired
    ArticleRepository articleRepository;

    @Autowired
    ArticleTagRepository articleTagRepository;


    @Transactional(readOnly = true)  // 只读事务
    public Page<ArticleVo> page(ArticleSo articleSo) {

        System.out.println(articleSo);

        Sort sort = Sort.by(Sort.Direction.DESC, "createDatetime");
        Pageable pageable = PageRequest.of(articleSo.getPageNum(), articleSo.getPageSize(), sort);

        Specification<Article> articleSpecification = (Specification<Article>) (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicatesList = new ArrayList<>();
            if (!StringUtils.isEmpty(articleSo.getTitle())) {
                predicatesList.add(criteriaBuilder.like(root.get("title"), "%" + articleSo.getTitle() + "%"));
            }
            return criteriaBuilder.and(predicatesList.toArray(new Predicate[predicatesList.size()]));
        };

        Page<Article> articleTagPage = articleRepository.findAll(articleSpecification, pageable);
        List<Article> articleList = articleTagPage.getContent();
        List<ArticleVo> articleVoList = articleList.stream().map(article -> {

            ArticleCategory articleCategory = article.getArticleCategory();
            ArticleCategoryVo articleCategoryVo = new ArticleCategoryVo(
                    articleCategory.getId(),
                    articleCategory.getName(),
                    articleCategory.getIsDelete(),
                    articleCategory.getCreateDatetime(),
                    articleCategory.getUpdateDatetime()
            );

            List<ArticleTag> articleTagList = articleTagRepository.findByIdIn(article.getArticleTagId());
            List<ArticleTagVo> articleTagVoList = articleTagList.stream().map(articleTag -> {
                ArticleTagVo articleTagVo = new ArticleTagVo(
                        articleTag.getId(),
                        articleTag.getTitle(),
                        articleTag.getIsDelete(),
                        articleTag.getCreateDatetime(),
                        articleTag.getUpdateDatetime()
                );
                return articleTagVo;
            }).collect(Collectors.toList());

            System.out.println(articleTagList);

            ArticleVo articleVo = new ArticleVo(
                    article.getId(),
                    article.getTitle(),
                    article.getDescribe(),
                    article.getUserId(),
                    article.getArticleCategoryId(),
                    articleCategoryVo,
                    article.getArticleTagId(),
                    articleTagVoList,
                    article.getImageUrl(),
                    article.getFileUrl(),
                    article.getVideoUrl(),
                    article.getClickCount(),
                    article.getSort(),
                    article.getIsRecommend(),
                    article.getIsShow(),
                    article.getIsDelete(),
                    article.getCreateDatetime(),
                    article.getUpdateDatetime()
            );

            return articleVo;

        }).collect(Collectors.toList());
        return new PageImpl<>(articleVoList, pageable, articleTagPage.getTotalElements());

    }


    public ArticleVo find(Integer id) {

        Article article = articleRepository.findById(id).orElse(null);

        if (article == null) {
            return null;
        }

        ArticleCategory articleCategory = article.getArticleCategory();
        ArticleCategoryVo articleCategoryVo = new ArticleCategoryVo(
                articleCategory.getId(),
                articleCategory.getName(),
                articleCategory.getIsDelete(),
                articleCategory.getCreateDatetime(),
                articleCategory.getUpdateDatetime()
        );

        List<ArticleTag> articleTagList = articleTagRepository.findByIdIn(article.getArticleTagId());
        List<ArticleTagVo> articleTagVoList = articleTagList.stream().map(articleTag -> {
            ArticleTagVo articleTagVo = new ArticleTagVo(
                    articleTag.getId(),
                    articleTag.getTitle(),
                    articleTag.getIsDelete(),
                    articleTag.getCreateDatetime(),
                    articleTag.getUpdateDatetime()
            );
            return articleTagVo;
        }).collect(Collectors.toList());

        ArticleDetail articleDetail = article.getArticleDetail();
        ArticleDetailVo articleDetailVo = new ArticleDetailVo(
                articleDetail.getId(),
                articleDetail.getArticleId(),
                articleDetail.getDetail(),
                articleDetail.getDetailPhone(),
                articleDetail.getIsDelete(),
                articleDetail.getCreateDatetime(),
                articleDetail.getUpdateDatetime()
        );

        ArticleVo articleVo = new ArticleVo(
                article.getId(),
                article.getTitle(),
                article.getDescribe(),
                article.getUserId(),
                article.getArticleCategoryId(),
                articleCategoryVo,
                article.getArticleTagId(),
                articleTagVoList,
                article.getImageUrl(),
                article.getFileUrl(),
                article.getVideoUrl(),
                article.getClickCount(),
                article.getSort(),
                article.getIsRecommend(),
                article.getIsShow(),
                article.getIsDelete(),
                article.getCreateDatetime(),
                article.getUpdateDatetime()
        );
        articleVo.setArticleDetailVo(articleDetailVo);
        return articleVo;

    }


}

package com.trump.cms.service;

import com.trump.cms.entity.po.ArticleCategory;
import com.trump.cms.entity.vo.ArticleCategoryVo;
import com.trump.cms.entity.vo.ArticleVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.*;
import java.util.stream.Collectors;

import com.trump.cms.repository.ArticleTagRepository;
import com.trump.cms.entity.po.ArticleTag;
import com.trump.cms.entity.fo.ArticleTagFo;
import com.trump.cms.entity.so.ArticleTagSo;
import com.trump.cms.entity.vo.ArticleTagVo;


@Service
public class ArticleTagService implements InterfaceArticleTagService {

    @Autowired
    ArticleTagRepository articleTagRepository;

    @Transactional(readOnly = true)  // 只读事务
    public Page<ArticleTagVo> page(ArticleTagSo articleTagSo) {

        System.out.println(articleTagSo);

        Sort sort = Sort.by(Sort.Direction.DESC, "createDatetime");
        Pageable pageable = PageRequest.of(articleTagSo.getPageNum(), articleTagSo.getPageSize(), sort);

        Specification<ArticleTag> articleTagSpecification = (Specification<ArticleTag>) (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicatesList = new ArrayList<>();
            if (!StringUtils.isEmpty(articleTagSo.getTitle())) {
                predicatesList.add(criteriaBuilder.like(root.get("title"), "%" + articleTagSo.getTitle() + "%"));
            }
            return criteriaBuilder.and(predicatesList.toArray(new Predicate[predicatesList.size()]));
        };

        Page<ArticleTag> articleTagPage = articleTagRepository.findAll(articleTagSpecification, pageable);
        List<ArticleTag> articleTagList = articleTagPage.getContent();
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
        return new PageImpl<>(articleTagVoList, pageable, articleTagPage.getTotalElements());

    }

    public List<ArticleTagVo> all() {

        List<ArticleTag> articleTagList = articleTagRepository.findAll();

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

        return articleTagVoList;

    }

    public ArticleTagVo find(Integer id) {

        ArticleTag articleTag = articleTagRepository.findById(id).orElse(null);

        if (articleTag == null) {
            return null;
        }

        System.out.println(articleTag.toString());
        ArticleTagVo articleTagVo = new ArticleTagVo(
                articleTag.getId(),
                articleTag.getTitle(),
                articleTag.getIsDelete(),
                articleTag.getCreateDatetime(),
                articleTag.getUpdateDatetime()
        );

        return articleTagVo;

    }


    public ArticleTagFo findFo(Integer id) {

        ArticleTag articleTag = articleTagRepository.findById(id).orElse(null);

        if (articleTag == null) {
            return null;
        }

        System.out.println(articleTag.toString());
        ArticleTagFo articleTagFo = new ArticleTagFo(
                articleTag.getId(),
                articleTag.getTitle()
        );

        return articleTagFo;

    }


    @Transactional
    public ArticleTagVo create(ArticleTagFo articleTagFo) {

        ArticleTag articleTag = articleTagRepository.save(
                new ArticleTag(
                        articleTagFo.getTitle()
                )
        );

        ArticleTagVo articleTagVo = new ArticleTagVo(
                articleTag.getId(),
                articleTag.getTitle(),
                articleTag.getIsDelete(),
                articleTag.getCreateDatetime(),
                articleTag.getUpdateDatetime()
        );

        return articleTagVo;

    }


    @Transactional
    public ArticleTagVo update(Integer id, ArticleTagFo articleTagFo) throws RuntimeException {

        ArticleTag articleTag = articleTagRepository.findById(id).orElse(null);
        if (articleTag == null) {
            throw new RuntimeException("不存在");
        }

        articleTag.setTitle(articleTagFo.getTitle());

        ArticleTag articleTagResult = articleTagRepository.save(articleTag);

        ArticleTagVo articleTagVoResult = new ArticleTagVo(
                articleTagResult.getId(),
                articleTagResult.getTitle(),
                articleTagResult.getIsDelete(),
                articleTagResult.getCreateDatetime(),
                articleTagResult.getUpdateDatetime()
        );

        return articleTagVoResult;

    }


    @Transactional
    public void delete(Integer id) throws RuntimeException {

        ArticleTag articleTag = articleTagRepository.findById(id).orElse(null);
        if (articleTag == null) {
            throw new RuntimeException("不存在");
        }
        articleTagRepository.delete(articleTag);

    }

}

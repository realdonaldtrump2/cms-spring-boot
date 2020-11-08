package com.trump.cms.service;

import com.trump.cms.entity.ArticleTag;
import com.trump.cms.param.ArticleTagParam;
import com.trump.cms.repository.ArticleTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ArticleTagService implements InterfaceArticleTagService {

    @Autowired
    ArticleTagRepository articleTagRepository;

    @Transactional(readOnly = true)  // 只读事务
    public Page<ArticleTag> getPage(Integer pageNum, Integer pageLimit, ArticleTagParam articleTagParam) {

        System.out.println(articleTagParam);
        Pageable pageable = PageRequest.of(pageNum, pageLimit, Sort.by(Sort.Direction.DESC, "createDatetime"));
        return articleTagRepository.findAll((root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<Predicate>();

            if (!StringUtils.isEmpty(articleTagParam.getTitle())) {
                predicates.add(criteriaBuilder.like(root.get("title"), "%" + articleTagParam.getTitle() + "%"));
            }

            return criteriaQuery.where(predicates.toArray(new Predicate[predicates.size()])).getRestriction();
        }, pageable);

    }

    @Transactional
    public ArticleTag create(ArticleTag articleTag) {

        return articleTagRepository.save(
                new ArticleTag(
                        articleTag.getTitle()
                )
        );

    }


    @Transactional
    public ArticleTag update(ArticleTag articleTag2, ArticleTag articleTag) {

        articleTag2.setTitle(articleTag.getTitle());
        return articleTagRepository.save(articleTag2);

    }


    public ArticleTag find(Integer id) {

        return articleTagRepository.findById(id).orElse(null);

    }


    @Transactional
    public void delete(ArticleTag articleTag) {

        articleTagRepository.delete(articleTag);

    }

}

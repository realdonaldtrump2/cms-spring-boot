package com.trump.cms.service;

import com.trump.cms.entity.Article;
import com.trump.cms.param.ArticleParam;
import com.trump.cms.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;


@Service
public class ArticleService implements InterfaceArticleService {

    @Autowired
    ArticleRepository articleRepository;

    @Transactional(readOnly = true)  // 只读事务
    public Page<Article> page(Integer pageNum, Integer pageLimit, ArticleParam articleParam) {

        System.out.println(articleParam);
        Pageable pageable = PageRequest.of(pageNum, pageLimit, Sort.by(Sort.Direction.DESC, "createDatetime"));
        return articleRepository.findAll((root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<Predicate>();

            if (!StringUtils.isEmpty(articleParam.getTitle())) {
                predicates.add(criteriaBuilder.like(root.get("title"), "%" + articleParam.getTitle() + "%"));
            }

            return criteriaQuery.where(predicates.toArray(new Predicate[predicates.size()])).getRestriction();
        }, pageable);

    }


}

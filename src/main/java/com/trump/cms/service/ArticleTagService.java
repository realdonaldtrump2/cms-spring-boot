package com.trump.cms.service;


import com.trump.cms.entity.ArticleTag;
import com.trump.cms.repository.ArticleTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class ArticleTagService {

    @Autowired
    ArticleTagRepository articleTagRepository;

    @Transactional(readOnly = true)  // 只读事务
    public Page<ArticleTag> getPage(Integer pageNum, Integer pageLimit) {
        Pageable pageable = PageRequest.of(pageNum, pageLimit, Sort.by(Sort.Direction.DESC, "createDatetime"));
        return articleTagRepository.findAll(pageable);
    }

}

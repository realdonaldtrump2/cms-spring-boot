package com.trump.cms.repository;


import com.trump.cms.entity.po.ArticleTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;


public interface ArticleTagRepository extends JpaRepository<ArticleTag, Integer>, JpaSpecificationExecutor<ArticleTag> {

    List<ArticleTag> findByIdIn(Integer[] integerArray);

}

package com.trump.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.trump.cms.entity.po.ArticleCategory;

public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Integer>, JpaSpecificationExecutor<ArticleCategory> {


}

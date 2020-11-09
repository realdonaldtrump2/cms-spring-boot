package com.trump.cms.repository;

import com.trump.cms.entity.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Integer>, JpaSpecificationExecutor<ArticleCategory> {
    
    
}

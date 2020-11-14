package com.trump.cms.repository;


import com.trump.cms.entity.po.ArticleTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface ArticleTagRepository extends JpaRepository<ArticleTag, Integer>, JpaSpecificationExecutor<ArticleTag> {


}

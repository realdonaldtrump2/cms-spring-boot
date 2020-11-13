package com.trump.cms.repository;

import com.trump.cms.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ArticleRepository extends JpaRepository<Article, Integer>, JpaSpecificationExecutor<Article> {

    public List<Article> findByTitle(String title);

    public List<Article> findByTitleLike(String title);

    @Query("select a from Article a where a.title like '%题%'")
    public List<Article> fineByTitleLike2();

    @Query("select a from Article a where a.title = ?1")
    public List<Article> fineByTitleLike3(String title);

    @Query("select a from Article a where a.title like %:title%")
    public List<Article> fineByTitleLike4(@Param("title") String title);

    @Query(nativeQuery = true, value = "select count(*) from article")
    public long getTotalCount();

}

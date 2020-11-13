package com.trump.cms;

import com.trump.cms.entity.Article;
import com.trump.cms.entity.ArticleTag;
import com.trump.cms.entity.User;
import com.trump.cms.repository.ArticleRepository;
import com.trump.cms.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@SpringBootTest(classes = {CmsApplication.class})
@RunWith(SpringJUnit4ClassRunner.class)
@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
class CmsApplicationTests {

    @Autowired
    ArticleRepository articleRepository;

    @Test
    void contextLoads() {

//        Article article = articleRepository.findByTitle("标题");
//        System.out.println(article);
//
//        Article article2 = articleRepository.findByTitleLike("%标%");
//        System.out.println(article2);
//
//        Article article3 = articleRepository.fineByTitleLike3();
//        System.out.println(article3);

//        Article article4 = articleRepository.fineByTitleLike3("标题");
//        System.out.println(article4);

//        List<Article> articleList5 = articleRepository.fineByTitleLike4("题");
//        System.out.println(articleList5);

        long count = articleRepository.getTotalCount();
        System.out.println(count);

    }

}

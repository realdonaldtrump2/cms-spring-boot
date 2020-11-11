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


@SpringBootTest(classes={CmsApplication.class})
@RunWith(SpringJUnit4ClassRunner.class)
@Transactional(readOnly = false,propagation = Propagation.REQUIRED)
class CmsApplicationTests {


    @Test
    void contextLoads() {


    }

}

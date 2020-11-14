package com.trump.cms;


import com.trump.cms.service.ArticleTagService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.trump.cms.entity.po.ArticleTag;
import com.trump.cms.entity.fo.ArticleTagFo;
import com.trump.cms.entity.so.ArticleTagSo;
import com.trump.cms.entity.vo.ArticleTagVo;

@SpringBootTest(classes = {CmsApplication.class})
@RunWith(SpringJUnit4ClassRunner.class)
@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
class CmsApplicationTests {

    @Autowired
    ArticleTagService articleTagService;

    @Test
    void contextLoads() {

    }

}

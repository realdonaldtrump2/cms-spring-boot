package com.trump.cms;

import com.trump.cms.entity.User;
import com.trump.cms.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
class CmsApplicationTests {

    @Autowired
    UserService userService;

    @Test
    void contextLoads() {

        User user = userService.findById(333);
        System.out.println(user);

    }

}

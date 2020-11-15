package com.trump.cms;


import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@SpringBootTest(classes = {CmsApplication.class})
@RunWith(SpringJUnit4ClassRunner.class)
class CmsApplicationTests {


    @Test
    void contextLoads() {

//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        List<GrantedAuthority> updatedAuthorities = new ArrayList<>(auth.getAuthorities());
//        updatedAuthorities.remove("ADMIN"); //add your role here [e.g., new SimpleGrantedAuthority("ROLE_NEW_ROLE")]
//        Authentication newAuth = new UsernamePasswordAuthenticationToken(auth.getPrincipal(), auth.getCredentials(), updatedAuthorities);
//        SecurityContextHolder.getContext().setAuthentication(newAuth);

    }

}

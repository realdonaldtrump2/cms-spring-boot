package com.trump.cms.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;


/**
 * @author Administrator
 */
@Configuration
@EnableWebSecurity
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {



    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/css/**", "/sign", "/druid/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        // 配置拦截规则
        http.authorizeRequests()
                .antMatchers("/", "/druid/*").permitAll()
                .antMatchers("/toVip/1").hasRole("vip1")
                .antMatchers("/toVip/2").hasRole("vip2")
                .antMatchers("/toVip/3").hasRole("vip3");

        // 配置登录功能
        http.formLogin()
                .usernameParameter("username")
                .passwordParameter("password")
                .loginPage("/toLoginPage")
                .loginProcessingUrl("/login");

        // 开启登出，以及登出成功后请求的路径
        http.logout().logoutSuccessUrl("/");

        // 开启记住我，设置记住我的name（需要设置，才能记住我，默认是14天）
        http.rememberMe().rememberMeParameter("rememberMe");

    }






}

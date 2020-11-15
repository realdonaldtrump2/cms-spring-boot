package com.trump.cms.config;

import com.trump.cms.filter.MyFilter;
import com.trump.cms.listener.MyListener;
import com.trump.cms.service.CustomUserService;
import com.trump.cms.servlet.MyServlet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;


/**
 * @author Administrator
 */
@Configuration
@EnableWebSecurity
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CustomUserService customUserService() {
        return new CustomUserService();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();   // 使用 BCrypt 加密
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(customUserService());
        authenticationProvider.setPasswordEncoder(passwordEncoder); // 设置密码加密方式
        return authenticationProvider;
    }

    /**
     * 自定义配置
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {

        // 禁止隧道 // 禁止跨域 // 禁止头部
        http.csrf().disable().cors().disable().headers().disable();

        http.authorizeRequests()
                // 所有的人都可以访问的路径
                .antMatchers("/css/**", "/js/**", "/vendor/**", "/img/**", "/login", "/open", "/druid/**").permitAll()
                .antMatchers("/**").hasRole("ADMIN") // 需要相应的角色才能访问
                .and()
                .formLogin()
                .loginPage("/login")
                .failureUrl("/login?error=true")
                .loginProcessingUrl("/login")
                .usernameParameter("username")
                .passwordParameter("password")
                .and().rememberMe().rememberMeParameter("rememberMe") // 启用 remember me
                .and().exceptionHandling().accessDeniedPage("/login");  // 处理异常，拒绝访问就重定向到 403 页面

        http
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login");

    }

    /**
     * 认证信息管理
     */
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(customUserService());
        auth.authenticationProvider(authenticationProvider());
    }


//    /**
//     * 认证
//     */
//    @Override
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//
//        /*
//          说明：
//            1.这里采用的的是把用户角色保存在内存中，数据是写死的，当然数据可以从数据库中查出再写入内存中；
//            2.随后定义的三个用户，没有用户定义了其用户名，密码和角色
//            3.Security5默认要求密码使用加密，不加密的话就使用"{noop}123456"这样的写法，
//            加密的话需要使用PasswordEncoder的实现类进行加密
//            4.项目启动 账户-密码-角色 信息保存进内存中
//         */
//        auth.inMemoryAuthentication()
//                .withUser("zhangsan").password("{noop}123456").roles("VIP1")
//                .and().withUser("lisi").password("{noop}123456").roles("VIP1, VIP2")
//                .and().withUser("wangwu").password("{noop}123456").roles("VIP1", "VIP2", "VIP3")
//                .and().withUser("google").roles("admin").password("$2a$10$OR3VSksVAmCzc.7WeaRPR.t0wyCsIj24k0Bne8iKWV1o.V9wsP8Xe")
//                .and().withUser("intel").roles("user").password("$2a$10$p1H8iWa8I4.CA.7Z8bwLjes91ZpY.rYREGHQEInNtAp4NzL6PLKxi");
//
//    }
//
//
//    /**
//     * 授权
//     */
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//
//        // 禁止隧道 // 禁止跨域 // 禁止头部
//        http.csrf().disable().cors().disable().headers().disable();
//
//        //开启登录配置
//        http.authorizeRequests()
//                // 所有的人都可以访问的路径
//                .antMatchers("/css/**", "/js/**", "/vendor/**", "/img/**", "/login", "/open", "/druid/**").permitAll()
//                // 表示访问 /hello 这个接口，需要具备 admin 这个角色
//                //.antMatchers("/hello").hasRole("admin")
//                // 表示剩余的其他接口，登录之后就能访问
//                // VIP1的用户可以访问level1下的所有路径
//                .antMatchers("/**").hasRole("VIP1")
//                .antMatchers("/level1/**").hasRole("VIP1")
//                // VIP2的用户可以访问level2下的所有路径
//                .antMatchers("/level2/**").hasRole("VIP2")
//                // VIP3的用户可以访问level3下所有的路径
//                .antMatchers("/level3/**").hasRole("VIP3");
//
//        /*
//         开启自动配置的登录功能，如果没有登录就会来到登录页面
//            1. 会自动生成登录页面 /login
//            2. 登录失败会自动重定向到 /login?error
//         */
//        /*
//        自定义登录页面设置
//            1. 登录的路径还是设置成/login，否则算是自定义登录路径，其他的设置也需要改变
//                /login（get）：到登录页，， 自定义的话就是 /authenticate（get）
//                /login（post）：登录检查，，自定义的话就是 /authenticate（post）
//            2. 可以自定义form表达提交的参数名称
//                默认username字段提交用户名，可以通过usernameParameter自定义
//                默认password字段提交密码，可以用过passwordParameter自定义
//            3. loginProcessingUrl("/xxx") 可以自定义登录成功后跳转的路径
//        */
//
//        http
//                .formLogin()
//                // 定义登录页面，未登录时，访问一个需要登录之后才能访问的接口，会自动跳转到该页面
//                .loginPage("/login")
//                //登录处理接口
//                .loginProcessingUrl("/login")
//                .usernameParameter("username")
//                .passwordParameter("password");
//        //登录成功的处理器
////                .successHandler(new AuthenticationSuccessHandler() {
////                    @Override
////                    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication authentication) throws IOException, ServletException {
////                        System.out.println("登录成功");
////                    }
////                })
////                //登录失败的处理器
////                .failureHandler(new AuthenticationFailureHandler() {
////                    @Override
////                    public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse resp, AuthenticationException exception) throws IOException, ServletException {
////                        System.out.println("登录失败");
////                    }
////                });
//
//        /*
//        开启自动配置的记住我功能
//            1.登录成功后，将cookie发送给浏览器保存，以后登录带上这个cookie，只要通过检查就可以免登录
//            2.点击注销之后会删除cookie
//            3.rememberMe功能跟前端约定的表单提交名称是remember-me,可以通过rememberMeParameter自定义
//         */
//        http
//                .rememberMe()
//                .rememberMeParameter("rememberMe");
//
//        /*
//         开启自动配置的退出功能：
//            1. 访问/logout请求，用户注销，清楚session
//            2. 注销成功后重定向到 login?logout，，可以通过logoutSuccessUrl("/")自定义
//         */
//        http
//                .logout()
//                .logoutUrl("/logout")
//                .logoutSuccessUrl("/login");
//        //退出登录的处理器
////                .logoutSuccessHandler(new LogoutSuccessHandler() {
////                    @Override
////                    public void onLogoutSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication authentication) throws IOException, ServletException {
////                    }
////                })
//
//    }


    // 注册servlet
    @Bean
    public ServletRegistrationBean myServlet() {
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(new MyServlet(), "/my-servlet");
        registrationBean.setLoadOnStartup(1);
        return registrationBean;
    }

    // 注册过滤器
    @Bean
    public FilterRegistrationBean myFilter() {
        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        registrationBean.setFilter(new MyFilter());
        registrationBean.setUrlPatterns(Arrays.asList("/my-servlet"));
        return registrationBean;
    }

    // 注册监听器
    @Bean
    public ServletListenerRegistrationBean myListener() {
        ServletListenerRegistrationBean<MyListener> registrationBean = new ServletListenerRegistrationBean<>(new MyListener());
        return registrationBean;
    }


}

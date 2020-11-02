package com.trump.cms.service;

import com.trump.cms.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.trump.cms.repository.UserRepository;


@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User findById(Integer id) {

        User user = userRepository.findById(id).orElse(null);
        return user;

    }


}

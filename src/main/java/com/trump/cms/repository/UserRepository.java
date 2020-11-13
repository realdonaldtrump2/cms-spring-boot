package com.trump.cms.repository;


import com.trump.cms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User,Integer> {


}

package com.powercatsui.powercatsui.repositories;

import com.powercatsui.powercatsui.models.EPermission;
import com.powercatsui.powercatsui.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    List<User> findByPermissionAndActiveTrue(EPermission permission);


    Page<User> findAllByActiveTrue(Pageable pagination);

        User findByEmail(String email);


    User findUsersById(Integer id);
}
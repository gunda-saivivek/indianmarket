package com.marketsniper.repositories;

import com.marketsniper.entities.User;
import com.marketsniper.entities.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    List<User> findByStatus(UserStatus status);

    List<User> findAllByOrderByCreatedAtDesc();
}

package me.gaga.employeehubapi.repository;

import me.gaga.employeehubapi.entity.RewardRedemption;
import me.gaga.employeehubapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRedemptionRepository extends JpaRepository<RewardRedemption, Long> {
    
    List<RewardRedemption> findByUser(User user);
    
    List<RewardRedemption> findByUserAndStatus(User user, String status);
}

package me.gaga.employeehubapi.repository;

import me.gaga.employeehubapi.entity.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    
    List<Reward> findByIsActiveTrue();
    
    List<Reward> findByKudosCostLessThanEqual(Integer kudos);
}

package me.gaga.employeehubapi.repository;

import me.gaga.employeehubapi.entity.Kudos;
import me.gaga.employeehubapi.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface KudosRepository extends JpaRepository<Kudos, Long> {
    
    Page<Kudos> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    List<Kudos> findBySender(User sender);
    
    List<Kudos> findByReceiver(User receiver);
    
    @Query("SELECT k FROM Kudos k WHERE k.sender = ?1 AND k.createdAt >= ?2")
    List<Kudos> findBySenderAndCreatedAtAfter(User sender, LocalDateTime date);
}

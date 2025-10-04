package me.gaga.employeehubapi.repository;

import me.gaga.employeehubapi.entity.Project;
import me.gaga.employeehubapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByOwner(User owner);
    
    List<Project> findByMembersContaining(User member);
}

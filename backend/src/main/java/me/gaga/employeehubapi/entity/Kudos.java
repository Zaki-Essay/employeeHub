package me.gaga.employeehubapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "kudos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Kudos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private Integer amount;

    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private Boolean isStreakBonus;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isStreakBonus == null) {
            isStreakBonus = false;
        }
    }
}

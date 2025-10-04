package me.gaga.employeehubapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reward_redemptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardRedemption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "reward_id", nullable = false)
    private Reward reward;

    @Column(nullable = false)
    private Integer kudosCost;

    @Column(nullable = false)
    private LocalDateTime redeemedAt;

    private String status;

    @PrePersist
    protected void onCreate() {
        redeemedAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }
}

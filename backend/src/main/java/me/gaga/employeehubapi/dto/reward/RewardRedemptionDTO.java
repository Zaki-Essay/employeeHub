package me.gaga.employeehubapi.dto.reward;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.gaga.employeehubapi.dto.user.UserDTO;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RewardRedemptionDTO {

    private Long id;
    private UserDTO user;
    private RewardDTO reward;
    private Integer kudosCost;
    private LocalDateTime redeemedAt;
    private String status;
}

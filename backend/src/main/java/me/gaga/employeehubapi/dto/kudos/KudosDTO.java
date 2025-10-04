package me.gaga.employeehubapi.dto.kudos;

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
public class KudosDTO {

    private Long id;
    private UserDTO sender;
    private UserDTO receiver;
    private Integer amount;
    private String message;
    private LocalDateTime createdAt;
    private Boolean isStreakBonus;
}

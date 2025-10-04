package me.gaga.employeehubapi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.gaga.employeehubapi.entity.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String avatarUrl;
    private Integer kudosBalance;
    private Integer kudosReceived;
    private Integer streakCount;
}

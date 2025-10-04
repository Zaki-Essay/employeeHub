package me.gaga.employeehubapi.dto.reward;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RewardDTO {

    private Long id;
    private String name;
    private String description;
    private Integer kudosCost;
    private String imageUrl;
    private Boolean isActive;
}

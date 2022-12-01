package net.csibio.injection.client.domain.vo.user;

import lombok.Data;

import java.io.Serializable;

@Data
public class LoginVO implements Serializable {
    private String id;
    private String username;
    private String password;
    private Boolean autoLogin;
    private Integer accountType;
    private String roleName;
    private String realName;
    private Integer accountStatus;
    private String relationId;
}

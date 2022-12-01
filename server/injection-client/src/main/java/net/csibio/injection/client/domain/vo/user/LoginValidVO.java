package net.csibio.injection.client.domain.vo.user;

import lombok.Data;

@Data
public class LoginValidVO {
    private String username;
    private String password;
    private Boolean autoLogin;
    private  Boolean signFlag;

}

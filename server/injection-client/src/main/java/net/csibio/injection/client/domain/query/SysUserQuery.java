package net.csibio.injection.client.domain.query;

import lombok.Data;
import net.csibio.injection.client.constants.enums.AccountTypeConstants;

@Data
public class SysUserQuery extends PageQuery  {

    String id;

    String userName;

    String passwd;

    Integer accountType = AccountTypeConstants.USER.getCode();
}


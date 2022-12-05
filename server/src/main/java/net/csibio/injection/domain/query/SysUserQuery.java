package net.csibio.injection.domain.query;

import lombok.Data;
import net.csibio.injection.constants.enums.AccountTypeConstants;

@Data
public class SysUserQuery extends PageQuery  {

    String id;

    String userName;

    String passwd;

    Integer accountType = AccountTypeConstants.USER.getCode();
}


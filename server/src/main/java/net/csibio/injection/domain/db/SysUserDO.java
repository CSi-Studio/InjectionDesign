package net.csibio.injection.domain.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.csibio.injection.constants.enums.AccountTypeConstants;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Data
@Document(collection = "sysUser")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SysUserDO implements Serializable {

    @Id
    String id;

    @Indexed(unique = true)
    String userName;

    String passwd;

    Integer accountType = AccountTypeConstants.USER.getCode();

}

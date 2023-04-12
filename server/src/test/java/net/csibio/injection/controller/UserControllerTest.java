package net.csibio.injection.controller;

import lombok.extern.slf4j.Slf4j;
import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.SysUserDO;
import net.csibio.injection.domain.vo.user.LoginVO;
import net.csibio.injection.service.ISysUserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import static org.mockito.ArgumentMatchers.any;


@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private ISysUserService sysUserService;

    @Test
    public void register() {
        Mockito.when(sysUserService.insert((SysUserDO) any())).thenReturn(Result.OK());
        Result update = userController.register(new LoginVO());
        Assert.isTrue(update.isSuccess(), "UPDATE ERROR");
    }

    @Test
    public void getUserInfo() {
        Mockito.when(sysUserService.getById(any())).thenReturn(new SysUserDO());
        Result update = userController.getUserInfo("userId");
        Assert.isTrue(update.isSuccess(), "UPDATE ERROR");
    }
}

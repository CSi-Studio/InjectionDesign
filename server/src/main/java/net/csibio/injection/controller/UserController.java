package net.csibio.injection.controller;

import net.csibio.injection.domain.Result;
import net.csibio.injection.domain.db.SysUserDO;
import net.csibio.injection.domain.query.SysUserQuery;
import net.csibio.injection.domain.vo.user.LoginVO;
import net.csibio.injection.domain.vo.user.LoginValidVO;
import net.csibio.injection.domain.vo.user.UserInfoVO;
import net.csibio.injection.exceptions.XException;
import net.csibio.injection.service.BaseService;
import net.csibio.injection.service.ISysUserService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.UnknownHostException;
import java.util.List;

@RestController
@RequestMapping("/login")
public class UserController extends BaseController<SysUserDO, SysUserQuery> {


    @Autowired
    private ISysUserService sysUserService;

    @Override
    BaseService<SysUserDO, SysUserQuery> getBaseService() {
        return sysUserService;
    }

    /**
     * 账户登录
     *
     * @param loginValidVO
     * @param request
     * @return
     * @throws XException
     * @throws UnknownHostException
     */
    @PostMapping(value = "/account")
    Result<?> login(LoginValidVO loginValidVO, HttpServletRequest request) throws XException, UnknownHostException {
        LoginVO loginVO = new LoginVO();
        BeanUtils.copyProperties(loginValidVO, loginVO);
        return loginAccount(loginVO, request);
    }

    /**
     * 账户注册
     */
    @PostMapping(value = "/register")
    Result<?> register(@RequestBody LoginVO loginVO) {
        SysUserDO sysUserDO = new SysUserDO();
        sysUserDO.setUserName(loginVO.getUsername());
        sysUserDO.setPasswd(loginVO.getPassword());
        return sysUserService.insert(sysUserDO);
    }


    /**
     * 用户信息
     */
    @GetMapping(value = "/user/info")
    Result<?> getUserInfo(@RequestParam(value = "id", required = true) String userId) {
        SysUserDO sysUserDO = sysUserService.getById(userId);
        UserInfoVO userInfoVO = new UserInfoVO();
        userInfoVO.setName(sysUserDO.getUserName());
        return Result.OK(userInfoVO);
    }

    private Result loginAccount(LoginVO loginVO, HttpServletRequest request) throws XException, UnknownHostException {
        // 从db中查询, 若查询到则返回用户信息
        SysUserQuery query = new SysUserQuery();
        query.setUserName(loginVO.getUsername());
        query.setPasswd(loginVO.getPassword());
        List<SysUserDO> userDOList = sysUserService.getAll(query);
        // 若查询不到，则返回用户不存在
        if (CollectionUtils.isEmpty(userDOList)) {
            return Result.Error("Username/Passwd is incorrect");
        }
        return Result.OK(userDOList.get(0));
    }


}

import Footer from '@/components/Footer';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {FormattedMessage, history, SelectLang, useIntl, useModel} from '@umijs/max';
import {Alert, message, Tabs} from 'antd';
import React, {useState} from 'react';
import styles from './index.less';
import {login} from "@/services/ant-design-pro/api";
import {UserRegister, StateType} from "@/pages/user/register/service";
import {Store} from "antd/es/form/interface";
import token from "@/utils/token";

import {useRequest} from 'umi';
import request from 'umi-request';

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  // @ts-ignore
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    console.log("userInfo", userInfo)
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  //@ts-ignore
  const {loading: submitting, run: register} = useRequest<{ data: StateType }>(UserRegister, {
    manual: true,
    onSuccess: (data: { status: string; }) => {
      if (data.status === 'ok') {
        message.success('register success！');
        history.push({
          pathname: '/user/login',
        });
      }
    },
  });
  const onFinish = (values: Store) => {
    console.log(values)
    register(values);
  };


  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      values.username = values.username?.trim();
      values.autoLogin = true;
      // @ts-ignore
      const msg: { data?: any; success?: boolean; errorMessage?: string } = await login({
        ...values,
      });

      if (msg.success) {
        console.log(msg)
        token.save(msg.data.id);
        request.interceptors.request.use((urlItem: any, options: any) => {
          const authHeader = {
            'X-Access-Token': `${msg.data.token}`,
          };
          return {
            url: urlItem,
            options: {...options, interceptors: true, headers: authHeader},
          };
        });

        setInitialState((s) => ({
          ...s,
          currentUser: {name:msg.data?.userName},
        }));
        console.log("setInitialState", initialState)
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！欢迎进入实验室进样系统',
        });
        message.success(defaultLoginSuccessMessage);
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        window.location.reload();
        return;
      }
      console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState({type: 'account', status: 'error'});
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      setUserLoginState({type: 'account', status: 'error'});
      message.error(defaultLoginFailureMessage);
    }
  };
  // @ts-ignore
  const {status, type: loginType} = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang/>}
      </div>
      <div className={styles.content}>

        <LoginForm
          logo={<img alt="logo" src="/injection.svg" style={{marginTop: '7px'}}/>}
          title={intl.formatMessage({id: 'pages.layouts.system.title'})}
          subTitle={intl.formatMessage({id: 'pages.layouts.userLayout.title'})}
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: {
              submitText: `${type === 'account' ? "login" : "register"}`,
            },
            submitButtonProps: {
              style: {
                width: '100%'
              }
            },
            resetButtonProps: false
          }}

          onFinish={async (values) => {
            if (type === 'register') {
              console.log("register", values)
              onFinish(values)

            } else {
              await handleSubmit(values as API.LoginParams);
            }
          }}
        >
          <Tabs activeKey={type} onChange={setType} centered>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
          </Tabs>
          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/admin)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: guest',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: guest',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>
                </ProFormCheckbox>
                <a
                  onClick={() => {
                    history.push("/user/register")
                    // message.warn("please contact admin")
                  }}
                  style={{
                    float: 'right',
                  }}
                >
                  <FormattedMessage id="pages.login.registerAccount" defaultMessage="忘记密码"/>
                </a>

              </div>
            </>
          )}

          {status === 'error' && loginType === 'register' && <LoginMessage content="验证码错误"/>}
          {/*{type === 'register' && (*/}
          {/*    <Register />*/}
          {/*)}*/}

        </LoginForm>
      </div>

      <Footer/>
    </div>
  );
};

export default Login;

import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type {RequestConfig} from '@@/plugin-request/request';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {history} from '@umijs/max';
import qs from 'qs';
import defaultSettings from '../config/defaultSettings';
import {message} from "antd";
import {currentUser} from "@/services/ant-design-pro/login";
import token from '@/utils/token';

// const isDev = process.env.NODE_ENV === 'development';
const tokenStr = token.get();
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  loading?: boolean;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async ()=> {
    try {
      // 获取用户信息
      const msg = await currentUser({id: tokenStr})
      return msg.data
    } catch (error) {
      history.push(loginPath)
    }
    return undefined;
  }

  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
  return {
    rightContentRender: () => <RightContent/>,
    disableContentMargin: false,
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const { location } = history;
      console.log(initialState?.currentUser)
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
        </>
      );
    },
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  errorConfig: {
    errorThrower: (resData: any) => {
      if (!resData.success){
        throw {
          ...resData,
          data: resData.data,
          total: resData.total,
          success: resData.success,
          errorCode: resData.msgCode,
          errorMessage: resData.msgInfo,
        }
      }
    }
  },

  // 请求拦截器
  requestInterceptors: [
    (config: any) => {
      const authHeader = { 'X-Access-Token': `${tokenStr}` };
      config.paramsSerializer = function (params: any) {
        return qs.stringify(params, {indices: false})
      }
      // 拦截请求配置，进行个性化处理。
      // const url = config.url;

      return {...config, headers: authHeader,interceptors: true,skipErrorHandler: true};
    }
  ],

  responseInterceptors:[
    (response: any) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      if(!data.success){
        message.error(data.msgInfo);
      }
      return response;
    }
  ],

};

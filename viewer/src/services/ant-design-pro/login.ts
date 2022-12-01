// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import {url} from "@/utils/request";

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: Record<string, any>) {
  return request<{
    data: API.CurrentUser;
  }>(`${url}/login/user/info`, {
    method: 'GET',
    params: {...options}
  });
}

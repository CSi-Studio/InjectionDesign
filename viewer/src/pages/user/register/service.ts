import { request } from 'umi';
import {url} from "@/utils/request";

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface UserRegisterParams {
  mail: string;
  password: string;
  username: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
}

export async function UserRegister(params: { username: string; passwd: string;}) {
  return request(`${url}/login/register`, {
    method: 'post',
    data: params,
  });
}

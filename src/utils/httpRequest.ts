import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { refreshToken } from './api';
import { activateState } from '@/pages/activateToken/activateToken';

let baseUrl = 'http://120.24.28.65:8000';
export function httpRequest({ method, url, headers, success, ...other }: AxiosRequestConfig & { success?: (res: AxiosResponse<any>) => void }) {
  return new Promise((resolve: (res: any) => void, reject: (res: any) => void) => {
    axios({
      method: method ? method : 'POST', // 默认都是post请求
      url: baseUrl + url,
      ...other,
      headers: {
        ...headers,
      },
    }).then((response: AxiosResponse<any>) => {
      const { status, data } = response;
      switch (status) {
        case 200:
          if (data?.code && data.emsg) {
            reject(data);
          } else {
            if (success) {
              resolve(success(response));
            } else {
              resolve(data);
            }
          }
          break;
        case 401:
          break;
        default:
          reject(data);
          break;
      }
    }).catch((error: any) => {
      console.log(error);
      if (!error.response) {
        return;
      } else {
        const { code, message } = error.response.data.detail;
        console.log(code);
        // router.replace('/');
        //TODO: 拦截错误
        if (code == 1006) {
          // 令牌验证失败
          refreshToken();
        }
        if (code == 1014) {
          // 无效凭证,跳转注册
          activateState.isTip = true;
        }
        reject(error);
      }
    });
  });
}
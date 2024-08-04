import { httpRequest } from "./httpRequest";

let token;
export function getloginToken() {
  httpRequest({
    url: '/api/login/token',
    data: {
      username: 'admin',
      password: 'admin',
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(res => {
    console.log('getloginToken', res);
    if (res.access_token) {
      token = res.access_token;
    }
  })
}

export function login(params: { t: any, k: string }) {
  httpRequest({
    url: '/api/login/token/tk',
    data: {
      t: params.t,
      k: params.k,
    },
  }).then(res => {
    console.log('getloginToken', res);
    if (res.access_token) {
      token = res.access_token;
    }
  })
}

export function refreshToken() {
  httpRequest({
    headers: {
      "Authorization": 'Bearer ' + token
    },
    url: '/api/refresh/token/mac_address'
  }).then(res => {
    console.log('refreshToken', res);
    if (res.access_token) {
      token = res.access_token;
    }
  })
}

export function registertoken(key) {
  // httpRequest({
  //   url: '/api/login/token/mac_addres',
  //   data: {
  //     mac_addresst: key,
  //   },
  // }).then(res => {
  //   console.log('register', res);
  //   if (res.access_token) {
  //     token = res.access_token;
  //   }
  // })
}
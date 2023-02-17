const { endpointHelper, dataStoreHelper } = require('keywordflow-wdio-js-lib');
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support');
const tough = require('tough-cookie');

const login = async (user) => {
  const authInfo = {};

  const username = user.login;
  const password = user.password;

  // implement authentication flow here:
  // get Bearer token for Authorization Header
  let authorizationHeader;
  // or
  // get cookie for Cookie Header
  let cookieHeader;
  // or 
  // get cookie jar;
  axiosCookieJarSupport.wrapper(axios);
  const cookieJar = new tough.CookieJar();

  authInfo.headers = new Map();
  if (authorizationHeader) {
    authInfo.headers.set('Authorization', authorizationHeader);
  }

  if (cookieHeader) {
    authInfo.headers.set('Cookie', cookieHeader);
  }

  if (cookieJar) {
    authInfo.headers.set('Accept-Encoding', 'gzip, deflate, br');
    authInfo.headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9');
    authInfo.cookieJar = {
      jar: cookieJar,
      gzip: true
    };
  }

  dataStoreHelper.setData('authInfo', authInfo);
  
  const loginUrl = `{YOUR_LOGIN_URL}?user=${username}&pass=${password}`;
  await endpointHelper.sendRequest('POST', loginUrl, authInfo.headers);

  return authInfo;
};



module.exports = {
  login
};
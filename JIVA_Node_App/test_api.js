const http = require('http');

const loginData = JSON.stringify({
  email: 'test@jiva.com',
  password: 'password123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const reqLogin = http.request(loginOptions, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Login Response Code:', res.statusCode);
    console.log('Login Response:', body);
    
    if (res.statusCode === 200) {
      const { token } = JSON.parse(body);
      
      const resultsOptions = {
        hostname: 'localhost',
        port: 5001,
        path: '/api/test-results',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const reqResults = http.request(resultsOptions, (resRes) => {
        let resBody = '';
        resRes.on('data', (chunk) => resBody += chunk);
        resRes.on('end', () => {
          console.log('\nTest Results Response Code:', resRes.statusCode);
          console.log('Test Results Response:', resBody);
        });
      });
      
      reqResults.on('error', (e) => console.error('Results Request Error:', e));
      reqResults.end();
    }
  });
});

reqLogin.on('error', (e) => console.error('Login Request Error:', e));
reqLogin.write(loginData);
reqLogin.end();

/**
 * This file is represented urls and users information.
 * PROJECT_NAME should be changed with appropriate project name.
 * PROJECT_NAME constructions can be as much as needed.
 *
 * urls are used in {landing-url} custom parameter type.
 * users are used in {user} custom parameter type.
 * Used for library tests
 *
 * @example
 * User navigates to "PAGE_NAME"
 * User login
 */


module.exports = {
  urls: {
    AppILead: {
      LOCAL: 'https://app.ilead.io/',
      AWS: 'https://app.ilead.io/',
      QA: 'https://app.ilead.io/'
    },
    ExcerTracker: {
      LOCAL: 'http://localhost:3000/'
    },
    Isaac_Newton: {
      LOCAL: 'Isaac_Newton'
    },
    ILead: {
      LOCAL: 'https://ilead.io/',
      AWS: 'https://ilead.io/',
      QA: 'https://ilead.io/'
    },
    WIKI: {
      LOCAL: 'https://www.wikipedia.org/',
    },
    BASE_API_URL: {
      LOCAL: 'https://postman-echo.com'
    },
    MOCK_SERVICE: {
      LOCAL: 'http://localhost:3036/api/scenario/'
    }
  },
  users: {
    ADMIN: {
      login: 'admin_login',
      password: 'admin_password'
    },
    USER: {
      login: 'user_login',
      password: 'user_password'
    }
  }
};

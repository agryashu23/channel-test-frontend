let csrfToken = "test-token";

export const setCsrfToken = (token) => {
  csrfToken = token;
};

export const getCsrfToken = () => csrfToken;

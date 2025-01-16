export type AuthInfo = {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

export interface NitradoUserDetails {
  user_id: string;
  email: string;
  country: string;
}

export interface NitradoUser {
  username: string;
  nitrado?: NitradoUserDetails | null;
}

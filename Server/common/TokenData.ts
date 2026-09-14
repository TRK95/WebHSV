export type RoleCredential = {
  itemId: string | null, mapActions: { [funcId: number]: number[] }
}

export type TokenData = {
  _id: string;
  roles: Array<RoleCredential>;
  iat?: number;
  exp?: number;
  from?: number;
}

export type VerifyEmailTokenData = {
  _id: string;
  email: string;
  url: string;
  iat?: number;
  exp?: number;
}

export type ForgotPasswordTokenData = {
  userId: string;
  account: string;
}
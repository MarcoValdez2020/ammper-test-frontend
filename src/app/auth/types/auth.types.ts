export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserCreateDTO {
  email: string;
  password: string;
}

export interface TokenDTO {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
}

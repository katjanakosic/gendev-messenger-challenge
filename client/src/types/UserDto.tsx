export enum UserTypeEnum {
  CUSTOMER = "customer",
  SERVICE_PROVIDER = "service_provider",
}

export type UserDto = {
  name: string
  email: string
  password: string
  address: string
  phone_number: string
  url?: string
  user_type: string
  pfp?: string
}

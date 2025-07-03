import { User } from "../../models/user.model";
import { UserDto } from "../dtos/user.dto";

export function mapUserToUserDto(user: User): UserDto {
  const dto: Partial<UserDto> = {
    address: user.address,
    message: user.message,
    signature: user.signature,
    nonce: user.nonce,
    type: user.kycType,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  };

  if (user.indicator?.trim()) dto.indicator = user.indicator;
  if (user.cellphone?.trim()) dto.cellphone = user.cellphone;
  if (user.telegramUser?.trim()) dto.telegramUser = user.telegramUser;

  return dto as UserDto;
}

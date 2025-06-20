import { Ambassador } from "../../models/Ambassador.model";
import { AmbassadorDto } from "../dtos/Ambassador.dot";

export function mapAmbassadorDtoToAmbassador(dto: AmbassadorDto): Ambassador {
  return {
    address: dto.address,
    fee: Number(dto.fee),
  };
}

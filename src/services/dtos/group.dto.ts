import { AmbassadorDto } from "./Ambassador.dot";

export interface GroupDto {
  referral: string;
  state: boolean;
  ambassadors: AmbassadorDto[];
}

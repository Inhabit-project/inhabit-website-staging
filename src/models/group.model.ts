import { Ambassador } from "./Ambassador.model";

export interface Group {
  referral: string;
  state: boolean;
  ambassadors: Ambassador[];
}

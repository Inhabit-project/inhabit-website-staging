import { Ambassador } from "./Ambassador.model";

export interface Group {
  id: number;
  referral: string;
  state: boolean;
  ambassadors: Ambassador[];
}

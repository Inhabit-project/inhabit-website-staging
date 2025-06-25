export type RightType =
  | "LAND RIGHT"
  | "GOVERNANCE RIGHT"
  | "ART RIGHT"
  | "MONITORING RIGHT"
  | "UTILITY RIGHTS"
  | "EDUCATION RIGHT"
  | "ASSET RIGHT";

export interface RightDetail {
  title: string;
  description?: string;
  minimum_fundraise: boolean | string;
  full_fundraise: boolean | string;
}

export interface Right {
  type: RightType;
  details: RightDetail[];
}

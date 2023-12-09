import { ReactNode } from "react";

export interface TabContent {
  content: ReactNode;
  color: string;
}
export interface StatValuesType {
  statCode: string;
  statName: string;
  statValue: number;
}

export interface StatObjectType {
  statList: StatValuesType[];
  statPoint: number;
}
// SKill
export interface SkillValuesType {
  name: string;
  img?: string;
  desc: string;
}

export interface ItemValuesType {
  img: string;
  desc: string;
}


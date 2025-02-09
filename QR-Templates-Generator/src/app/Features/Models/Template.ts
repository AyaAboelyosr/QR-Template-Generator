import { Section } from "./Section";

export interface Template {
     id: number;
     title: string;
     uniqeCode: string;
     sections?: Section[];
  }
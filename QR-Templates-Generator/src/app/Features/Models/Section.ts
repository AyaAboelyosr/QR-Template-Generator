import { Field } from './Field';
export interface Section {
  id: number;
  title: string;
  type: string;
  templateId: number;
  fields?: Field[];
}
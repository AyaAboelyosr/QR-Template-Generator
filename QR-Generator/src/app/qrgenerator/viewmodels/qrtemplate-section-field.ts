import { QRTemplateSectionFieldType } from "./qrtemplate-section-field-type";

export interface QRTemplateSectionField {
    id: number;
    fieldTitle: string;
    fieldDescription: string;
    fieldOrder: number;
    isRequired: boolean;
    fieldType: QRTemplateSectionFieldType;
}

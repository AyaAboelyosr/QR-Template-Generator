import { QRTemplateSectionField } from "./qrtemplate-section-field";
import { QRTemplateSectionType } from "./qrtemplate-section-type";

export interface QRTemplateSection {
    id: number;
    sectionTitle: string;
    sectionDescription: string;
    sectionOrder: number;
    sectionType: QRTemplateSectionType;
    fields: QRTemplateSectionField[];
}

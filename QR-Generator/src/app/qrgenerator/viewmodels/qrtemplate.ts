import { QRTemplateSection } from "./qrtemplate-section";

export interface QRTemplate {
    id: number;
    title: string;
    description: string;
    sections: QRTemplateSection[];
}

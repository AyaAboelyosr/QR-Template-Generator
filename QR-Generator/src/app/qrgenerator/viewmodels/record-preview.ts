import { RecordPreviewSection } from "./record-preview-section";

export interface RecordPreview {
    recordId: number;
    templateId: number;
    sections: RecordPreviewSection[];
}

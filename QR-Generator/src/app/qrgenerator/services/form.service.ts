import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldSubmission } from '../viewmodels/field-submission';
import { QRTemplate } from '../viewmodels/qrtemplate';
import { RecordService } from './record.service';
import { TemplateService } from './template-service';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  
  template: QRTemplate | null = null;
  form: FormGroup;
  formData: FormData | null = null;
  recordId: number | null = null;
  private readonly STORAGE_KEY = 'previewData';

  constructor(private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private recordService: RecordService,
    private templateService: TemplateService,
  ) {
    this.form = this.fb.group({});
  }
  saveFormData(form: FormGroup, template: QRTemplate | null): boolean {
    if (!form.valid || !template) {
      return false;
    }
    const fields: FieldSubmission[] = [];
    template.sections.forEach(section => {
      if (section.sectionType === 0) { // Form section
        const sectionData = form.get(`section_${section.id}`)?.value;
        if (sectionData) {
          Object.keys(sectionData).forEach(fieldId => {
            fields.push({
              sectionId: section.id,
              fieldId: parseInt(fieldId),
              value: sectionData[fieldId]?.toString() || ''
            });
          });
        }
      } else if (section.sectionType === 1) { // Table section
        const tableData = form.get(`table_${section.id}`)?.value;
        if (Array.isArray(tableData)) {
          tableData.forEach((row) => {
            // Use existing rowIndex or generate a new one
            const rowIndex = row.rowIndex || crypto.randomUUID();
            Object.keys(row).forEach(fieldId => {
              if (fieldId !== 'rowIndex') { // Skip the rowIndex field itself
                fields.push({
                  sectionId: section.id,
                  fieldId: parseInt(fieldId),
                  value: row[fieldId]?.toString() || '',
                  rowIndex: rowIndex
                });
              }
            });
          });
        }
      }
    });

    const submission = {
      templateId: template.id,
      fields: fields
    };
    
    this.recordService.createRecord(submission).subscribe({
      next: (response) => {
        
        return true;
      },
      error: (error) => {
        console.error('Error saving form data', error);
        return false;
      }
    });

    return true;
  }

  updateFormData(recordId: number, form: FormGroup, template: QRTemplate | null): boolean {
    if (!form.valid || !template) {
      return false;
    }

    const updateData = {
      recordId: recordId,
      templateId: template.id,
      fields: this.getAllFieldValues(form, template)
    };
    this.recordService.updateRecord(updateData).subscribe({
      next: (response) => {
        
        this.clearStoredData(); // Clear stored data after successful update
        return true;
      },
      error: (error) => {
        console.error('Error updating record', error);
        return false;
      }
    });

    return true;
  }

  private getAllFieldValues(form: FormGroup, template: QRTemplate): FieldSubmission[] {
    const result: FieldSubmission[] = [];
    if (!template) {
      return result;
    }

    template.sections.forEach(section => {
      if (section.sectionType === 0) { // Form section
        const sectionGroup = form.get(`section_${section.id}`);
        if (sectionGroup) {
          section.fields.forEach(field => {
            const value = sectionGroup.get(field.id.toString())?.value;
            if (value !== null && value !== undefined) {
              result.push({
                sectionId: section.id,
                fieldId: field.id,
                value: value.toString()
              });
            }
          });
        }
      } else if (section.sectionType === 1) { // Table section
        const tableArray = form.get(`table_${section.id}`) as FormArray;
        if (tableArray) {
          tableArray.controls.forEach((rowGroup: AbstractControl) => {
            
            const rowIndex = (rowGroup as FormGroup).get('rowIndex')?.value || crypto.randomUUID();

            section.fields.forEach(field => {
              const value = rowGroup.get(field.id.toString())?.value;
              if (value !== null && value !== undefined) {
                result.push({
                  sectionId: section.id,
                  fieldId: field.id,
                  value: value.toString(),
                  rowIndex: rowIndex
                });
              }
            });
          });
        }
      }
    });

    return result;
  }

  navigateToPreview(recordId: number) {
    this.recordId = recordId;
    this.recordService.getRecordPreview(recordId).subscribe({
      next: (previewData) => {
        this.templateService.getTemplateById(previewData.templateId).subscribe({
          next: (template) => {
            this.setTemplate(template); // Set template first
            
            // Then set form data
            this.setFormData({
              sections: previewData.sections.map(section => ({
                sectionTitle: section.sectionTitle,
                isTableSection: section.isTableSection,
                fields: section.fields,
                values: section.values,
                rows: section.rows
              }))
            });
  
            this.router.navigate(['/preview'], {
              state: {
                recordId: previewData.recordId,
                existingData: previewData,
                isEditMode: true
              }
            });
          },
          error: (error) => {
            console.error('Failed to fetch template data', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to fetch preview data', error);
      }
    });
  }

 
  setFormData(data: any): void {
    this.formData = data;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      formData: data,
      template: this.template,
      recordId: this.recordId
    }));
  }
  
  getFormData(): any {
    if (!this.formData) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.formData = data.formData;
        this.template = data.template;
        this.recordId = data.recordId;
       
      }
    }
    
    return this.formData;
  }


  setFormGroup(form: FormGroup): void {
    this.form = form;
  }

  getFormGroup(): FormGroup {
    return this.form;
  }

  setTemplate(template: any): void {
    this.template = template;
    // store in localStorage for persistence
    localStorage.setItem('currentTemplate', JSON.stringify(template));
  }

  getTemplate(): QRTemplate | null {
    if (!this.template) {
      // Try to get from localStorage
      const stored = localStorage.getItem('currentTemplate');
      if (stored) {
        this.template = JSON.parse(stored);
      }
    }
    return this.template;
  }
  private editModeState: {
    isEditMode: boolean;
    recordId: number | null;
  } = {
      isEditMode: false,
      recordId: null
    };

  
  setEditMode(isEditMode: boolean, recordId: number | null) {
    this.editModeState = {
      isEditMode,
      recordId
    };
    
    localStorage.setItem('editModeState', JSON.stringify(this.editModeState));
  }

  getEditMode() {
    
    if (this.editModeState.isEditMode) {
      return this.editModeState;
    }
    
    const stored = localStorage.getItem('editModeState');
    if (stored) {
      this.editModeState = JSON.parse(stored);
      return this.editModeState;
    }
    return {
      isEditMode: false,
      recordId: null
    };
  }

  clearEditMode() {
    this.editModeState = {
      isEditMode: false,
      recordId: null
    };
    localStorage.removeItem('editModeState');
  }
  clearStoredData(): void {
   
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('currentTemplate');
    this.formData = null;
    this.template = null;
    this.form = this.fb.group({});
  }
  
 
  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('currentTemplate');
    localStorage.removeItem('editModeState');
    this.formData = null;
    this.template = null;
    this.recordId = null;
    this.form = this.fb.group({});
  }
}

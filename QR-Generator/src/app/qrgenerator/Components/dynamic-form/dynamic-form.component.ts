import { Component, OnInit } from '@angular/core';
import { Router ,RouterLink} from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ValidatorFn, Validators } from '@angular/forms';
import { TemplateService } from '../../services/template-service';
import { QRTemplate } from '../../viewmodels/qrtemplate';
import { QRTemplateSectionField } from '../../viewmodels/qrtemplate-section-field';
import { FormService } from '../../services/form.service';
import { RecordPreviewSection } from '../../viewmodels/record-preview-section';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  template: QRTemplate | null = null;
  form: FormGroup;
  formdata:any;
  templateId: number | null = null;
  isEditMode: boolean = false;
  recordId: number | null = null;
  existingData?: { sections: RecordPreviewSection[] };
  isSubmitModalOpen: boolean = false;
  showError: boolean = false;
  constructor(
    private router: Router,
    private templateService: TemplateService,
    private fb: FormBuilder,
    private formService: FormService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
  const state = history.state;
 
  
  this.templateId = state.id || null;
  this.recordId = state.recordId;
  
  // Get edit mode state
  const editModeState = this.formService.getEditMode();
 
  
  // Handle different scenarios
  if (state.fromPreview) {
    // Coming back from preview
    this.template = this.formService.getTemplate();
    if (this.template) {
      this.initializeFormStructure(this.template);
      const savedFormData = this.formService.getFormData();
      if (savedFormData) {
        // Ensure we have the template before populating data
        setTimeout(() => {
          this.populateFormWithExistingData(savedFormData);
        });
      }
    }
  } else if (state.isEditMode) {
    // Normal edit mode
    this.template = this.formService.getTemplate();
    if (this.template) {
      this.initializeFormStructure(this.template);
      const savedFormData = this.formService.getFormData();
      if (savedFormData) {
        // Ensure we have the template before populating data
        setTimeout(() => {
          this.populateFormWithExistingData(savedFormData);
        });
      }
    }
  } else if (this.templateId) {
    // Creating new form
    this.fetchTemplateStructure(this.templateId);
  }
  }
//
getExistingDataForSection(sectionId: number): RecordPreviewSection | undefined {
  return this.existingData?.sections.find(section => section.sectionId === sectionId);
} 
private fetchTemplateStructure(templateId: number): Promise<void> {
    return new Promise((resolve) => {
      this.templateService.getTemplateById(templateId).subscribe({
        next: (template) => {
          this.template = template;
          this.initializeFormStructure(template);
          
          // populate form with existing data
          if (this.existingData) {
            this.populateFormWithExistingData(this.existingData);
          }
          
          resolve();
        },
        error: (error) => {
          console.error('Failed to fetch template:', error);
          this.router.navigate(['qrgenerator']);
        }
      });
    });
  }
//
private populateFormWithExistingData(existingData: { sections: any[] }): void {
  
  
  
  if (!existingData || !existingData.sections || !this.template) {
    console.error('Missing data for form population');
    return;
  }

  // Map template sections to existingData sections by title
  this.template.sections.forEach(templateSection => {
    const sectionData = existingData.sections.find(
      s => s.sectionTitle === templateSection.sectionTitle
    );

    if (!sectionData) {
      console.warn(`No data found for section: ${templateSection.sectionTitle}`);
      return;
    }

    if (templateSection.sectionType === 0) { // Form section
      const sectionGroup = this.form.get(`section_${templateSection.id}`);
      if (sectionGroup && sectionData.values) {
       
        sectionGroup.patchValue(sectionData.values);
      }
    } else if (templateSection.sectionType === 1) { // Table section
      const tableFormArray = this.form.get(`table_${templateSection.id}`) as FormArray;
      if (tableFormArray && sectionData.rows) {
        // Clear existing rows
        while (tableFormArray.length > 0) {
          tableFormArray.removeAt(0);
        }

        // Add new rows
        sectionData.rows.forEach((row: any) => {
          const rowGroup = this.fb.group({});
          Object.keys(row).forEach(fieldId => {
            if (fieldId !== 'rowIndex') {
              rowGroup.addControl(fieldId, this.fb.control(row[fieldId]));
            }
          });
          if (row.rowIndex) {
            rowGroup.addControl('rowIndex', this.fb.control(row.rowIndex));
          }
          tableFormArray.push(rowGroup);
        });
      }
    }
  });

}
private initializeFormStructure(template: QRTemplate): void {
  
    if (!template) {
      console.error('No template provided for form initialization');
      return;
    }
  
    const formStructure = this.fb.group({});
  
    template.sections.forEach(section => {
      if (section.sectionType === 0) { // Form section
        const sectionGroup = this.fb.group({});
        section.fields.forEach(field => {
          const validators = this.getValidators(field);
          sectionGroup.addControl(
            field.id.toString(),
            this.fb.control('', validators)
          );
        });
        formStructure.addControl(`section_${section.id}`, sectionGroup);
      } else if (section.sectionType === 1) { // Table section
        formStructure.addControl(
          `table_${section.id}`,
          this.fb.array([])
        );
      }
    });
  
    this.form = formStructure;
    this.formService.setFormGroup(this.form);
    
  }


private getValidators(field: QRTemplateSectionField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.isRequired) validators.push(Validators.required);
    if (field.fieldType === 1) validators.push(Validators.pattern(/^-?\d+$/));
    return validators;
  }
  onPreview() {
    if (!this.template) {
      console.error('Template is not available');
      return;
    }
  
    const formattedData = {
      sections: this.template.sections.map(section => ({
        sectionTitle: section.sectionTitle,
        sectionDescription: section.sectionDescription,
        isTableSection: section.sectionType === 1,
        fields: section.fields,
        values: section.sectionType === 0 ? 
          this.form.get(`section_${section.id}`)?.value : undefined,
        rows: section.sectionType === 1 ? 
          (this.form.get(`table_${section.id}`) as FormArray)?.value : undefined
      }))
    };
    
    this.formService.setFormGroup(this.form);
    this.formService.setTemplate(this.template);
    this.formService.setFormData(formattedData);
    
    // Add templateId to the navigation state for new forms
    this.router.navigate(['/preview'], {
      state: {
        recordId: this.recordId,
        isEditMode: this.isEditMode,
        templateId: this.template.id,  
        isNewForm: true  // flag to indicate new form
      }
    });
  }


 async onSubmit(): Promise<void> {
  if (!this.form.valid || !this.template) {
    this.showError = true;
    return;
  }

  let success = false;
  const editModeState = this.formService.getEditMode();
  
  try {
    if (editModeState.isEditMode && this.recordId) {
    
      success = await this.formService.updateFormData(this.recordId, this.form, this.template);
    } else {
      
      success = await this.formService.saveFormData(this.form, this.template);
    }
    
    if (success) {
      this.showError = false;
      this.formService.clearEditMode(); 
      await this.showSubmitModal();
      this.router.navigate(['qrgenerator']);
    } else {
      this.showError = true;
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    this.showError = true;
  }
  }



async showSubmitModal() {
    this.isSubmitModalOpen = true;

    
    setTimeout(() => {
      this.isSubmitModalOpen = false;
    }, 2000);
  }

onShowAllTransactions() {
    this.router.navigate(['qrgenerator']);
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QRTemplate } from '../../viewmodels/qrtemplate';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RecordService } from '../../services/record.service';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  formData: any;
  template: QRTemplate | null = null;
  form: FormGroup;
  recordId: number | null = null; 

  constructor(
    private router: Router,
    private formService: FormService,
     private fb: FormBuilder,
     private recordService: RecordService,
  ) {
    this.form = this.formService.getFormGroup();
  }

  ngOnInit(): void {

   
    this.template = this.formService.getTemplate();
    this.form = this.formService.getFormGroup();
    this.formData = this.formService.getFormData();
    this.recordId = history.state.recordId;
  
    if (history.state.isEditMode && this.recordId) {
      this.formService.setEditMode(true, this.recordId);
    }
  
    if (!this.template || !this.form || !this.formData) {
      console.error('Missing required data');
      this.router.navigate(['qrgenerator']);
    }
  }

  onEdit() {
  const state = history.state;
  
  if (state.isNewForm) {
    // Editing a new form that hasn't been saved yet
    this.router.navigate(['/dynamic-form'], { 
      state: { 
        id: state.templateId,
        fromPreview: true,
        formData: this.formData,
        isNewForm: true
      }
    });
  } else if (this.template && this.recordId) {
    // Editing an existing record
    this.recordService.getRecordPreview(this.recordId).subscribe({
      next: (record) => {
        this.router.navigate(['/dynamic-form'], { 
          state: { 
            id: record.templateId,
            recordId: this.recordId,
            existingData: record,
            isEditMode: true,
            fromPreview: true
          }
        });
      },
      error: (error) => {
        console.error('Failed to load record', error);
      }
    });
  }
   }

  onSave() {
    const editModeState = this.formService.getEditMode();
  
    if (editModeState.isEditMode && this.recordId) {
      // If in edit mode, update the existing record
      this.formService.updateFormData(this.recordId, this.form, this.template);
    } else {
      // If not in edit mode, create a new record
      this.formService.saveFormData(this.form, this.template);
    }
    
    this.formService.clearStoredData(); // Clear stored data after saving
    this.formService.clearEditMode();   // Clear edit mode state
    this.router.navigate(['qrgenerator']);
  }
}
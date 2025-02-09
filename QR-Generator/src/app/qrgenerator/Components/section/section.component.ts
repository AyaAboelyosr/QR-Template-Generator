import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { QRTemplateSection } from '../../viewmodels/qrtemplate-section';
import { QRTemplateSectionField } from '../../viewmodels/qrtemplate-section-field';
import { RecordPreviewSection } from '../../viewmodels/record-preview-section';
import { Console } from 'console';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  @Input() section!: QRTemplateSection;
  @Input() parentForm!: FormGroup;
  @Input() existingData?: RecordPreviewSection;

  ngOnInit() {
    if (this.isTableSection) {
      this.handleTableInitialization();
    } else {
      this.handleFormInitialization();
    }
  }

  private handleTableInitialization(): void {
    while (this.sectionFormArray.length > 0) {
      this.sectionFormArray.removeAt(0); // Clear existing rows
    }
  
    if (this.existingData?.rows) {
      this.existingData.rows.forEach(row => this.addTableRow(row)); // Add rows with existing `rowIndex`
    } else {
      this.addTableRow(); // Add a new row with a generated `rowIndex`
    }
  }

  private handleFormInitialization(): void {
    if (this.existingData?.values) {
      this.sectionFormGroup.patchValue(this.existingData.values);
    }
  }

  addTableRow(initialData?: any): void {
    const row = this.createTableRow(initialData?.rowIndex); // Use existing `rowIndex` or generate a new one

  if (initialData) {
    this.section.fields.forEach(field => {
      const fieldValue = initialData[field.id.toString()] || '';
      row.get(field.id.toString())?.setValue(fieldValue);
    });
  }

  this.sectionFormArray.push(row);
  }

  get sectionFormGroup(): FormGroup {
    return this.parentForm.get(`section_${this.section.id}`) as FormGroup;
  }

  get sectionFormArray(): FormArray {
    return this.parentForm.get(`table_${this.section.id}`) as FormArray;
  }

  get isTableSection(): boolean {
    return this.section.sectionType === 1;
  }

  getFieldType(fieldType: number): string {
    switch(fieldType) {
      case 1: return 'number';
      case 2: return 'date';
      case 3: return 'checkbox';
      default: return 'text';
    }
  }

  removeTableRow(index: number): void {
    if (this.sectionFormArray.length > 1) {
      this.sectionFormArray.removeAt(index);
    }
  }

  private createTableRow(existingrowIndex?: string): FormGroup {
    const row = new FormGroup<{ [key: string]: AbstractControl<any, any> }>({
      // Add rowIndex control with either existing ID or generate new one
      rowIndex: new FormControl(existingrowIndex || crypto.randomUUID())
    });

    this.section.fields.forEach(field => {
      row.addControl(
        field.id.toString(),
        new FormControl('', this.getValidators(field))
      );
    });
    return row;
  }

  getRowAsFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  private getValidators(field: QRTemplateSectionField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.isRequired) validators.push(Validators.required);
    if (field.fieldType === 1) validators.push(Validators.pattern(/^-?\d+$/));
    return validators;
  }

  showError(fieldId: string): boolean {
    const control = this.getControl(fieldId);
    return control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(fieldId: string): string {
    const control = this.getControl(fieldId);
    if (!control.errors) return '';
    
    if (control.errors['required']) return 'This field is required';
    if (control.errors['pattern']) return 'Invalid format';
    return 'Invalid value';
  }

  private getControl(fieldId: string): FormControl {
    if (this.isTableSection) {
      const firstRow = this.sectionFormArray.at(0);
      return firstRow?.get(fieldId) as FormControl ?? new FormControl('');
    }
    return this.sectionFormGroup.get(fieldId) as FormControl;
  }
}
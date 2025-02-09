import { Component, ViewChild, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from 'angular-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TemplateService } from 'src/app/service/template.service';
import { Template} from '../Models/Template';
import { Section } from '../Models/Section';
import { Field } from '../Models/Field';

@Component({
  selector: 'app-list-template',
  templateUrl: './list-template.component.html',
  styleUrls: ['./list-template.component.css'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))
      ]),
    ]),
  ],
})
export class ListTemplateComponent implements OnInit {
  @ViewChild('addTemplateModal') addTemplateModal!: ModalComponent;
  @ViewChild('addSectionModal') addSectionModal!: ModalComponent;
  @ViewChild('addFieldModal') addFieldModal!: ModalComponent;
  
  params!: FormGroup;
  sectionParams!: FormGroup;
  fieldParams!: FormGroup;

  filteredTemplateList: Template[] = [];
  searchTemplate = '';
  templateList: Template[] = [];
  
  displayType = 'list';
  
  selectedTemplateId: number | null = null;
  selectedSectionId: number | null = null;

  constructor(private fb: FormBuilder, private templateService: TemplateService) {}

  ngOnInit() {
    this.initForm();
    this.initSectionForm();
    this.initFieldForm();
    this.loadTemplates();
  }

  initForm() {
    this.params = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      uniqeCode: ['', [Validators.required, Validators.pattern(/^SI-\d{3}$/)]],
    });
  }


  initSectionForm() {
    this.sectionParams = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: ['', Validators.required],
    });
  }

  initFieldForm() {
    this.fieldParams = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: ['', Validators.required],
      isRequired: [false, Validators.required],
    });
  }

  loadTemplates() {
    this.templateService.getAllTemplates().subscribe((templates) => {
      this.templateList = templates;
      this.searchTemplates();
    });
  }

  searchTemplates() {
    this.filteredTemplateList = this.templateList.filter(template =>
      template.title.toLowerCase().includes(this.searchTemplate.toLowerCase())
    );
  }

  editTemplate(template: Template | null = null) {
    this.addTemplateModal.open();
    this.initForm();
    if (template) {
      this.params.setValue({
        id: template.id,
        title: template.title,
        uniqeCode: template.uniqeCode,
      });
    }
  }

  saveTemplate() {
    if (this.params.invalid) {
      this.showMessage('Please fill all required fields correctly.', 'error');
      return;
    }
  
    const template: Template = this.params.value;
  
    if (template.id) {
      this.templateService.updateTemplate(template.id.toString(), template).subscribe(() => {
        const existingTemplate = this.templateList.find(t => t.id === template.id);
        if (existingTemplate) {
          Object.assign(existingTemplate, template);
        }
        this.searchTemplates();
        this.showMessage('Template has been updated successfully.');
        this.addTemplateModal.close();
      });
    } else {
      template.id = this.templateList.length ? Math.max(...this.templateList.map(t => t.id)) + 1 : 1;
      this.templateList.unshift(template);
      this.searchTemplates();
      this.showMessage('Template has been added successfully.');
      this.addTemplateModal.close();
    }
  }

  deleteTemplate(template: Template) {
    this.templateService.deleteTemplate(template.id.toString()).subscribe(() => {
      this.templateList = this.templateList.filter(t => t.id !== template.id);
      this.searchTemplates();
      this.showMessage('Template has been deleted successfully.');
    }, error => {
      this.showMessage(error, 'error');
    });
  }

  showMessage(msg: string, type: 'success' | 'error' = 'success') {
    Swal.fire({
      icon: type,
      title: msg,
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: 'toast' },
    });
  }

  // Section methods
  loadSections(templateId: number) {
    this.templateService.getTemplateById(templateId.toString()).subscribe((template) => {
      const existingTemplate = this.templateList.find(t => t.id === templateId);
      if (existingTemplate) {
        existingTemplate.sections = template.sections;
      }
    });
  }

  editSection(templateId: number, section: Section | null = null) {
    this.selectedTemplateId = templateId;
    this.addSectionModal.open();
    this.initSectionForm();
    if (section) {
      this.sectionParams.setValue({
        id: section.id,
        title: section.title,
        type: section.type,
      });
    }
  }

  saveSection() {
    if (this.sectionParams.invalid) {
      this.showMessage('Please fill all required fields.', 'error');
      return;
    }
  
    const section: Section = this.sectionParams.value;
    const templateId = this.selectedTemplateId;
  
    
  
    if (templateId !== null) {
      const addSectionDTO = {
        title: section.title,
        type: this.mapSectionType(section.type) 
      };
  
   
  
      if (section.id) {
       
        this.templateService.updateSection(templateId.toString(), section.id.toString(), addSectionDTO)
          .subscribe(
            () => {
              const template = this.templateList.find(t => t.id === templateId);
              if (template && template.sections) {
                const existingSection = template.sections.find(s => s.id === section.id);
                if (existingSection) {
                  Object.assign(existingSection, section);
                }
              }
              this.showMessage('Section has been updated successfully.');
              this.addSectionModal.close();
            },
            (error) => this.handleErrorResponse(error)
          );
      } else {
       
        this.templateService.addSection(templateId.toString(), addSectionDTO)
          .subscribe(
            (newSection) => {
              const template = this.templateList.find(t => t.id === templateId);
              if (template) {
                if (!template.sections) {
                  template.sections = [];
                }
                template.sections.push(newSection);
              }
              this.showMessage('Section has been added successfully.');
              this.addSectionModal.close();
            },
            (error) => this.handleErrorResponse(error)
          );
      }
    }
  }
  
 
  private mapSectionType(type: any): number {
    const sectionTypeMap: { [key: string]: number } = {
      'Form': 0,
      'Table': 1,
    };
    return sectionTypeMap[type] ?? 0; 
  }
  
 
  private handleErrorResponse(error: any) {
    console.error('Error response:', error);
    console.error('Error details:', JSON.stringify(error.error));
    this.showMessage(error.error?.message || 'An unknown error occurred!', 'error');
  }
  
  deleteSection(templateId: number, sectionId: number) {
    this.templateService.deleteSection(templateId.toString(), sectionId.toString()).subscribe(() => {
      const template = this.templateList.find(t => t.id === templateId);
      if (template && template.sections) {
        template.sections = template.sections.filter(s => s.id !== sectionId);
      }
      this.showMessage('Section has been deleted successfully.');
    }, error => {
      this.showMessage(error, 'error');
    });
  }

  getTemplateIdBySectionId(sectionId: number): number | undefined {
    for (const template of this.templateList) {
      if (template.sections) { 
        for (const section of template.sections) {
          if (section.id === sectionId) {
            return template.id;
          }
        }
      }
    }
    return undefined;
  }

  // Field methods
  editField(section: Section, field: Field | null = null) {
    this.selectedSectionId = section.id;
    const templateId = this.getTemplateIdBySectionId(section.id);
    this.selectedTemplateId = templateId !== undefined ? templateId : null; 
    this.addFieldModal.open();  
    this.initFieldForm();  
    if (field) {
      this.fieldParams.setValue({
        id: field.id,
        title: field.title,
        type: field.type,
        isRequired: field.isRequired,
      });
    }
  }
  

  saveField() {
   
    
    if (this.fieldParams.invalid) {
      this.showMessage('Please fill all required fields.', 'error');
      return;
    }
  
    const field: Field = this.fieldParams.value;
    const sectionId = this.selectedSectionId;
    const templateId = this.selectedTemplateId;
  
  
  
    if (templateId != null && sectionId != null) {
      const addFieldDTO = {
        title: field.title,
        type: this.mapFieldType(field.type), // Convert type correctly
        isRequired: field.isRequired,
      };
  
    
  
      if (field.id != null && field.id !== 0) {
       
        this.templateService.updateField(templateId.toString(), sectionId.toString(), field.id.toString(), addFieldDTO)
          .subscribe(
            () => {
              this.showMessage('Field updated successfully');
              this.addFieldModal.close();
            },
            (error) => this.handleErrorResponse(error)
          );
      } else {
      
        this.templateService.addField(templateId.toString(), sectionId.toString(), addFieldDTO)
          .subscribe(
            (newField) => {
              this.showMessage('Field added successfully');
              this.addFieldModal.close();
            },
            (error) => this.handleErrorResponse(error)
          );
      }
    } else {
      this.showMessage('Template ID or Section ID is missing.', 'error');
    }
  }
  
 
  private mapFieldType(type: any): number {
    const fieldTypeMap: { [key: string]: number } = {
      'Text': 0,
      'Number': 1,
      'Date': 2,
      'Boolean': 3,
    };
    return fieldTypeMap[type]; 
  }
  
  

  deleteField(section: Section, fieldId: number) {
    const templateId = this.getTemplateIdBySectionId(section.id); 
    
   
  
    if (templateId !== undefined) {  
      this.templateService.deleteField(templateId.toString(), section.id.toString(), fieldId.toString()).subscribe(() => {
        const template = this.templateList.find(t => t.id === templateId);
        const existingSection = template?.sections?.find(s => s.id === section.id);
        if (existingSection && existingSection.fields) {
          existingSection.fields = existingSection.fields.filter(f => f.id !== fieldId);
        }
        this.showMessage('Field has been deleted successfully.');
      }, error => {
        this.showMessage(error, 'error');
      });
    } else {
      this.showMessage('Failed to delete field: Template ID is missing.', 'error');
    }
  }
  
  

 
  loadFields(section: Section) {
    const templateId = this.selectedTemplateId;
    if (templateId !== null) {
      this.templateService.getSectionFields(templateId.toString(), section.id.toString()).subscribe((fields) => {
        section.fields = fields;
      });
    }
  }

}
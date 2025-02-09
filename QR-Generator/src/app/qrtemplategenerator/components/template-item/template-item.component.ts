import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'angular-custom-modal';
import { TemplateService } from '../../services/template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Template } from '../../Models/Template';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-template-item',
  templateUrl: './template-item.component.html',
  styleUrls: ['./template-item.component.css']
})
export class TemplateItemComponent implements OnInit {
  @ViewChild('addFieldModal') addFieldModal!: ModalComponent;
  @ViewChild('addSectionModal') addSectionModal!: ModalComponent;

  _TemplateService=inject(TemplateService);
  _router=inject(ActivatedRoute);
  _fb = inject(FormBuilder);
  fieldParams!: FormGroup;
  sectionParams!: FormGroup;
  currentSectionId: number | null = null;
  templateData: any = {};
  displayType: string = 'grid'; 
  templateId!: string;
  params!: FormGroup;
  ngOnInit(): void {
    this.templateId = this._router.snapshot.paramMap.get('id')!; 
    this.getTemplatebyId();
    this.initFieldForm();
    this.initSectionForm();
  }

  initSectionForm(): void {
    this.sectionParams = this._fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],  // Title validation
      type: ['', Validators.required]
    });
  }
  
  initForm() {
    this.params = this._fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      uniqeCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}-\d{3}$/)]],
    });
  }

  initFieldForm(): void {
    this.fieldParams = this._fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: ['Text', Validators.required],
      isRequired: [false]
    });
  }

  openAddFieldModal(sectionId: number): void {
    this.currentSectionId = sectionId;
    this.fieldParams.reset({ type: 'Text', isRequired: false, title: '' });
    this.addFieldModal.open();
  }
  

  openAddSectionModal(): void {
    this.sectionParams.reset({ type: 'form' });
    this.addSectionModal.open();
  }

  saveField(): void {
   
    if (this.fieldParams.invalid) {
      this.showMessage('Please fill all required fields correctly.', 'error');
      return;
    }
  
   
    if (!this.templateData || !this.templateData.sections) {
      this.showMessage('Template data is not loaded.', 'error');
      return;
    }
  
    
    if (!this.currentSectionId) {
      this.showMessage('No section selected.', 'error');
      return;
    }
  
    const fieldData = this.fieldParams.value;
  
    
    const mappedType = this.mapFieldType(fieldData.type);
  
   
    const requestData = {
      title: fieldData.title,
      type: mappedType,
      isRequired: fieldData.isRequired
    };
  
  
    const section = this.templateData.sections.find((s: any) => s.id === this.currentSectionId);
    if (!section) {
      this.showMessage('Section not found.', 'error');
      return;
    }
    
  
    if (!section.fields) {
      section.fields = [];
    }
    
    this._TemplateService.addField(this.templateId, this.currentSectionId!.toString(), requestData)
      .subscribe({
        next: (res) => {
          section.fields.push(res);
          this.showMessage('Field added successfully.', 'success');
          this.addFieldModal.close();
        },
        error: (error) => {
          console.error('Error adding field:', error);
          this.showMessage('Failed to add field.', 'error');
        }
      });
    
    
  }
  getTemplatebyId(){
    this._TemplateService.getTemplateById(this.templateId).subscribe({
      next: (res) => {
        console.log( 'Template id',this.templateId);
        console.log('Result =' ,res);
        this.templateData = res;
       
      },
      error: (error) => {
        console.error('Error:', error);
      }


    })
  }

  saveTemplate(): void {
    if (!this.templateData.title || !this.templateData.uniqeCode) {
      this.showMessage('Please fill all required fields.', 'error');
      return;
    }

    const template: any = {
      id: this.templateId,
      title: this.templateData.title,
      uniqeCode: this.templateData.uniqeCode
    };

 
    this._TemplateService.updateTemplate(this.templateId, template).subscribe({
      next: () => {
        this.showMessage('Template updated successfully.', 'success');
      },
      error: (error) => {
        console.error('Error updating template:', error);
        this.showMessage('Failed to update template.', 'error');
      }
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
  
  toggleSection(section: any) {
    section.expanded = !section.expanded;
  }
  
  

  toggleField(field: any): void {
    field.expanded = !field.expanded;
  }

  addSection(): void {
    const newSection = {
      title: 'New Section',  
      type: this.mapSectionType('Form'), 
      fields: [],
      expanded: false
    };
  
    this._TemplateService.addSection(this.templateId, newSection).subscribe({
      next: (res) => {
        this.templateData.sections.push(res); 
        this.showMessage('Section added successfully.', 'success'); 
      },
      error: (error) => {
        console.error('Error adding section:', error);
        this.showMessage('Failed to add section.', 'error'); 
      }
    });
  }
  
 
  private mapSectionType(type: string): number {
    const sectionTypeMap: { [key: string]: number } = {
      'form': 0,   
      'table': 1,  
    };
    return sectionTypeMap[type.toLowerCase()] ?? 0;  
  }
  

  saveSection(): void {
    if (this.sectionParams.invalid) {
      console.log('Form is invalid');
      this.showMessage('Form is invalid', 'error');
      return;
    }
  
    const sectionData = this.sectionParams.value;
  
  
    if (!sectionData.title || sectionData.title.trim() === '') {
      console.error('Title is required');
      this.showMessage('Title is required', 'error');
      return;
    }
  
    const requestData = {
      id: sectionData.id,
      title: sectionData.title,
      type: this.mapSectionType(sectionData.type),
    };
  
    if (sectionData.id) {
    
      this._TemplateService.updateSection(this.templateId, sectionData.id.toString(), requestData)
        .subscribe({
          next: (res) => {
            const sectionIndex = this.templateData.sections.findIndex((s: any) => s.id === sectionData.id);
            if (sectionIndex !== -1) {
              this.templateData.sections[sectionIndex] = res;
            }
            this.showMessage('Section updated successfully', 'success');
            this.addSectionModal.close();
          },
          error: (error) => {
            console.error('Error updating section:', error);
            this.showMessage('Error updating section', 'error');
          }
        });
    } else {
    
      this._TemplateService.addSection(this.templateId, requestData)
        .subscribe({
          next: (res) => {
            this.templateData.sections.push(res);
            this.showMessage('Section added successfully', 'success');
            this.addSectionModal.close();
          },
          error: (error) => {
            console.error('Error adding section:', error);
            this.showMessage('Error adding section', 'error');
          }
        });
    }
  }
  
  
  editSection(section: any): void {
  
    this.initSectionForm();

    if (section) {
      this.sectionParams.setValue({
        id: section.id,
        title: section.title,
        type: section.type
      });
    }
  
   
    this.addSectionModal.open();
  }
  

  deleteSection(sectionId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._TemplateService.deleteSection(this.templateId, sectionId.toString()).subscribe({
          next: () => {
            this.templateData.sections = this.templateData.sections.filter((s: any) => s.id !== sectionId);
            this.showMessage('Section deleted successfully', 'success');
          },
          error: (error) => {
            console.error('Error deleting section:', error);
            this.showMessage('Error deleting section', 'error');
          }
        });
      }
    });
  }
  


addField(sectionId: number): void {
  const newField = {
    title: '',
    type: 'Text', 
    isRequired: false,
    expanded: false
  };

  this._TemplateService.addField(this.templateId, sectionId.toString(), newField).subscribe({
    next: (res) => {
      const section = this.templateData.sections.find((s: any) => s.id === sectionId);
      if (section) {
        section.fields.push(res);
      }
    },
    error: (error) => {
      console.error('Error adding field:', error);
    }
  });
}

editField(sectionId: number, field: any): void {
  this.currentSectionId = sectionId;
  this.fieldParams.patchValue(field);  
  this.addFieldModal.open();          
}


deleteField(sectionId: number, fieldId: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This field will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this._TemplateService.deleteField(this.templateId, sectionId.toString(), fieldId.toString()).subscribe({
        next: () => {
          const section = this.templateData.sections.find((s: any) => s.id === sectionId);
          if (section) {
            section.fields = section.fields.filter((f: any) => f.id !== fieldId);
          }
          this.showMessage('Field has been deleted successfully.', 'success');
        },
        error: (error) => {
          console.error('Error deleting field:', error);
          this.showMessage('Error deleting field', 'error');
        }
      });
    }
  });
}




private mapFieldType(type: string): number {
  const fieldTypeMap: { [key: string]: number } = {
    'Text': 0,
    'Number': 1,
    'Date': 2,
    'Boolean': 3
  };
  return fieldTypeMap[type] ?? 0; 
}

 editTemplate(template: Template | null = null) {
  
      this.initForm();
      if (template) {
        this.params.setValue({
          id: template.id,
          title: template.title,
          uniqeCode: template.uniqeCode,
        });
      }
   
  }



}

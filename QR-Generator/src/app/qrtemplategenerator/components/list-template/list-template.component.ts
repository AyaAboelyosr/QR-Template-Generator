import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TemplateService } from 'src/app/qrtemplategenerator/services/template.service';
import { Template } from 'src/app/qrtemplategenerator/Models/Template';
import { ModalComponent } from 'angular-custom-modal';

@Component({
  selector: 'app-list-template',
  templateUrl: './list-template.component.html',
  styleUrls: ['./list-template.component.css']
})
export class ListTemplateComponent implements OnInit {
  @ViewChild('addTemplateModal') addTemplateModal!: ModalComponent;
  params!: FormGroup;
  filteredTemplateList: Template[] = [];
  searchTemplate = '';
  templateList: Template[] = [];
  displayType = 'list';

  constructor(private fb: FormBuilder, private templateService: TemplateService) {}

  ngOnInit() {
    this.initForm();
    this.loadTemplates();
  }

  initForm() {
    this.params = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      uniqeCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}-\d{3}$/)]],
    });
  }

  loadTemplates() {
    
    this.templateService.getAllTemplates().subscribe((templates) => {
      this.templateList = templates;
      this.templateList= templates.map(t => ({ ...t, expanded: false }));
      this.searchTemplates();
    });
  }

  searchTemplates() {
    this.filteredTemplateList = this.templateList.filter(template =>
      template.title.toLowerCase().includes(this.searchTemplate.toLowerCase())
    );
  }

  editTemplate(template: Template | null = null) {
    if (this.addTemplateModal) {
      this.addTemplateModal.open();
      this.initForm();
      if (template) {
        this.params.setValue({
          id: template.id,
          title: template.title,
          uniqeCode: template.uniqeCode,
        });
      }
    } else {
      console.error('addTemplateModal is not defined');
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
      this.templateService.addTemplate(template).subscribe((newTemplate) => {
        this.templateList.unshift(newTemplate);
        this.searchTemplates();
        this.showMessage('Template has been added successfully.');
        this.addTemplateModal.close();
      }, (error) => {
        this.showMessage('Failed to add template. Please try again.', 'error');
      });
    }
  }

  deleteTemplate(template: Template) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.templateService.deleteTemplate(template.id.toString()).subscribe({
        next: () => {
          this.templateList = this.templateList.filter(t => t.id !== template.id);
          this.searchTemplates();
          this.showMessage('Template has been deleted successfully.', 'success');
        },
        error: (error) => {
          console.error('Error deleting template:', error);
          this.showMessage(error, 'error');
        }
      });
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
  selectedTemplateWithSections: Template | null = null;

  getTemplateWithSections(templateId: number): void {
  
  
    this.templateService.getTemplateById(templateId.toString()).subscribe({
      next: (fullTemplate) => {
        if (fullTemplate) {
          this.selectedTemplateWithSections = fullTemplate;
        
        } else {
          this.showMessage('Template details not found.', 'error');
        }
      },
      error: (error) => {
        console.error('Error fetching template:', error);
        this.showMessage('Failed to load template details.', 'error');
      }
    });
  }
  
  onSelectTemplate(template: Template) {
    if (template?.id) {
      this.getTemplateWithSections(template.id);
    } else {
      this.showMessage('Invalid template selected.', 'error');
    }
  }
  
  


  handleSectionUpdate() {

    this.loadTemplates();
  }
  

  toggleSections(template: Template) {
    if (!template.expanded) {
      this.templateService.getTemplateById(template.id.toString())
        .subscribe(fullTemplate => {
          const index = this.templateList.findIndex(t => t.id === template.id);
          this.templateList[index] = { ...template, ...fullTemplate };
          template.expanded = true;
        });
    } else {
      template.expanded = !template.expanded;
    }
  }

  

}
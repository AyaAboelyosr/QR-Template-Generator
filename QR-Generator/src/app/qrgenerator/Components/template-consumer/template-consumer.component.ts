import { Component,OnInit } from '@angular/core';
import { TemplateService} from '../../services/template-service';
import { QRTemplateInfo } from '../../viewmodels/qrtemplate-info';
import { Router } from '@angular/router';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-template-consumer',
  templateUrl: './template-consumer.component.html',
  styleUrls: ['./template-consumer.component.css']
})
export class TemplateConsumerComponent implements OnInit {
  templates: QRTemplateInfo[] = [];
  selectedTemplateId: number | null = null;
  showError: boolean = false;
  constructor(
    private templateService: TemplateService,
    private router: Router,
    private formService: FormService
    
  ) {}


  ngOnInit(): void {
    this.templateService.getTemplates().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.templates = data; 
          console.log(this.templates);
        } else {
          console.error(data.message); 
        }
      },
      error: (error) => {
        console.error('Failed to fetch templates:', error);
      },
    });
  }
  
  onTemplateSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTemplateId = +selectElement.value;
    console.log('Selected Template ID:', this.selectedTemplateId);
  }
  onAdd(): void {
    this.showError = false;
    if (this.selectedTemplateId) {
      const id: Number = this.selectedTemplateId;
      this.formService.clearStoredData();
      this.router.navigate(['/dynamic-form'], { state : {id}});
    } else {
      this.showError = true;
    }
}
}

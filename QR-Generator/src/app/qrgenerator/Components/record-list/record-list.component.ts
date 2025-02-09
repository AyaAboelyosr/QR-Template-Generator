import { Component, ViewChild } from '@angular/core';
import { FormService } from '../../services/form.service';
import { RecordService } from '../../services/record.service';
import { RecordListItem } from '../../viewmodels/record-list-item';
import { Router } from '@angular/router';
import { TemplateService } from '../../services/template-service';
import { ListStateService } from '../../services/list-state.service';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent {
 
  items: RecordListItem[] = [];
  paginatedItems: RecordListItem[] = [];
  cols = [
    { prop: 'recordId', name: 'Record ID' },  
    { prop: 'templateTitle', name: 'Template' },
    { prop: 'actions', name: 'Actions' }
  ];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  isModalOpen: boolean = false; // Controls modal visibility
  recordIdToDelete: number | null = null; 

  constructor(
    private formService: FormService,
    private recordService: RecordService,
    private router: Router,
    private templateService: TemplateService,
    private listStateService: ListStateService
  ) {}

  ngOnInit(): void {
    const savedState = this.listStateService.getState();
    this.currentPage = savedState.currentPage;
    this.itemsPerPage = savedState.itemsPerPage;
    this.loadRecords();
  }
  ngOnDestroy(): void {
    // Save state when leaving the component
    this.listStateService.saveState({
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage
    });
  }
  loadRecords() {

    this.recordService.getRecords().subscribe({
      next: (records) => {
        this.items = records;
        this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        this.updatePaginatedItems();
      },
      error: (error) => {
        console.error('Failed to load records', error);
      }
    });
  }
  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.items.length);
    return `Showing ${start} to ${end} of ${this.items.length} entries`;
  }
  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.items.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedItems();
    // Save state when changing page
    this.listStateService.saveState({
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage
    });
  }

  resetListState() {
    this.listStateService.clearState();
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.updatePaginatedItems();
  }
  previewRecord( recordId: number) {
    
    this.formService.navigateToPreview( recordId);
  }

  updateRecord(recordId: number) {
    this.recordService.getRecordPreview(recordId).subscribe({
      next: (record) => {
        this.templateService.getTemplateById(record.templateId).subscribe({
          next: (template) => {
            // Don't clear all stored data, just set the new data
            this.formService.setTemplate(template);
            this.formService.setFormData({
              sections: record.sections.map(section => ({
                sectionTitle: section.sectionTitle,
                isTableSection: section.isTableSection,
                fields: section.fields,
                values: section.values,
                rows: section.rows
              }))
            });
            
            // Set edit mode
            this.formService.setEditMode(true, recordId);
            
            this.router.navigate(['dynamic-form'], {
              state: {
                id: record.templateId,
                recordId: record.recordId,
                existingData: record,
                isEditMode: true,
                fromList: true  // flag to identify source
              }
            });
          },
          error: (error) => {
            console.error('Failed to load template', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to load record', error);
      }
    });
  }

  deleteRecord(recordId: number) {
    this.recordIdToDelete = recordId;
    this.isModalOpen = true;
  }


  closeModal() {
    this.isModalOpen = false;
    this.recordIdToDelete = null; // Reset the record ID
  }

  // Confirm deletion
  confirmDelete() {
    if (this.recordIdToDelete !== null) {
      this.recordService.deleteRecord(this.recordIdToDelete).subscribe({
        next: () => {
          this.items = this.items.filter(item => item.recordId !== this.recordIdToDelete);
          this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
          this.updatePaginatedItems();
          this.closeModal();
        },
        error: (error) => {
          console.error('Failed to delete record', error);
          this.closeModal(); 
        }
      });
    }
  }
}


import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalComponent } from 'angular-custom-modal';


@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @ViewChild('confirmationModal') confirmationModal!: ModalComponent;

  @Input() title: string = 'Confirmation'; // Default title
  @Input() message: string = 'Are you sure you want to perform this action?'; // Default message

  @Output() confirmed = new EventEmitter<void>(); // Emits when user confirms
  @Output() cancelled = new EventEmitter<void>(); // Emits when user cancels

  open() {
    this.confirmationModal.open(); // Ensure this method exists
  }

  close() {
    this.confirmationModal.close(); // Ensure this method exists
  }

  onConfirm() {
    this.confirmed.emit();
    this.close();
  }

  onCancel() {
    this.cancelled.emit();
    this.close();
  }
}
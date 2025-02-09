import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TemplateConsumerComponent } from './Components/template-consumer/template-consumer.component';
import { DynamicFormComponent } from './Components/dynamic-form/dynamic-form.component';
import { SectionComponent } from './Components/section/section.component';
import { PreviewComponent } from './Components/preview/preview.component';
import { RecordListComponent } from './Components/record-list/record-list.component';
import { QRGeneratorRoutingModule } from './qrgenerator-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QRGeneratorRoutingModule
    
   
  ],
  declarations: [
    TemplateConsumerComponent,
    DynamicFormComponent,
    SectionComponent,
    PreviewComponent,
    RecordListComponent,
   
  ],
  exports: [
    TemplateConsumerComponent 
  ],
 
})
export class QRGeneratorModule { }
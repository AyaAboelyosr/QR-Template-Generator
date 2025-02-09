import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListTemplateComponent } from './components/list-template/list-template.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '../shared/icon/icon.module';
import { QrTemplateGeneratorRoutingModule } from './qrtemplategenerator-routing.module';

import { ModalComponent } from 'angular-custom-modal';
import { TemplateItemComponent } from './components/template-item/template-item.component';


@NgModule({
  declarations: [
    ListTemplateComponent,
   
    TemplateItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    ReactiveFormsModule,
    IconModule,
    QrTemplateGeneratorRoutingModule
   
  ],
  exports: [
    ListTemplateComponent ,
  
    ModalComponent
  ]
})
export class QrtemplategeneratorModule { }
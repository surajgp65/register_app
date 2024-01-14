import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteModalComponent } from '../common-components/delete-modal/delete-modal.component';
import { PageNotFoundComponent } from '../common-components/page-not-found/page-not-found.component';
import { PopUpModalComponent } from '../common-components/pop-up-modal/pop-up-modal.component';
import { RouterModule } from '@angular/router';

// array for import export all modules..
const moduleList = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormsModule,
];

@NgModule({
  declarations: [
    DeleteModalComponent,
    PageNotFoundComponent,
    PopUpModalComponent,
  ],
  imports: [moduleList],
  exports: [moduleList],
})
export class SharedModule {}

import { NgModule } from '@angular/core';

import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatButtonModule } from "@angular/material/button"
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';

const MaterialComponents = [
  MatSlideToggleModule,
  MatButtonModule,
  LayoutModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatMenuModule,
  MatTooltipModule,
  MatStepperModule,
]

@NgModule({
  imports: [
    MaterialComponents
  ],
  exports: [
    MaterialComponents
  ]
})
export class MaterialModule { }

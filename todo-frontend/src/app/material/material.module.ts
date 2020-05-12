import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule,MatDividerModule,MatFormFieldModule,MatInputModule,MatCheckboxModule,MatButtonModule,
        MatIconModule,MatChipsModule} 
       from '@angular/material';

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatDividerModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  exports:[
    MatCardModule,
    MatToolbarModule,
    MatDividerModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule, 
  ]
})
export class MaterialModule { }

import { NgModule } from "@angular/core";
import {CommonModule} from '@angular/common';
// import routing module..
import { AuthRountingModule } from "./auth-routing.module";
// initialise auth components..
import { AuthComponent } from "./auth.component";
import { SharedModule } from "../common-modules/shared.module";
// import share module..


console.log("auth module loaded");

@NgModule({

    declarations:[AuthComponent],
    imports:[
        AuthRountingModule,
        CommonModule,
        SharedModule,
    ]

})

export class AuthModule{}
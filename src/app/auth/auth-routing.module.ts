import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router"
import { AuthComponent } from "./auth.component";


const route:Routes=[
    {path:'', component:AuthComponent}
]

@NgModule({
    imports:[
        RouterModule.forChild(route)
    ],
    exports:[
        RouterModule
    ]
})

export class AuthRountingModule{}
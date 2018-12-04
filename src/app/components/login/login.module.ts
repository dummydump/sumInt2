/**
 * Login page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from "./login-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { GoogleLoginProvider } from "angular4-social-login";
 
 
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("528669994304-bq9ijhv9edipovc7v9lhutt204m668f5.apps.googleusercontent.com")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        SocialLoginModule
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
})
export class LoginModule {
}



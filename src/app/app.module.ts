import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { MenuModule } from './components/menu/menu.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DialogsService } from './services/dialogs.service';
import { AlertComponent } from './components/custom/alert-component/alert-component';
import { AlertService } from './services/alert.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule} from '@angular/common/http';
import { CoolStorageModule } from 'angular2-cool-storage';
import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angular4-social-login";
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

import { MomentModule } from 'angular2-moment';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('528669994304-bq9ijhv9edipovc7v9lhutt204m668f5.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule, 
    HttpModule,
    MomentModule,
    BrowserAnimationsModule, 
    ModalModule.forRoot(),
    BootstrapModalModule,
    AppRoutingModule,
    NgxSpinnerModule,
    HttpClientModule,
    CoolStorageModule,
    SocialLoginModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.rectangleBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#000', 
      secondaryColour: '#000', 
      tertiaryColour: '#000'
  })
  ],
  providers: [DialogsService, AlertService, {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
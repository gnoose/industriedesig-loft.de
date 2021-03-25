import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent, LoginDialogBox, RegisterDialogBox, InitDialogBox, VideoTutorialDialogBox, DeleteDialogBox, EmailDialogBox } from './components/menu/menu.component';

import { MatCardModule, MatButtonModule, MatInputModule, MatSelectModule, MatGridListModule, MatSliderModule, MatDialogModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageComponent, ForgottenPassword } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { AuthGuard } from './auth-guard.guard';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginPageComponent,
    RegisterPageComponent,
    LoginDialogBox,
    RegisterDialogBox,
    InitDialogBox,
    VideoTutorialDialogBox,
    DeleteDialogBox,
    EmailDialogBox,
    ForgottenPassword
  ],
  imports: [
    MatGridListModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    FormsModule,
    AppRoutingModule,
    MatDialogModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  entryComponents: [MenuComponent, LoginDialogBox, RegisterDialogBox, InitDialogBox, VideoTutorialDialogBox, DeleteDialogBox, EmailDialogBox, ForgottenPassword],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

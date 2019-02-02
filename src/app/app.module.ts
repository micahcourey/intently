import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { routing } from './app.routing';

// Firebase Modules
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

// Services
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

// Guards
import { AuthGuard } from './auth.guard'
import { UserResolver } from './home-page/user.resolver';

// Material Components
import {
  MatButtonModule, 
  MatFormFieldModule, 
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule,
  MatCardModule,
  MatDividerModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatIconModule,
  MatToolbarModule,
  MatListModule,
  MatExpansionModule,
  MatDialogModule,
  MatSelectModule,
  MatTableModule
} from '@angular/material';

// App Components
import { AppComponent } from './app.component';
import { LoginPageComponent, ResetPasswordDialogComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ActivityEditorComponent } from './home-page/activity-editor/activity-editor.component';
import { GoalTrackerComponent, GoalDialogComponent } from './home-page/goal-tracker/goal-tracker.component';
import { MonthlyViewerComponent } from './home-page/monthly-viewer/monthly-viewer.component';
import { SignupPageComponent } from './signup-page/signup-page.component'

const routes: Routes = [ ];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    ActivityEditorComponent,
    GoalTrackerComponent,
    GoalDialogComponent,
    ResetPasswordDialogComponent,
    MonthlyViewerComponent,
    SignupPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    routing,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule
  ],
  providers: [
    UserService,
    AuthService,
    AuthGuard,
    UserResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [GoalDialogComponent, ResetPasswordDialogComponent]
})
export class AppModule { }

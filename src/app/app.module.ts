import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, IslamicI18n } from './app.component';
import { NgbDatepickerI18n, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule, } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbIconModule, NbLayoutDirection, NbLayoutModule, NbRadioModule, NbSelectModule, NbSidebarModule, NbSidebarService, NbTabsetModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';
@NgModule({
  declarations: [
    AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatCommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    //default
    NbThemeModule.forRoot({ name: 'dark' }, [], [], NbLayoutDirection.RTL),
    NbLayoutModule,
    NbButtonModule,
    NbCardModule,
    NbRadioModule,
    NbAccordionModule,
    MatProgressSpinnerModule,
    NgbDatepickerModule,
    MatBottomSheetModule,
    MatListModule,
    MatInputModule,
    MatSnackBarModule,
    MatBadgeModule,
    NbSidebarModule,
    NbTabsetModule,
    NbIconModule,
    MatSliderModule,
    NbToastrModule.forRoot(),
  ],
  providers: [
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }, NbSidebarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
//https://akveo.github.io/react-native-ui-kitten/

import { ModuleWithProviders, enableProdMode } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENT IMPORTS
import { AppComponent } from './app/components/app/app.component';
import { HomeComponent } from './app/components/home/home.component';
import { PatientComponent } from './app/components/patient/patient.component';
import { ConditionsComponent } from './app/components/conditions/conditions.component';
import { TimelineComponent } from './app/components/timeline/timeline.component';
import { TimelinePopupComponent } from './app/components/timeline_popup/timeline_popup.component';
import { ObservationsComponent } from './app/components/observations/observations.component';
import { CarePlanComponent } from './app/components/carePlan/carePlan.component';
import { HoverBoxComponent } from "./app/components/hoverBox/hoverBox.component";
import { LoadingAnimation } from './app/components/loadingAnimation/loadingAnimation.component';
import { DoctorNoteComponent } from './app/components/doctorNote/doctorNote.component';
import { AccountComponent } from './app/components/account/account.component';
import { ToolbarComponent } from './app/components/toolbar/toolbar.component';
import { TripleListComponent } from './app/components/tripleList/tripleList.component';
import { ObservationRecursive } from './app/components/observationRecursion/observationRecursion.component';
import { AddObservation } from './app/components/addObservation/addObservation.component';
import { Favorites } from './app/components/favorites/favorites.component';
import { ObservationRecursiveChart } from './app/components/observationRecursionChart/observationRecursionChart.component';
import { MedicationsComponent } from './app/components/medications/medications.component';
import { ConditionsChartComponent } from './app/components/conditionsChart/conditionsChart.component';
import { ColumnStateSwitcherComponent } from './app/components/columnStateSwitcher/columnStateSwitcher.component';
import { NewCondition } from './app/components/newCondition/newCondition.component';
import { FormBuilder } from './app/components/form-builder/form-builder.component'
import { ContextMenuComponent } from './app/components/contextMenu/contextMenu.component';
import { CarePlanDisplay } from './app/components/carePlanDisplay/carePlanDisplay.component';
import { NoteNavigationComponent } from './app/components/noteNavigation/noteNavigation.component';
import { AccordionRecursion } from './app/components/accordionRecursion/accordionRecursion.component';
import { ConditionsDisplay } from './app/components/conditionsDisplay/conditionsDisplay.component';
import { HistoricalTrendsComponent } from './app/components/historicalTrends/historicalTrends.component';
import { ObservationsDisplay } from './app/components/observationsDisplay/observationsDisplay.component';

// SERVICE IMPORTS
import { CookieService } from 'ngx-cookie-service';
import { EncounterService } from './app/services/encounter.service';
import { FhirService } from './app/services/fhir.service';
import { PatientService } from './app/services/patient.service';
import { ConditionService } from './app/services/condition.service';
import { CarePlanService } from './app/services/carePlan.service';
import { ObservationService } from './app/services/observation.service';
import { MapService } from './app/services/map.service';
import { DoctorService } from './app/services/doctor.service';
import { SmartService } from './app/services/smart.service';
import { HistoricalTrendsService } from './app/services/historicalTrends.service';
import { ScratchPadService } from './app/services/scratchPad.service';
import { ToolBarService } from './app/services/toolbar.service';
import { AssociationService } from './app/services/association.service';

import { MomentModule } from 'ngx-moment';
import { NgxChartsModule } from '@swimlane/ngx-charts';


enableProdMode();


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormCreatorModule } from './app/modules/form.module';

const appRoutes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'trends', component: HistoricalTrendsComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: HomeComponent }
]
const appRoutingProviders: any[] = [];
const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
  imports: [
    FormCreatorModule,
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    MomentModule,
    NgxChartsModule,
    BrowserAnimationsModule,
  ],
  declarations: [ // Components and Directives
    AppComponent,
    HomeComponent,
    PatientComponent,
    AccordionRecursion,

    // OBSERVATIONS COLUMN
    ObservationsComponent,
    ObservationsDisplay,

    // CONDITIONS COLUMN
    ConditionsComponent,
    ConditionsDisplay,

    // CAREPLAN COLUMN
    CarePlanComponent,
    CarePlanDisplay,
    MedicationsComponent,

    TimelineComponent,
    TimelinePopupComponent,
    LoadingAnimation,
    FormBuilder,
    AccountComponent,
    DoctorNoteComponent,
    ToolbarComponent,
    TripleListComponent,
    ObservationRecursive,
    AddObservation,
    Favorites,
    ObservationRecursiveChart,
    ConditionsChartComponent,
    ColumnStateSwitcherComponent,
    NewCondition,
    ContextMenuComponent,
    NoteNavigationComponent,
    HoverBoxComponent,
    HistoricalTrendsComponent,
  ],
  providers: [ // Services
    appRoutingProviders,
    CookieService,
    EncounterService,
    FhirService,
    PatientService,
    ObservationService,
    ConditionService,
    MapService,
    DoctorService,
    SmartService,
    CarePlanService,
    HistoricalTrendsService,
    ScratchPadService,
    ToolBarService,
    AssociationService,
  ],
  bootstrap: [AppComponent] // Root Component
})
export class AppModule {
}

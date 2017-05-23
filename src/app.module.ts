import {ModuleWithProviders, enableProdMode} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';



import {AppComponent} from './app/components/app.component';
import {ClientComponent} from './app/components/client.component';
import {HomeComponent} from './app/components/home.component';
import {PatientComponent} from './app/components/patient.component';
import {ConditionsComponent} from './app/components/conditions.component';
import {TimelineComponent} from './app/components/timeline.component';
import {TimelinePopupComponent} from './app/components/timeline_popup.component';
import {ObservationsComponent} from './app/components/observations.component';
import {ActivitiesComponent} from './app/components/activities.component';
import {ActionListComponent} from './app/components/actionList.component';
import {ChartComponent} from './app/components/chart.component';
import {CalendarComponent} from './app/components/calendar.component';
import {DoctorNoteComponent} from './app/components/doctorNote.component';
import {AccountComponent} from './app/components/account.component';
import {ToolbarComponent} from './app/components/toolbar.component';
import {ChartTimelineComponent} from './app/components/chartTimeline.component';



import {LoupeExampleComponent} from './app/components/loupe-example.component'; // TODO Replace with whatever UI components are needed (if any) for Loupe integration.
import {ClientService} from './app/services/client.service';
import {EncounterService} from './app/services/encounter.service';
import {FhirService} from './app/services/fhir.service';
import {HealthCreekService} from './app/services/healthcreek.service';
import {PatientService} from './app/services/patient.service';
import {SearchService} from './app/services/search.service';
import {UserService} from './app/services/user.service';
import {ConditionService} from './app/services/condition.service';
import {TimelineService} from './app/services/timeline.service';
import {ObservationService} from './app/services/observation.service';
import {MapService} from './app/services/map.service';
import {LoupeService} from './app/services/loupe.service';
import {CsiroService} from './app/services/csiro.service';
import {DoctorService} from './app/services/doctor.service';
import {SmartService} from './app/services/smart.service';
import {CookieService} from 'angular2-cookie/core';


import {MomentModule} from 'angular2-moment';


enableProdMode();


import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { Md5 } from 'ts-md5/dist/md5';
import { CalendarModule } from 'angular-calendar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LineChartComponent } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgGridModule } from 'angular2-grid';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'account', component: AccountComponent }
]
const appRoutingProviders: any[] = [];
const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


@NgModule({
    imports: [
        BrowserModule,
        routing,
        FormsModule,
        HttpModule,
		    MomentModule,
        ChartsModule,
        NgxChartsModule,
        BrowserAnimationsModule,
        CalendarModule.forRoot(),
		    NgGridModule
    ],       // module dependencies
    declarations: [
        AppComponent,
        ClientComponent,
        HomeComponent,
        PatientComponent,
        ObservationsComponent,
        ConditionsComponent,
        ActivitiesComponent,
        TimelineComponent,
        TimelinePopupComponent,
        ActionListComponent,
		    LoupeExampleComponent,
        ChartComponent,
        AccountComponent,
        DoctorNoteComponent,
        CalendarComponent,
        ToolbarComponent,
        ChartTimelineComponent
    ],   // components and directives
    providers: [
        appRoutingProviders,
        ClientService,
        EncounterService,
		FhirService,
		HealthCreekService,
        PatientService,
        SearchService,
        ObservationService,
        ConditionService,
        UserService,
        TimelineService,
        MapService,
		LoupeService,
        CsiroService,
        DoctorService,
        SmartService,
        CookieService
    ],                    // services
    bootstrap: [AppComponent]     // root component
})
export class AppModule {
}

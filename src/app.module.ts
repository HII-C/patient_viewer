import {ModuleWithProviders, enableProdMode} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ApiComponent} from './app/components/api.component';
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

import {LoupeExampleComponent} from './app/components/loupe-example.component'; // TODO Replace with whatever UI components are needed (if any) for Loupe integration.

import {ClientService} from './app/services/client.service';
import {EncounterService} from './app/services/encounter.service';
import {ServerService} from './app/services/server.service';
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
import {OpenMRSService} from './app/services/openmrs.service';

import {MomentModule} from 'angular2-moment';

enableProdMode();


import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'api', component: ApiComponent }
]
const appRoutingProviders: any[] = [];
const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


@NgModule({
    imports: [
        BrowserModule,
        routing,
        FormsModule,
        HttpModule,
		MomentModule
    ],       // module dependencies
    declarations: [
        ApiComponent,
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
		LoupeExampleComponent

    ],   // components and directives
    providers: [
        appRoutingProviders,
		ServerService,
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
    OpenMRSService
    ],                    // services
    bootstrap: [AppComponent]     // root component
})
export class AppModule {
}

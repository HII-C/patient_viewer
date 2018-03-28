import {Component, Input, ElementRef, Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { PatientComponent } from '../components/patient.component';

@Component({
    selector: 'allergyHover',
    templateUrl: '/allergyHover.html'
})

@Injectable()

export class AllergyHoverComponent {
    // // The data passed into the menu from wherever it was triggered.
    //allergies doesn't need this. we can import data directly into this component
    data: any = null;
    //
    visible: boolean = false;
    top: string = '0px';
    left: string = '0px';
    allAllergies2: string = this.patientComponent.allAllergies;

    // Observable subscription to document hover
    hoverSubscription: any = null;

    constructor(
        private ref: ElementRef,
        private patientComponent: PatientComponent) { }

    private handleDocHover(event) {
        // Hide the menu if the user hovers outside of it.
        if (!this.ref.nativeElement.contains(event.target)) {
            this.hide(null);
        }
    }
    //REMOVE EXTRANEOUS CODE COPIED FROM CONTEXTMENU.COMPONENT.TS
    // Show the menu.
    public show(data, event) {
        this.data = data; //set data to allergies by passing in allergy as a param of the funct when called in the pug

        // Set the location of the textbox to where the user clicked.
        this.top = event.pageY + 'px';
        this.left = event.pageX + 'px';

        // Subscribe to document click events.
        this.hoverSubscription = Observable.fromEvent(document, 'hover')
            .subscribe((event) => {
                this.handleDocHover(event);
            });

        this.visible = true;
    }

    // Hide the menu.
    private hide(event) {
        if (event) {
            event.preventDefault();
        }

        // Unsubscribe from document click events.
        this.hoverSubscription.unsubscribe();
        this.hoverSubscription = null;

        // Hide the menu and reset the associated data.
        this.visible = false;
        this.data = null;
    }
}

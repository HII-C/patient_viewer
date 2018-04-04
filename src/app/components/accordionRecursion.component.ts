/*
    Description: This file creates the accordion substructure per the data
    Date: 3/19/18
    Version: 1.0
    Creator: Steven Tran
*/

import { Component, Input, Output } from '@angular/core';


@Component({
    selector: 'accordionRecursion',
    templateUrl: '/accordionRecursion.html'
})
export class AccordionRecursion {

    /* This component takes in the data at the current level of the accordion structure:
    Note that the structure of the data should be as follows:
        {[
            category: string,
            subheading: boolean,
            subs: [array of the same 4 headings here] // null if subheadings is false
            data: [array of the list of conditions for that level] // null if subheadings is true
        ]}
    */
    @Input() levelData: any;

    // This is the state of the column: it controls how the data is displayed inside of the according
    @Input() columnNum: number;

    // This is the current level of recursion (used for the display)
    @Input() levelNum: number;

    // for testing purposes
    @Input() firstIteration: number;

    // Parsed data according to the above data schema 
    parsedData: any;
    loadFinished: boolean = false;

// ===============================================================================================================================================
// ================================================================== EVENT METHODS ==============================================================
// ==================================================================---------------==============================================================

    constructor() {
        
    }

    // When the component is first initialized
    ngOnChanges(){
        if (this.firstIteration == 1){
            // reconstruct the data for now
            if (this.columnNum == 0)
                this.reconstructData(this.levelData);
            else if (this.columnNum == 1){
                this.reconstructDataObservations(this.levelData);
            }
            else if (this.columnNum == 2)
                this.reconstructDataFindings(this.levelData);
        } else {
            this.parsedData = this.levelData;
        }

        this.loadFinished = true;
    }


// ===============================================================================================================================================
// ================================================================== UTILITY METHODS ==============================================================
// ==================================================================---------------==============================================================

    // NOTE: The current component uses this function to rebuild the data into correct structure, but in practice, this function should not be used
    // since the data should already in the correct model format (described above levelData)
    reconstructData(arrData: any) {
        var reconstructedObject = [{
            category: "Chief Complaint",
            subheadings: false,
            subs: null,
            data: arrData
        }, 
        {
            category: "Active Problems",
            subheadings: false,
            subs: null,
            data: arrData
        },
        {
            category: "Inactive Problems",
            subheadings: false,
            subs: null,
            data: arrData
        },
        {
            category: "Allergies/Precautions",
            subheadings: false,
            subs: null,
            data: arrData
        },
        {
            category: "Preventions/Exposures",
            subheadings: false,
            subs: null,
            data: arrData
        },
    ];

    this.parsedData = reconstructedObject;
    }

    reconstructDataObservations(arrData: any){
        var reconstructedObject = [
        {
            category: "Vitals",
            subheadings: true,
            subs: [{
                category: "Weight",
                subheadings: false,
                subs: null,
                data: arrData
            }],
            data: null
        }];

        this.parsedData = reconstructedObject;
    }

    reconstructDataFindings(arrData: any) {
        var reconstructedObject = [{
            category: "Medication",
            subheadings: false,
            subs: null,
            data: arrData
        }, 
        {
            category: "Procedures",
            subheadings: false,
            subs: null,
            data: arrData
        },
        {
            category: "In-Progress Tests",
            subheadings: false,
            subs: null,
            data: arrData
        },
        {
            category: "Dietary Plan",
            subheadings: false,
            subs: null,
            data: arrData
        },
        {
            category: "Exercise Plan",
            subheadings: false,
            subs: null,
            data: arrData
        },
    ];

    this.parsedData = reconstructedObject;
    }
}
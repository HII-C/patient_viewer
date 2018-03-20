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

    // Parsed data according to the above data schema 
    parsedData: any;
    loadFinished: boolean = false;

// ===============================================================================================================================================
// ================================================================== EVENT METHODS ==============================================================
// ==================================================================---------------==============================================================

    constructor() {
        
    }

    // When the component is first initialized
    ngOnInit(){
        // reconstruct the data for now
        this.reconstructData(this.levelData);
        // this.parsedData = this.levelData;
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
}
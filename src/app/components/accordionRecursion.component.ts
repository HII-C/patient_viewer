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
                this.reconstructDataConditions(this.levelData);
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
    reconstructDataConditions(arrData: any) {  
        var reconstructedObject = this.addCategoriesConditions(arrData);
        this.parsedData = reconstructedObject;
    }

    addCategoriesConditions(arrData: any){
        // For conditions, there are guaranteed to be 5 different columns; for now, just filter by active/inactive

        // data sieve
        var dataFilter = 
        {
            'Chief Complaint': [],
            'Active Problems': [],
            'Inactive Problems': [],
            'Allergies/Precautions' : [],
            'Preventions/Exposures' : []
        };

        // Filter each condition into a category based on the data
        for (var i = 0 ; i < arrData.length; i++){
            if (arrData[i].clinicalStatus == "active"){
                dataFilter['Active Problems'].push(arrData[i]);
            } else if (arrData[i].clinicalStatus == "inactive"){
                dataFilter['Inactive Problems'].push(arrData[i]);
            }
        }

        // then reconstruct the object
        var reconstructedObject = [];

        // for each category
        for (var key in dataFilter){
            if (dataFilter.hasOwnProperty(key)){
                var newObj = 
                {
                    category: key,
                    subheadings: false,
                    subs: null,
                    data: dataFilter[key]
                };

                reconstructedObject.push(newObj);
            }
        }        

        return reconstructedObject;
    }

    // ================================= RECONSTRUCT DATA OBSERVATIONS =========================

    reconstructDataObservations(arrData: any){
        // reconstruct then set the passed data
        var reconstructedObject = this.addCategoriesObservations(arrData);
        this.parsedData = reconstructedObject;
    }

    // Populate the Observations list with categories (Need to migrate this to the service later)
    // The categories are stored inside of the object already
    addCategoriesObservations(arrData: any){

        // hash out duplicates using a javscript object
        var hash = {};

        for (var i = 0 ; i < arrData.length; i++){
            var currCategory = arrData[i].category[0].text;

            // ignore if this category has no valueQuantity field
            if (!arrData[i].valueQuantity)
                continue;

            // only push new if not in hashset
            if (!hash[currCategory]){
                hash[currCategory] = [];
                hash[currCategory].push(arrData[i]);
            } else {
                hash[currCategory].push(arrData[i]);
            }
        }

        // then reconstruct the object
        var reconstructedObject = [];

        // for each category
        for (var key in hash){
            if (hash.hasOwnProperty(key)){
                var newObj = 
                {
                    category: key,
                    subheadings: false,
                    subs: null,
                    data: hash[key]
                };

                reconstructedObject.push(newObj);
            }
        }        

        return reconstructedObject;
    }

    // ================================ RECONSTRUCT DATA FINDINGS ======================

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
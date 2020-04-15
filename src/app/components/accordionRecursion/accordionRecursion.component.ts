import { Component, Input, Output } from '@angular/core';
import { ObservationService } from '../../services/observation.service';
import { ColumnType } from '../../utils/columnType.enum';
import { Condition } from '../../models/condition.model';
import { Observation } from '../../models/observation.model';
import { CarePlan } from '../../models/carePlan.model';
import { componentFactoryName } from '@angular/compiler';

/**
 * A tree structure representing the structure of a column of 
 * conditions, observations, or careplans. For example, a column 
 * may contain several levels of headings before actual items 
 * (like conditions) are displayed.
 */
type LevelNode =  {
    /**
     * The title/heading of the category.
     */
    category: string,

    /**
     * Whether the current level is a leaf (meaning that it just 
     * displays data), or is an inner node containing other children 
     * levels. 
     */
    isLeaf: boolean,
    
    /**
     * If `isLeaf` is false, this contains the children levels of the 
     * node.
     */
    childLevels?: LevelNode[],

    /**
     * If `isLeaf` is true, this contains the items to be displayed.
     */
    items?: Condition[] | Observation[] | CarePlan[]
};

/**
 * Hardcoded categories for the care plans column.
 */
const CARE_PLAN_CATEGORIES = [
    'Medication', 'Procedures', 
    'In-Progress Tests', 'Dietary Plan', 
    'Exercise Plan'
];

@Component({
    selector: 'accordionRecursion',
    templateUrl: './accordionRecursion.html'
})
export class AccordionRecursion {
    /**
     * Makes the ColumType enum accessible from the template.
     */
    ColumnType = ColumnType;

    /**
     * The type of column (conditions, observations, or careplans).
     */
    @Input() columnType: ColumnType;

    /**
     * The list of items (conditions, observations, or careplans) 
     * to display.
     */
    @Input() items?: Condition[] | Observation[] | CarePlan[];

    /**
     * The current level or depth. For example, 0 represents 
     * the top level, and 1 represents directly below 
     * top-level headings.
     */
    @Input() level: number;

    /**
     * Representation of the current level of the display in 
     * the tree structure. This is either constructed internally, 
     * or passed directly to the component.
     */
    @Input() levelNodes?: LevelNode[];

    /**
     * Whether the items (conditions, observations, or careplans) 
     * have been loaded yet.
     */
    loadFinished: boolean = false;

    constructor(private observationService: ObservationService) { }

    /**
     * Handle changes to the items (conditions, observations, or 
     * careplans) being displayed.
     */
    ngOnChanges() {
        // Only construct level nodes if items (conditions, careplans, 
        // or observations) are passed to the component. Otherwise, 
        // use the provided levelNodes.
        if (!this.items) {
            return;
        }

        switch(this.columnType) {
            case ColumnType.Conditions: {
                this.levelNodes = this.createConditionsNodes(<Condition[]>this.items);
                break;
            }
            case ColumnType.Observations: {
                console.log('POPULATION OBSRVATIONS COLUMNS');
                this.levelNodes = this.createObservationsNodes(<Observation[]>this.items);
                console.log(this.levelNodes);
                break;
            }
            case ColumnType.CarePlans: {
                this.levelNodes = this.createCarePlansNodes(<CarePlan[]>this.items);
                break;
            }
        }
        this.loadFinished = true;
    }

    /**
     * Create and populate the tree structure of condition categories.
     * 
     * @param conditions The conditions that will be displayed.
     */
    createConditionsNodes(conditions: Condition[]): LevelNode[] {
        let categories: { [key: string]: Condition[] } = {
            'Chief Complaint': [],
            'Active Problems': [],
            'Inactive Problems': [],
            'Allergies/Precautions': [],
            'Preventions/Exposures': []
        };

        // Filter each condition into its respective category.
        categories['Active Problems'] = conditions.filter(c => c.clinicalStatus === 'active');
        categories['Inactive Problems'] = conditions.filter(c => c.clinicalStatus === 'inactive');
        
        // Create LevelNodes for each category.
        return Object.keys(categories).map(cat => {
            return {
                category: cat,
                isLeaf: true,
                items: categories[cat]
            };
        });
    }

    /**
     * Create and populate the tree structure of observation categories.
     * 
     * @param observations The observations that will be displayed.
     */
    createObservationsNodes(observations: Observation[]): LevelNode[] {
        let categories: { [x: string]: Observation[] } = {};

        for (let o of observations) {
            // Check if the observation has data and a category.
            if (o['valueQuantity'] && o['category']) {
                let category = o.category[0].text;
                
                // Add the observation to the matching category.
                let observationsInCategory = categories[category] || [];
                observationsInCategory.push(o);
                categories[category] = observationsInCategory;
            }
        }

        // Create LevelNodes for each category.
        return Object.keys(categories).map(cat => {
            return {
                category: cat,
                isLeaf: true,
                items: categories[cat]
            };
        });
    }

    /**
     * Create and populate the tree structure of careplan categories.
     * 
     * @param carePlans The careplans that will be displayed.
     */
    createCarePlansNodes(carePlans: CarePlan[]): LevelNode[] {
        // Create a LevelNode for each category
        let levels: LevelNode[] = CARE_PLAN_CATEGORIES.map(cat => ({
            category: cat,
            isLeaf: true,
        }));

        // Hardcode all careplans to be placed in the first category.
        levels[0].items = carePlans;
        return levels;
    }
}
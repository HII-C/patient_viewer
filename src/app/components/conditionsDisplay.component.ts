/*
    Description: This file defines the data display for the conditions component
    Date: 3/19/18
    Version: 1.0
    Creator: Steven Tran
*/
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { Condition } from '../models/condition.model';

import { ScratchPadService } from '../services/scratchPad.service';
import { ConditionService } from '../services/condition.service';
import { AssociationService } from '../services/association.service';

import { ContextMenuComponent } from './contextMenu.component';


@Component({
  selector: 'conditionsDisplay',
  templateUrl: '/conditionsDisplay.html'
})
export class ConditionsDisplay {
  // The currently selected condition in the list.
  selected: Condition;

  // Whether the checkbox for checking all conditions is currently checked or not.
  isAllChecked: boolean = false;

  // This is the array of conditions to be displayed
  @Input() conditions: Array<Condition>;
  @Output() conditionSelected: EventEmitter<Condition> = new EventEmitter();

  // Whether this display of conditions is within the scratch pad.
  @Input() scratchPadMode: boolean = false;

  @ViewChild('menu') menu: ContextMenuComponent;


  // ===============================================================================================================================================
  // ================================================================== EVENT METHODS ==============================================================
  // ==================================================================---------------==============================================================

  constructor(
    private scratchPadService: ScratchPadService,
    private conditionService: ConditionService,
    private associationService: AssociationService
  ) { }

  ngOnInit() { }

  //=================================================================== CONTEXT MENU ==============================================================

  // Can only access view child after the view has been initialized.
  ngAfterViewInit() {
    // NOTE: 'exec' functions must be bound to 'this' to access scratchPadService.
    // This is a strange behavior with scoping in Typescript/Javascript.

    // Add options to the context menu shown when right clicking conditions.
    if (this.conditionService.getColumnState() === "scratchpad") {
      // Add 'Remove from Scratch Pad' option.
      this.menu.addOption({
        'icon': 'glyphicon-pencil',
        'text': 'Remove from Scratch Pad',
        'exec': function(condition) {
          // For each condition, if the condition is checked, add the condition to the scratch pad.
          this.scratchPadService.checkedMapConditions.forEach((isChecked, condition) => {
            if (isChecked) {
              this.scratchPadService.removeCondition(condition);
            }
          });
        }.bind(this)
      });
    } else {
      // Add 'Add to Scratch Pad' option.
      this.menu.addOption({
        'icon': 'glyphicon-pencil',
        'text': 'Add to Scratch Pad',
        'exec': function(condition) {
          // For each condition, if the condition is checked, add the condition to the scratch pad.
          this.scratchPadService.checkedMapConditions.forEach((isChecked, condition) => {
            if (isChecked) {
              this.scratchPadService.addCondition(condition);
            }
          });
        }.bind(this)
      });
    }

    this.menu.addOption({
      'icon': 'glyphicon-stats',
      'text': 'Add to Trend Tool',
      'exec': function(condition) {
        console.log(condition);
      }.bind(this)
    });

    this.menu.addOption({
      'icon': 'glyphicon-random',
      'text': 'Open Association Tool',
      'exec': function(condition) {
        console.log(condition);
      }.bind(this)
    });
  }

  // Selects an individual condition (which causes it to be highlighted).
  // This is NOT the same as checking a condition.
  selectCondition(condition: Condition) {
    this.selected = condition;
    this.conditionSelected.emit(this.selected);

    for (let c of this.scratchPadService.totalConditions) {
      c['selected'] = (c.id == this.selected.id);
    }
  }

  // Determine whether a condition is currently checked.
  isConditionChecked(condition: Condition) {
    return this.scratchPadService.checkedMapConditions.get(condition) || false;
  }

  // Determine whether a condition is currently associated (based on associations tool)
  isConditionAssociated(condition: Condition) {
    return this.associationService.associatedMapConditions.get(condition) || false;
  }

  // Check or uncheck all conditions.
  checkAllConditions(checked: boolean) {
    this.isAllChecked = checked;
    for (let condition of this.conditions) {
        this.scratchPadService.checkCondition(checked, condition);
    }
  }
  
  // Check or uncheck an individual condition
  checkCondition(checkedCondition: Condition, checked: boolean) {
    this.scratchPadService.checkCondition(checked, checkedCondition);

    // When an individual condition is checked, the "check all" checkbox should be unchecked.
    this.isAllChecked = false;
  }

  expand(parent: string) {
    for (let c of this.conditions) {
      if (c.parent == parent) {
        c.isVisible = true;
        c.parent = "";
        c.isParent = false;
      }
    }
  }
  printmsg(condition: Condition) {
      console.log(condition);
  }

  getDateString(c: Condition) {
    let d = new Date(c.onsetDateTime);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
}

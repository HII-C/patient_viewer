import {Component} from '@angular/core';

@Component({
  selector: 'noteNavigation',
  templateUrl: '/noteNavigation.html',

})

export class NoteNavigationComponent {

    toggleSideNote() {
        document.getElementById("sideNote").style.width = "32%";
    }

    closeSideNote() {
        document.getElementById("sideNote").style.width = "0px";
        if (document.getElementById("sideNote").style.width == "0px")
        {
            document.getElementById("progressNote").style.width = "0px";
            document.getElementById("finalNote").style.width = "0px";
        }

    }

    toggleProgressNote() {
        document.getElementById("sideNote").style.width = "32%";
        document.getElementById("progressNote").style.width = "34%";
    }

    closeProgressNote() {
        document.getElementById("progressNote").style.width = "0px";
        if (document.getElementById("progressNote").style.width == "0px")
        {
            document.getElementById("finalNote").style.width = "0px";
        }
    }

    toggleFinalNote() {
        document.getElementById("sideNote").style.width = "33%";
        document.getElementById("progressNote").style.width = "34%";
        document.getElementById("finalNote").style.width = "33%";
    }

    closeFinalNote() {
        document.getElementById("finalNote").style.width = "0px";
    }
}

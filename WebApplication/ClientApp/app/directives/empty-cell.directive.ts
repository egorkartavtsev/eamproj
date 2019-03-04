import { Directive, Input, ElementRef } from '@angular/core';

@Directive({ selector: '[emptyCell]' })
export class EmptyCellDirective {

    constructor(
        private element: ElementRef
    ) { }

    @Input() set emptyCell(cell: string) {
        if (cell !== "") {
            this.element.nativeElement.style.fontWeight = "bold";
            //this.element.nativeElement.style.backgroundColor = "#a3c1c9";
            //this.element.nativeElement.style.borderColor = "#93b1b9";
        }
    }
}
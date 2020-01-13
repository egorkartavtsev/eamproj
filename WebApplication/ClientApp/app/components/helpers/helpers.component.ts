import { Input, Output, Component, EventEmitter } from '@angular/core';

@Component({
    selector: 'msg-comp',
    templateUrl: './message.html'
})
export class MessageComponent {
    @Input() text: string;
    @Input() stat: string;
    @Output() onClose = new EventEmitter<string>();
}
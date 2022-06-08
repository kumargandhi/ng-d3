import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
    title?: string;
    closeBtnName?: string;

    constructor(public bsModalRef: BsModalRef) {}

    ngOnInit(): void {
        // do nothing
    }
}

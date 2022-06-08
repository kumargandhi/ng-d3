import { Component, OnInit } from '@angular/core';
import { Header_Menu } from '../../constants';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { InfoComponent } from '../info/info.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    readonly Header_Menu = Header_Menu;
    bsModalRef?: BsModalRef;
    constructor(private modalService: BsModalService) {
        // do nothing for now
    }

    ngOnInit(): void {
        // do nothing for now
    }

    onInfoButtonClick() {
        const initialState: ModalOptions = {
            initialState: {
                title: 'Info',
            },
        };
        this.bsModalRef = this.modalService.show(InfoComponent, initialState);
        this.bsModalRef.content.closeBtnName = 'Close';
    }
}

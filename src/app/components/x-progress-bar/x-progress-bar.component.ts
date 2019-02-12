import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'x-progress-bar',
    templateUrl: './x-progress-bar.html',
})
export class XProgressBarComponent implements OnInit {
    @Input()
    private _show: boolean;
    public get show(): boolean {
        return this._show;
    }
    public set show(value: boolean) {
        this._show = value;
    }

    ngOnInit(): void {
        this.show = true;
    }
}

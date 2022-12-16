import {
    Component,
    ElementRef,
    OnInit,
    OnDestroy,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import * as d3 from 'd3v6';
import { TREE_MAP_DATA } from './data';

@Component({
    selector: 'app-tree-map',
    templateUrl: './tree-map.component.html',
    styleUrls: ['./tree-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeMapComponent implements OnInit, OnDestroy {
    private width = 700;
    private height = 400;
    private margin = { top: 20, right: 20, bottom: 35, left: 20 };

    private _chart = {
        svg: null,
        svgInner: null,
        tooltip: null,
    };

    data = TREE_MAP_DATA;

    @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

    constructor(private _cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.initializeChart();
        this.drawChart();
        this._cd.markForCheck();
    }

    public ngOnChanges(changes): void {
        if (changes.hasOwnProperty('data') && this.data) {
            console.log(this.data);
            this.initializeChart();
            this.drawChart();

            window.addEventListener('resize', () => this.drawChart());
        }
    }

    private initializeChart(): void {
        // Remove elements if already exist
        d3.select('#chartTooltip').selectAll('*').remove();

        this._chart.svg = d3
            .select('#line')
            .select('svg')
            .attr('height', this.height + this.margin.top);
        this._chart.svgInner = this._chart.svg
            .append('g')
            .style(
                'transform',
                `translate(${this.margin.left}px, ${this.margin.top}px)`
            );

        this._chart.tooltip = d3
            .select('body')
            .append('div')
            .attr('id', 'chartTooltip')
            .style('display', 'none')
            .style('opacity', 0);
    }

    private drawChart(): void {
        this.width =
            this.chartContainer.nativeElement.getBoundingClientRect().width;
        this._chart.svg.attr('width', this.width);
    }

    ngOnDestroy(): void {
        d3.selectAll('#chartTooltip').remove();
    }
}

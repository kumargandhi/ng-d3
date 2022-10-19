import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import * as d3 from 'd3v6';
import { LINE_CHART_DATA } from './data';

const data = [];

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit {
    private width = 700;
    private height = 400;
    private margin = { top: 20, right: 20, bottom: 35, left: 40 };

    private _chart = {
        svg: null,
        svgInner: null,
        xAxis: null,
        yAxis: null,
        xScale: null,
        yScale: null,
        lineGroup: null,
    };

    data = LINE_CHART_DATA;

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
        this._chart.svg = d3
            .select('.linechart')
            .append('svg')
            .attr('height', this.height + this.margin.top);
        this._chart.svgInner = this._chart.svg
            .append('g')
            .style(
                'transform',
                `translate(${this.margin.left}px, ${this.margin.top}px)`
            );

        this._chart.yScale = d3
            .scaleLinear()
            .domain([
                d3.max(this.data, (d) => d.value) + 1,
                d3.min(this.data, (d) => d.value) - 1,
            ])
            .range([0, this.height - 2 * this.margin.left]);

        this._chart.yAxis = this._chart.svgInner
            .append('g')
            .attr('id', 'y-axis')
            .style('transform', 'translate(' + this.margin.left + 'px,  0)');

        this._chart.xScale = d3
            .scaleTime()
            .domain(d3.extent(this.data, (d) => new Date(d.timestamp)));

        this._chart.xAxis = this._chart.svgInner
            .append('g')
            .attr('id', 'x-axis')
            .style(
                'transform',
                'translate(0, ' + (this.height - 2 * this.margin.left) + 'px)'
            );

        this._chart.lineGroup = this._chart.svgInner
            .append('g')
            .append('path')
            .attr('id', 'line')
            .style('fill', 'none')
            .style('stroke', 'red')
            .style('stroke-width', '2px');
    }

    private drawChart(): void {
        this.width =
            this.chartContainer.nativeElement.getBoundingClientRect().width;
        this._chart.svg.attr('width', this.width);

        this._chart.xScale.range([this.margin.left, this.width - 2 * this.margin.left]);

        const xAxis = d3
            .axisBottom(this._chart.xScale)
            .ticks(10)
            .tickFormat(d3.timeFormat('%m / %Y'));

        this._chart.xAxis.call(xAxis);

        const yAxis = d3.axisLeft(this._chart.yScale);

        this._chart.yAxis.call(yAxis);

        const line = d3
            .line()
            .x((d) => d[0])
            .y((d) => d[1])
            .curve(d3.curveMonotoneX);

        const points: [number, number][] = this.data.map((d) => [
            this._chart.xScale(new Date(d.timestamp)),
            this._chart.yScale(d.value),
        ]);

        this._chart.lineGroup.attr('d', line(points));
    }
}

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
import { LINE_CHART_DATA } from './data';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit, OnDestroy {
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
        tooltip: null
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
        // Remove elements if already exist
        d3.select('#chartTooltip').selectAll('*').remove();

        this._chart.svg = d3
            .select('.chart')
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

        this._chart.xScale.range([this.margin.left, this.width - 2 * this.margin.left]);

        const xAxis = d3
            .axisBottom(this._chart.xScale)
            .ticks(10)
            .tickFormat(d3.timeFormat('%m/%d/%y'));

        this._chart.xAxis.call(xAxis);

        const yAxis = d3.axisLeft(this._chart.yScale);

        this._chart.yAxis.call(yAxis);

        const mousemove = function (s, d) {
            //let x0 = this._chart.xScale.invert(s.x);
            let bisectDate = d3.bisector((t) => {
                //console.log('' + t);
                return t['timestamp'];
            }).left;
            let x0 = this._chart.xScale.invert(s.x),
                i = bisectDate(this.data, x0, 1),
                d0 = this.data[i - 1],
                d1 = this.data[i],
                dd = x0 - d0.date > d1.date - x0 ? d1 : d0;
            // console.log('' + d + ', ' + x0);
            if (!dd) {
                return;
            }
            console.log('' + this._chart.xScale(dd.timestamp));
            this._chart.tooltip
                .style('top', s.layerY + 15 + 'px')
                .style('left', s.layerX + 'px')
                // .attr("transform", "translate(" + this._chart.xScale(dd.timestamp) + "," + this._chart.yScale(dd.value) + ")")
                .style('display', 'block')
                .style('opacity', 1)
                .html(
                    `Date: ${dd.timestamp}<br>Value: ${dd.value}`
                );
        };

        const mouseout = function (s, d) {
            this._chart.tooltip.style('display', 'none').style('opacity', 0);
        };

        this._chart.svg.append("rect")
            .attr("class", "overlay")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", 'none')
            .style("pointer-events", 'all')
            .on("mouseout", mouseout.bind(this))
            .on("mousemove", mousemove.bind(this));

        const line = d3
            .line()
            .x((d) => d[0])
            .y((d) => d[1])
            .curve(d3.curveMonotoneX);

        const points: [number, number][] = this.data.map((d) => [
            this._chart.xScale(new Date(d.timestamp)),
            this._chart.yScale(d.value),
        ]);

        this._chart.lineGroup
            .attr('d', line(points));
    }

    ngOnDestroy(): void {
        d3.selectAll('#chartTooltip').remove();
    }
}

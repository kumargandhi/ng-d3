import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    ElementRef,
    OnDestroy,
} from '@angular/core';
import * as d3 from 'd3v6';
import cloneDeep from 'lodash/cloneDeep';
import { DataItemInterface } from '../commom/interfaces/data-item.interface';
import { ChartsDataService } from '../commom/services/charts-data.service';

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements OnInit, OnDestroy {
    @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;
    @Input() chartId: string = 'bar';
    @Input() width: number = 600;
    @Input() height: number = 450;
    _chartData: DataItemInterface[];

    private margin = { top: 20, right: 20, bottom: 35, left: 40 };
    private _chart = {
        svg: null,
        xAxis: null,
        yAxis: null,
        xScale: null,
        yScale: null,
        x: null,
        y: null,
        mainContainer: null,
        bars: null,
        tooltip: null,
        total: 0,
    };

    get barWidth(): number {
        {
            return this.width - this.margin.left - this.margin.right;
        }
    }

    get barHeight(): number {
        {
            return this.height - this.margin.top - this.margin.bottom;
        }
    }

    constructor(
        private _cd: ChangeDetectorRef,
        dataService: ChartsDataService
    ) {
        this._chartData = dataService.getData(22);
        this._chart.total = this._chartData.reduce(
            (sum, it) => (sum += it.abs),
            0
        );
    }

    ngOnInit(): void {
        window.addEventListener('resize', this.resize.bind(this));
        this.initChart();
        this.draw();
        this._cd.markForCheck();
    }

    @Input()
    set chartData(items: DataItemInterface[]) {
        if (items) {
            this._chartData = cloneDeep(items);
            this.draw();
        }
    }

    get chartData(): DataItemInterface[] {
        return this._chartData;
    }

    private initChart() {
        // Remove elements if already exist
        d3.select('#barTooltip').selectAll('*').remove();

        this._chart.svg = d3.select('#bar').select('svg');
        this._chart.xScale = d3.scaleBand();
        this._chart.yScale = d3.scaleLinear();
        this.setSVGDimensions();
        this._chart.mainContainer = this._chart.svg
            .append('g')
            .attr(
                'transform',
                `translate(${this.margin.left}, ${this.margin.top})`
            );
        this._chart.y = this._chart.mainContainer
            .append('g')
            .attr('class', 'axis axis--y');
        this._chart.x = this._chart.mainContainer
            .append('g')
            .attr('class', 'axis axis--x');
        this._chart.tooltip = d3
            .select('body')
            .append('div')
            .attr('id', 'barTooltip')
            .style('display', 'none')
            .style('opacity', 0);
    }

    private setSVGDimensions() {
        const rect = this.chartContainer.nativeElement.getBoundingClientRect();
        this.width = rect.width;
        this._chart.svg.style('width', this.width).style('height', this.height);
    }

    private draw() {
        this.setAxisScales();
        this.drawAxis();
        this.drawBars();
    }

    private setAxisScales() {
        this._chart.xScale = d3.scaleBand();
        this._chart.yScale = d3.scaleLinear();

        this._chart.xScale
            .rangeRound([0, this.barWidth])
            .padding(0.1)
            .domain(this.chartData.map((d) => d.name));
        this._chart.yScale
            .range([this.barHeight, 0])
            .domain([0, Math.max(...this.chartData.map((x) => x.value))]);
        this._chart.xAxis = d3.axisBottom(this._chart.xScale);
        this._chart.yAxis = d3.axisLeft(this._chart.yScale);
    }

    private drawAxis() {
        this._chart.y
            .attr('transform', `translate(0, 0)`)
            .call(this._chart.yAxis);
        this._chart.x
            .attr('transform', `translate(0, ${this._chart.yScale(0)})`)
            .call(this._chart.xAxis);
    }

    private drawBars() {
        const mousemove = function (s, d) {
            const percent =
                (Math.abs(d.abs / this._chart.total) * 100).toFixed(2) + '%';
            this._chart.tooltip
                .style('top', s.layerY + 15 + 'px')
                .style('left', s.layerX + 'px')
                .style('display', 'block')
                .style('opacity', 1)
                .html(
                    `Name: ${d.name}<br>Value: ${d.value}<br>Share: ${percent}`
                );
        };

        const mouseout = function (s, d) {
            this._chart.tooltip.style('display', 'none').style('opacity', 0);
        };

        const calcBarY = (yPos) => {
            return !yPos ? this._chart.yScale(0) - 1 : this._chart.yScale(yPos);
        };
        const calcBarHeight = (yPos) =>
            Math.max(0, this._chart.yScale(0) - calcBarY(yPos));

        this._chart.bars = this._chart.mainContainer
            .selectAll('.bar')
            .remove()
            .exit()
            .data(this.chartData)
            .enter()
            .append('rect')
            .style('fill', '#C3012E')
            .attr('class', 'chart-bar');

        this._chart.bars
            .attr('x', (d) => this._chart.xScale(d.name))
            .attr('y', (d) => this._chart.yScale(d.value))
            .attr('width', this._chart.xScale.bandwidth())
            .attr('height', (d) => calcBarHeight(d.value))
            .on('mouseover', mousemove.bind(this))
            .on('mouseout', mouseout.bind(this));
    }

    private resize() {
        this.setSVGDimensions();
        this.draw();
        this._cd.markForCheck();
    }

    ngOnDestroy(): void {
        d3.selectAll('#barTooltip').remove();
    }
}

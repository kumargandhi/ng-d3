import { Component, OnInit, ChangeDetectionStrategy,
    ChangeDetectorRef, } from '@angular/core';
import { DataItemInterface } from '../commom/interfaces/data-item.interface';
import { ChartsDataService } from '../commom/services/charts-data.service';
import * as d3 from 'd3v6';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements OnInit {
    get height(): number {
        return 300;
    }
    get width(): number {
        return 300;
    }
    radius = 0;
    // Arcs & pie
    private arc: any;
    private pie: any;
    private slices: any;
    private color: any;
    // Drawing containers
    private svg: any;
    private mainContainer: any;
    private outerRadius: number;
    private innerRadius: number = 0.7;
    // Data
    dataSource: DataItemInterface[];

    form: FormGroup;

    constructor(private service: ChartsDataService, private _fb: FormBuilder, private _cd: ChangeDetectorRef) {
        this.form = this._fb.group({
            innerRadius: [this.innerRadius, Validators.compose([Validators.required])],
        });
        this.dataSource = this.service.getData(5, 10);
    }

    ngOnInit(): void {
        this.svg = d3.select('#pie2').select('svg');
        this.setSVGDimensions();
        this.color = d3.scaleOrdinal(d3.schemeCategory10);
        this.mainContainer = this.svg
            .append('g')
            .attr('transform', `translate(${this.radius},${this.radius})`);
        this.pie = d3
            .pie()
            .sort(null)
            .value((d: any) => d.abs);
        this.draw();
    }

    private setSVGDimensions() {
        this.radius = this.outerRadius = Math.min(this.width, this.height) / 2;
        this.innerRadius = this.radius * this.innerRadius;
        this.svg.attr('width', 2 * this.radius).attr('height', 2 * this.radius);
        this.svg
            .select('g')
            .attr(
                'transform',
                'translate(' + this.radius + ',' + this.radius + ')'
            );
    }

    private draw() {
        this.setArcs();
        this.drawSlices();
    }

    private setArcs() {
        this.arc = d3
            .arc()
            .outerRadius(this.outerRadius)
            .innerRadius(this.innerRadius);
    }

    private drawSlices() {
        this.slices = this.mainContainer
            .selectAll('path')
            .remove()
            .exit()
            .data(this.pie(this.dataSource))
            .enter()
            .append('g')
            .append('path')
            .attr('d', this.arc);
        this.slices.attr('fill', (d: any, i: any) => this.color(i));
    }

    reset() {
        const { innerRadius } = this.form.controls;
        this.innerRadius = this.radius * innerRadius.value;
        this.draw();
    }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartsDataService } from '../../services/charts-data.service';
import * as d3 from 'd3v6';
import { DataItemInterface } from '../../interfaces/data-item.interface';

@Component({
    selector: 'app-sample-chart',
    templateUrl: './sample-chart.component.html',
    styleUrls: ['./sample-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SampleChartComponent implements OnInit {
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
    // Data
    dataSource: DataItemInterface[];

    constructor(private service: ChartsDataService) {
        this.dataSource = this.service.getData();
    }

    ngOnInit() {
        this.svg = d3.select('#pie').select('svg');
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
        this.radius = Math.min(this.width, this.height) / 2;
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
            .outerRadius(this.radius)
            .innerRadius(this.radius * 0.75);
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
}

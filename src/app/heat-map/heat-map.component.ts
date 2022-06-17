import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3v6';
import * as _ from 'lodash';
import {
    HEATMAP_COLOR_RANGE,
    HeatMap_Groups,
    HeatMap_Variables,
} from '../commom/constants';
import { AppWindowInfo, getWindowInfo } from '../commom/generics';
import { DataItemInterface } from '../commom/interfaces/data-item.interface';
import { HeatMapDataItemInterface } from '../commom/interfaces/heat-map-data-item.interface';
import { ChartsDataService } from '../commom/services/charts-data.service';

@Component({
    selector: 'app-heat-map',
    templateUrl: './heat-map.component.html',
    styleUrls: ['./heat-map.component.scss'],
})
export class HeatMapComponent implements OnInit {
    @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;
    @Input() chartId: string = 'heatMap';
    @Input() width: number = 600;
    @Input() height: number = 450;
    _chartData: HeatMapDataItemInterface[];

    private margin = { top: 20, right: 20, bottom: 35, left: 40 };
    private _chart = {
        svg: null,
        mainContainer: null,
    };
    
    @ViewChild('mapDiv') mapDiv: any;
    @ViewChild('parentDiv') parentDiv: any;

    tooltipDiv: any;
    element!: HTMLElement;
    heatMapData = {
        heatMapGraphId: 'heatMap',
        daysCount: 30,
        datesStrAsPerRange: '',
        data: [],

    };

    constructor(private service: ChartsDataService) {
        this.heatMapData.data = service.getHeatMapData();
    }

    ngOnInit(): void {}

//    createHeatmapDiv() {
//        // set the dimensions and margins of the graph
//        const widgetWidth =
//            (this.parentDiv.nativeElement.offsetWidth * 85.5) / 100;
//        const widgetHeight = 285; // this.parentDiv.nativeElement.offsetHeight;
//        let heatMapHeight = Math.round(widgetWidth / 3.167);
//        let marginLeft = 30;
//        const margin = { top: 20, right: 0, bottom: 10, left: marginLeft },
//            width = widgetWidth - margin.left - margin.right,
//            height = heatMapHeight - margin.top - margin.bottom,
//            gridSize = Math.floor(width / 24),
//            legendElementWidth = gridSize + 50;
//
//        /**
//         * Remove all the elements in d3 charts if already exist
//         */
//        d3.select('#' + this.heatMapData.heatMapGraphId)
//            .selectAll('*')
//            .remove();
//        d3.select('#' + this.heatMapData.heatMapGraphId + '_legend')
//            .selectAll('*')
//            .remove();
//        d3.select('#treeMapTooltip').selectAll('*').remove();
//
//        /**
//         * Create the tooltip div element to show the tooltip
//         */
//        if (!this.tooltipDiv) {
//            this.tooltipDiv = d3
//                .select('body')
//                .append('div')
//                .attr('id', 'treeMapTooltip');
//        }
//
//        /**
//         * Mouse over function handler for the treemap nodes
//         * Here we highlight the circle with the box shadow css
//         */
//        const mouseover = function () {
//            d3.select(this).style('stroke', 'black');
//        };
//
//        /**
//         * Mouse out handler
//         * We hide the tooltip div element that we created
//         */
//        const mouseout = function () {
//            d3.select('#treeMapTooltip').classed('hidden', true);
//            d3.select(this).style('stroke', 'none');
//        };
//
//        /**
//         * Mouse move function handler for the treemap nodes
//         * Here we show the tooltip for the nodes and elements we show on the tooltip depends on the component state
//         * @param d
//         */
//        const mousemoveTooltip = function (d) {
//            let xPosition = d.event.pageX + 5;
//            let yPosition = d.event.pageY + 5;
//            const windowInfo = getWindowInfo();
//            if (yPosition + 150 > windowInfo.availableHeight) {
//                yPosition = yPosition - 70;
//            }
//            if (xPosition + 150 > windowInfo.windowWidth) {
//                xPosition = xPosition - 160;
//                const topPadding = 10;
//                yPosition = yPosition - topPadding;
//            }
//            d3.select('#treeMapTooltip')
//                .style('width', '150px')
//                .style('height', '70px')
//                .style('left', xPosition + 'px')
//                .style('top', yPosition + 'px');
//            /**
//             * Remove all the elements in the tooltip if already exist
//             */
//            d3.select('#treeMapTooltip').selectAll('*').remove();
//
//            d3.select('#treeMapTooltip')
//                .append('p')
//                .style('padding-bottom', '10px')
//                .html('<span class=\'tg-value-text\'>Test</span>');
//
//            d3.select('#treeMapTooltip')
//                .append('p')
//                .html("<span class='tg-value-text'>" + d.valueUI + '</span>');
//
//            d3.select('#treeMapTooltip').classed('hidden', false);
//        };
//
//        // append the svg object to the body of the page
//        const svg = d3
//            .select('#' + this.heatMapData.heatMapGraphId)
//            .append('svg')
//            .attr('width', width + margin.left + margin.right)
//            .attr('height', height + margin.top + margin.bottom)
//            .append('g')
//            .attr(
//                'transform',
//                'translate(' + margin.left + ',' + margin.top + ')'
//            );
//
//        let groupNames = Object.values(HeatMap_Groups);
//        let variableNames = Object.values(HeatMap_Variables);
//
//        // Build X scales and axis:
//        const x = d3
//            .scaleBand()
//            .range([0, width])
//            .domain(groupNames)
//            .padding(0.05);
//        svg.append('g')
//            .style('font-size', 12)
//            .style('color', '#ADADAD')
//            .attr('transform', 'translate(0, -5)')
//            .call(d3.axisTop(x).tickSize(0))
//            .select('.domain')
//            .remove();
//
//        // Build Y scales and axis:
//        const y = d3
//            .scaleBand()
//            .range([height, 0])
//            .domain(variableNames)
//            .padding(0.05);
//        svg.append('g')
//            .style('font-size', 12)
//            .style('color', '#ADADAD')
//            .attr('transform', 'translate(-5, 0)')
//            .call(d3.axisLeft(y).tickSize(0))
//            .select('.domain')
//            .remove();
//
//        const myColor = d3
//            .scaleLinear<string>()
//            .range(HEATMAP_COLOR_RANGE)
//            .domain(groupNames);
//
//        // add the squares
//        const cards = svg
//            .selectAll()
//            .data(this.heatMapData.data, function (d) {
//                return d.group + ':' + d.variable;
//            })
//            .enter()
//            .append('rect')
//            .attr('x', function (d) {
//                return x(d.group);
//            })
//            .attr('y', function (d) {
//                return y(d.variable);
//            })
//            .attr('rx', 4)
//            .attr('ry', 4)
//            .attr('value', function (d) {
//                return d.value;
//            })
//            .attr('width', x.bandwidth())
//            .attr('height', y.bandwidth())
//            .attr('fill', 'white')
//            .style('fill', function (d) {
//                if (d.value === null || isNaN(d.value)) {
//                    return '#C3C3C3';
//                }
//                return myColor(d.value);
//            })
//            .style('stroke-width', 2)
//            .style('stroke', 'none')
//            .style('opacity', 0)
//            .on('mouseover', mouseover)
//            .on('mousemove', mousemoveTooltip.bind(this))
//            .on('mouseout', mouseout)
//            .on('mouseleave', mouseout);
//
//        setTimeout(() => {
//            d3.transition()
//                .selectAll('rect')
//                .duration(1000)
//                .style('opacity', 1);
//        }, 100);
//
//        // append the legend svg object to the body of the page
//        const legend = d3
//            .select('#' + this.heatMapData.heatMapGraphId + '_legend')
//            .append('svg')
//            .attr(
//                'transform',
//                'translate(' +
//                    (width -
//                        HEATMAP_COLOR_RANGE.length * legendElementWidth +
//                        margin.left) +
//                    ',' +
//                    (margin.top - 20) +
//                    ')'
//            )
//            .attr('width', legendElementWidth * HEATMAP_COLOR_RANGE.length)
//            .attr('height', 35);
//
//        const domainRange: string[] =
//            groupNames.map((item, index, items) => {
//                const domain = '' + item + ' ' + 'units';
//                if (index === 0) {
//                    return '>' + domain;
//                } else if (index === items.length - 1) {
//                    return '<' + domain;
//                }
//                return '';
//            });
//        legend
//            .selectAll()
//            .data(domainRange, function (d) {
//                return d;
//            })
//            .enter()
//            .append('g')
//            .attr('class', 'g-legend')
//            .append('rect')
//            .attr('x', function (d, i) {
//                return legendElementWidth * i;
//            })
//            .attr('y', 20)
//            .attr('rx', 0)
//            .attr('ry', 0)
//            .attr('width', legendElementWidth)
//            .style('width', '' + legendElementWidth + 'px')
//            .attr('height', 10)
//            .style('height', '10px')
//            .style('fill', function (d, i) {
//                return '' + HEATMAP_COLOR_RANGE[i];
//            });
//
//        legend
//            .selectAll('.g-legend')
//            .append('text')
//            .attr('class', 'g-legend-text')
//            .text(function (d) {
//                return '' + d;
//            })
//            .attr('x', function (d, i) {
//                if (i === 0) {
//                    return 0;
//                }
//                return legendElementWidth * i;
//            })
//            .attr('y', 10)
//            .style('font-size', 11)
//            .style('fill', '#ADADAD');
//
//        legend.exit().remove();
//    }
}

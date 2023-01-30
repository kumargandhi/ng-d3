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
import * as d3Hierarchy from 'd3-hierarchy';
import { AppWindowInfo, getWindowInfo } from '../commom/generics';

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
    private upperLimit = 50;

    private _chart = {
        rootDiv: null,
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
        d3.select('#chartTooltip').selectAll('*').remove();

        const treemap = d3Hierarchy
            .treemap()
            .size([this.width, this.height])
            .padding(1)
            .round(true);

        if (!this._chart.rootDiv) {
            this._chart.rootDiv = d3
                .select('#treeMap')
                .append('div')
                .attr('class', 'treeMap-pos')
                .style('position', 'relative')
                .style(
                    'width',
                    this.width + this.margin.left + this.margin.right + 'px'
                )
                .style(
                    'height',
                    this.height + this.margin.top + this.margin.bottom + 'px'
                )
                .style('left', this.margin.left + 'px')
                .style('top', this.margin.top + 'px');
        }

        const root = d3Hierarchy
            .stratify()
            .parentId(function (d) {
                return d['id'].substring(0, d['id'].lastIndexOf('/'));
            })(this.data)
            .sum((d) => d['value'])
            .sort(function (a, b) {
                return b.height - a.height || b.value - a.value;
            });
        treemap(root);

        const mousemove = function (s, d) {
            let xPosition = s.pageX + 5;
            let yPosition = s.pageY + 5;
            let xOffset = 0;
            const toolTipWidth = 220;
            if (d['x0'] < toolTipWidth) {
                xOffset = (toolTipWidth - d.dx) / 2;
            } else {
                xOffset = ((d['x0'] - toolTipWidth) / 2) * -1;
            }
            const windowInfo: AppWindowInfo = getWindowInfo();
            if (yPosition + 150 > windowInfo.availableHeight) {
                yPosition = yPosition - 150;
            }
            if (xPosition + 250 > windowInfo.windowWidth) {
                xPosition = xPosition - 250;
                yPosition = yPosition - 20;
            }

            d3.select('#chartTooltip').selectAll('*').remove();

            d3.select('#chartTooltip')
                .append('p')
                .html('<span class="label-txt">Avg: </span><span class="label-val">' + d['data']['data']['avg'] + '</span>');
            d3.select('#chartTooltip')
                .style('left', xPosition + 'px')
                .style('top', yPosition + 'px')
                .style('display', 'block')
                .style('opacity', 1);
        };

        const mouseout = function () {
            d3.select('#chartTooltip').style('display', 'none').style('opacity', 0);
            d3.select(this).style('z-index', 'unset');
            d3.select(this).style('box-shadow', '');
        };
        const mouseover = function () {
            d3.select(this).style(
                'box-shadow',
                '0px 0px 9px 2px rgba(102,102,102,0.85)'
            );
            d3.select(this).style('z-index', '1');
        };

        d3.select('.treeMap-pos')
            .selectAll('.node')
            .data(root.leaves())
            .enter()
            .append('div')
            .attr('class', 'node')
            .on('mousemove', mousemove.bind(this))
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .style('left', function (d) {
                return d['x0'] + 'px';
            })
            .style('top', function (d) {
                return d['y0'] + 'px';
            })
            .style('width', function (d) {
                return d['x1'] - d['x0'] + 'px';
            })
            .style('height', function (d) {
                return d['y1'] - d['y0'] + 'px';
            })
            .style('background', this.nodeColor.bind(this))
            .append('div')
            .attr('class', 'node-label')
            .text(function (d) {
                return d['id']
                    .substring(d['id'].lastIndexOf('/') + 1)
                    .split(/(?=[A-Z][^A-Z])/g)
                    .join('\n');
            })
            .style('color', this.textStyle.bind(this))
            .append('div')
            .attr('class', 'node-value');

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
    }

    private nodeColor(d) {
        if (d['data']['data'].hasOwnProperty('avg') && d['data']['data'].avg) {
            return this.shadeColor(d['data']['data'].avg);
        } else {
            return '#F2F2F2';
        }
    }

    private textStyle(d) {
        if (d['data']['data'].hasOwnProperty('avg') && d['data']['data'].avg) {
            if (d['data']['data'].avg > this.upperLimit) {
                return '#FFFFFF';
            } else {
                const percent = d['data']['data'].avg / this.upperLimit;
                if (percent >= 0.8 && percent <= 1.0) {
                    return '#FFFFFF';
                } else {
                    return '#000000';
                }
            }
        }
    }

    private shadeColor(val) {
        if (val > this.upperLimit) {
            return '#C90000';
        } else {
            const percent = val / this.upperLimit;
            if (percent >= 0.0 && percent <= 0.1) {
                return '#FFFFFF';
            } else if (percent >= 0.1 && percent <= 0.2) {
                return '#FFE4E2';
            } else if (percent >= 0.2 && percent <= 0.3) {
                return '#FFD7D3';
            } else if (percent >= 0.3 && percent <= 0.4) {
                return '#FFBDB6';
            } else if (percent >= 0.4 && percent <= 0.5) {
                return '#FFA399';
            } else if (percent >= 0.5 && percent <= 0.6) {
                return '#FF897C';
            } else if (percent >= 0.6 && percent <= 0.7) {
                return '#FF7C6E';
            } else if (percent >= 0.7 && percent <= 0.8) {
                return '#FF6F5F';
            } else if (percent >= 0.8 && percent <= 0.9) {
                return '#FF5542';
            } else if (percent >= 0.9 && percent <= 1.0) {
                return '#FF4834';
            }
        }
    }

    ngOnDestroy(): void {
        d3.selectAll('#chartTooltip').remove();
    }
}

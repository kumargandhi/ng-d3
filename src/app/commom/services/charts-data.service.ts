import { Injectable } from '@angular/core';
import { HeatMap_Groups, HeatMap_Variables } from '../constants';
import { DataItemInterface } from '../interfaces/data-item.interface';
import { HeatMapDataItemInterface } from '../interfaces/heat-map-data-item.interface';

@Injectable({
    providedIn: 'root',
})
export class ChartsDataService {
    private readonly NAMES = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ];

    private readonly MIN_ITEM = 10;
    private readonly MAX_ITEM = 26;

    private readonly MAX_VALUE = 100;

    constructor() {}

    private generateRandomValue(start: number, end: number) {
        return Math.ceil(Math.random() * (end - start) + start);
    }

    getData(
        min: number = this.MIN_ITEM,
        max: number = this.MAX_VALUE
    ): DataItemInterface[] {
        const nbItems = this.generateRandomValue(min, max);
        const samples = [];
        for (let i = 0; i < nbItems; i++) {
            const val = this.generateRandomValue(1, this.MAX_VALUE);
            samples.push({
                name: this.NAMES[i],
                value: val,
                abs: Math.abs(val),
            });
        }
        return samples;
    }

    getHeatMapData(): HeatMapDataItemInterface[] {
        const samples: HeatMapDataItemInterface[] = [];
        const groups = Object.values(HeatMap_Groups);
        const variables = Object.values(HeatMap_Variables);
        groups.forEach((g) => {
            variables.forEach((v) => {
                const val = this.generateRandomValue(1, 100);
                samples.push({
                    group: g,
                    variable: v,
                    value: val,
                });
            });
        });
        return samples;
    }
}

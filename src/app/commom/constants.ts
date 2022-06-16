export const Header_Menu = [
    {
        label: 'Home',
        routerLink: ['home'],
    },
    {
        label: 'Heat map',
        routerLink: ['heat-map'],
    },
    {
        label: 'Bar chart',
        routerLink: ['bar-chart'],
    },
];

export const HEATMAP_COLOR_RANGE = [
    '#F6FAAA',
    '#FEDF8B',
    '#F46B43',
    '#D53E50',
    '#9E0042',
];

export enum HeatMap_Groups {
    Zero = '12a',
    Three = '3a',
    Six = '6a',
    Nine = '9a',
    Twelve = '12p',
    Fifteen = '3p',
    Eighteen = '6p',
    TwentyOne = '9p',
}

export enum HeatMap_Variables {
    Sunday = 'Su',
    Saturday = 'Sa',
    Friday = 'Fr',
    Thursday = 'Th',
    Wednesday = 'We',
    Tuesday = 'Tu',
    Monday = 'Mo',
}

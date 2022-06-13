export class AppWindowInfo {
    windowHeight = 0;

    windowWidth = 0;

    headerHeight = 0;

    availableHeight = 0;
}

export function getWindowInfo(): AppWindowInfo {
    const data = new AppWindowInfo();
    data.windowHeight = window.innerHeight;
    data.windowWidth = window.innerWidth;
    const navbar = document.querySelector('nav.navbar');
    if (!navbar) {
        return new AppWindowInfo();
    }
    data.headerHeight = navbar.clientHeight;
    data.availableHeight = data.windowHeight - data.headerHeight;
    return data;
}

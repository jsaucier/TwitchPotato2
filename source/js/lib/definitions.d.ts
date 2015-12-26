declare var chrome: any;

interface XMLHttpRequest {
    contentType: string;
}

interface HTMLDocument {
    postMessage(message: string, filter: string): void;
}

interface JQuery {
    selector: string;
    cssFade(fadeType: string, callback?: (element: JQuery) => void): JQuery;
    sort(func: (a: HTMLElement, b: HTMLElement) => any);
    scrollToMiddle(element: string);
}

interface StorageInterface {
    hidden: Array<string>;
    useViewPreview: boolean;
    zoom: number;
    quality: TwitchPotato.Quality;
    isMouseEnabled: boolean;
    refreshRate: number;
}

interface InputInterface {
    input: TwitchPotato.Inputs;
    type: TwitchPotato.InputType;
    name: string;
    desc: string;
    code: number;
}

interface Input {
    name: string;
    desc: string;
    type: TwitchPotato.Inputs;
    key?: string;
    keyCode?: number;
    hidden?: boolean;
}

interface Event {
    button: number;
}

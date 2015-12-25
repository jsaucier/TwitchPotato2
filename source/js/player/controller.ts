interface PlayerWindow extends Window {
    pc: Controller;
}

interface PlayerEmbed extends HTMLElement {
    pauseVideo(): void;
    playVideo(): void;
    mute(): void;
    unmute(): void;
    loadStream(stream: string): void;
    loadVideo(video: string): void;
    onlineStatus(): string;
    setVideoTime(time: number): void;
    isPaused(): boolean;
    setQuality(quality: string): void;
    quality(): any;
    togglePlayPause(): void;
    isPlaying(): boolean;
    height: string;
}

interface PlayerActionInfo {
    action: number;
    params: PlayerActionParameters;
}

interface PlayerActionParameters {
    id?: string;
    isVideo?: boolean;
    state?: number;
    viewMode?: number;
    quality?: number;
    isMuted?: boolean;
}

enum PlayerActions {
    ViewMode,
    Load,
    State,
    Mute,
    Quality,
    Position,
    Preview,
    Chat,
    Layout
}

enum PlayerState {
    Playing,
    Stopped
}

enum ViewMode {
    Fullscreen,
    Windowed
}

enum Quality {
    Mobile,
    Low,
    Medium,
    High,
    Source
}

class Controller {

    private _player: PlayerEmbed;
    private _viewMode = ViewMode.Windowed;
    private _isMuted: boolean;
    private _queue: Array<any> = [];
    private _isLoaded = false;
    private _source: any;

    constructor() {
        window.addEventListener('message', (event) => this.OnMessage(event.data, event.source));
        window.addEventListener('resize', () => this.ViewMode());
        this._player = <PlayerEmbed>$('embed')[0];
        this.CheckLoaded();
    }

    OnMessage(data: string, source?: any): void {
        if (this._source === undefined)
            this._source = source;

        // Player not loaded, queue the message.
        if (this._isLoaded === false) {
            this._queue.push(data);
            return;
        }

        var json: PlayerActionInfo = JSON.parse(data);
        var params = json.params;

        switch (json.action) {
            case PlayerActions.Load:
                this.Load(params.id, params.isVideo);
                break;
            case PlayerActions.Mute:
                this.Mute(params.isMuted);
                break;
            case PlayerActions.State:
                this.State(params.state);
                break;
            case PlayerActions.ViewMode:
                this.ViewMode(params.viewMode);
                break;
            case PlayerActions.Quality:
                this.Quality(params.quality);
                break;
            // case PlayerActions.Preview:
            //     this.Preview(params.id, params.isVideo);
            //     break;
            default:
                console.log('Unhandled method: ' + PlayerActions[json.action]);
                break;
        }
        setTimeout(() => this._source.postMessage(data, '*'), 100);
    }

    private ProcessQueue(): void {
        this._isLoaded = true;

        for (var i = 0; i < this._queue.length; i++)
            this.OnMessage(this._queue[i]);
        this._queue = [];
    }

    private CheckLoaded(): void {
        if (this._isLoaded === true) return

        var status = this._player.onlineStatus();

        if (status === 'online')
            setTimeout(() => this.ProcessQueue(), 1000);
        else
            setTimeout(() => this.CheckLoaded(), 100);
    }

    private Mute(mute): void {
        if (mute === true)
            this._player.mute();
        else
            this._player.unmute();

        this._isMuted = mute;
    }

    private State(state: PlayerState): void {

        if (state === PlayerState.Playing)
            this._player.playVideo();
        else if (state === PlayerState.Stopped)
            this._player.pauseVideo();
    }

    private Quality(quality: number): void {
        this._player.setQuality(Quality[quality]);
    }

    // private Preview(channel: string, isVideo: boolean): void {
    //
    //     /** Set the quality to low. */
    //     this.Quality(Quality.Low);
    //
    //     /** Determine if a stream or video is loaded. */
    //     if (isVideo)
    //         this._player.loadVideo(channel);
    //     else
    //         this._player.loadStream(channel);
    //
    //     /** Ensure the video is playing. */
    //     this._player.playVideo();
    //
    //     /** Ensure the video is muted. */
    //     this.Mute(true);
    //
    //     /** Set the quality to low. */
    //     setTimeout(() => this.Quality(Quality.Low), 5000);
    //
    //     /** Enter fullscreen mode. */
    //     //this.SetFullscreen(FullscreenAction.Enter);
    // }

    private Load(id: string, isVideo: boolean): void {

        if (isVideo)
            this._player.loadVideo(id);
        else
            this._player.loadStream(id);
    }

    private ViewMode(viewMode?: ViewMode): void {
        if (viewMode !== ViewMode.Fullscreen)
            this._player.height = '100%';

        var body = document.body;
        var html = document.documentElement;

        var height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight);

        var heightStr = height + '';

        if (viewMode === ViewMode.Fullscreen)
            heightStr = (height + 34) + 'px';
        else if (viewMode === ViewMode.Windowed)
            heightStr = "100%";

        this._player.height = heightStr;

        this._viewMode = viewMode;
    }
}

$(() => {
    var pc = new Controller();
});

//  Some of these are documented, some aren't.

//  Twitch player methods:
//  playVideo, pauseVideo, mute, unmute, fullscreen, loadStream, loadVideo,
//  setQuality, videoSeek, setOauthToken, onlineStatus, isPaused, setVideoTime,
//  adFeedbackDone, setTrackingData, showChromecast, setChromecastConnected,
//  togglePlayPause

//  Twitch player events:
//  chromecastMediaSet, chromecastSessionRequested, chromecastVolumeUpdated,
//  pauseChromecastSession, offline, online, adCompanionRendered, loginRequest,
//  mouseScroll, playerInit, popout, tosViolation, viewerCount, streamLoaded,
//  videoLoaded, seekFailed, videoLoading, videoPlaying, adFeedbackShow

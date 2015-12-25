module TwitchPotato {

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

    export class Player {

        private _isLoaded = false;
        private _id: string;
        private _isVideo: boolean;
        private _number: number;
        private _flashback: string;
        private _webview: WebviewElement;
        private _isMuted = false;
        private _quality: Quality;
        private _state = PlayerState.Playing;
        private _viewMode = ViewMode.Windowed;
        private _position: MultiPosition;
        private _multiLayout: MultiLayout;
        private _container: JQuery;
        private _notifyTimeout: number;
        private _menu: PlayerMenu;

        /** Creates a new instance of player. */
        constructor(num: number, id: string, isVideo: boolean) {

            this._id = id;
            this._isVideo = isVideo;

            $('#players').append($($('#player-template').html().format(num)));

            this._number = num;
            this._container = $('#players .player[number="' + num + '"]');
            this._webview = <WebviewElement>this._container.find('webview')[0];

            var src = 'http://www.twitch.tv/widgets/live_embed_player.swf?volume=100&auto_play=true&';
            src += (!isVideo) ? 'channel=' + id : 'videoId=' + id;
            this._container.find('webview').attr('src', src);

            /** Bind to the contentload event. */
            this._webview.addEventListener('contentload', () => {

                setTimeout(() => {
                    this._webview.executeScript({ file: 'jquery.min.js' });
                    this._webview.executeScript({ file: 'js/player/controller.js' });

                    this._isLoaded = true;

                    this.State(PlayerState.Playing);
                    this.Mute(false);
                    this.Quality(App.Settings.Quality());
                    this.ViewMode(ViewMode.Fullscreen);
                }, 100);
            });

            /** Bind to the console message event. */
            this._webview.addEventListener('consolemessage', (e) => ConsoleMessage(e));
            window.addEventListener('message', (event) => this.OnMessage(event.data));

            this._menu = new PlayerMenu(this);
        }

        Id(): string { return this._id; }
        IsLoaded(): boolean { return this._isLoaded; }
        Container(): JQuery { return this._container; }
        Menu(): PlayerMenu { return this._menu; }

        /** Gets or sets the current multi layout for the player. */
        MultiLayout(layout?: MultiLayout): MultiLayout {
            if (layout !== undefined &&
                this._multiLayout !== layout) {
                this._multiLayout = layout;
                $(this._container)
                    .hide()
                    .attr('multi', MultiLayout[layout])
                    .fadeIn();
            }
            return this._multiLayout;
        }

        /** Gets or sets the number for the player. */
        Number(num?: number): number {
            if (num !== undefined) {
                this._number = num;
                $(this._container).attr('number', num);
            }
            return this._number;
        }

        /** Removes the player's webview from the document. */
        Remove(): void {
            $(this._webview).remove();
        }

        /** Loads the channel or video in the player. */
        Load(id: string, isVideo = false): void {

            this._flashback = (this._id !== id) ? this._id : this._flashback;

            this._id = id;
            this._isVideo = isVideo;

            if (this._isVideo) {
                this.PlayerAction(PlayerActions.Load, { id: id, isVideo: isVideo });
                this.State(PlayerState.Playing);
                this.Mute(false);
                this.ViewMode(ViewMode.Fullscreen);
            }
            else {
                this._isLoaded = false;

                this.PlayerAction(PlayerActions.Load, { id: id, isVideo: isVideo });
                this.State(PlayerState.Playing);
                this.Mute(false);
                this.ViewMode(ViewMode.Fullscreen);
            }
        }

        /** Load the previous channel or video. */
        Flashback(): void {

            if (this._flashback !== undefined)
                this.Load(this._flashback);
        }

        /** Gets or sets the state of the player. */
        State(state?: PlayerState, toggle = false): PlayerState {
            if (state !== undefined) {
                if (toggle &&
                    state === PlayerState.Playing &&
                    this._state === PlayerState.Playing)
                    state = PlayerState.Stopped;
                this.PlayerAction(PlayerActions.State, { state: state });
                if (App.Players.IsPlaying() === false)
                    App.Guide.Toggle(true);
                this._state = state;
            }
            else
                return this._state;
        }

        /** Gets or sets the mute status of the player. */
        Mute(isMuted?: boolean): boolean {
            if (isMuted !== undefined) {
                if (isMuted === null)
                    isMuted = !this._isMuted;
                this.PlayerAction(PlayerActions.Mute, { isMuted: isMuted });
                this._isMuted = isMuted;
            }
            else
                return this._isMuted;
        }

        /** Gets or sets the view mode of the player. */
        ViewMode(viewMode?: ViewMode): ViewMode {
            if (viewMode !== undefined) {
                if (viewMode === ViewMode.Toggle)
                    viewMode = (this._viewMode === ViewMode.Fullscreen) ?
                        ViewMode.Windowed :
                        ViewMode.Fullscreen;
                if (this._viewMode !== viewMode) {
                    this.PlayerAction(PlayerActions.ViewMode, { viewMode: viewMode });
                }
                this._viewMode = viewMode;
            }
            else
                return this._viewMode;
        }

        /** Gets or sets the quality of the player. */
        Quality(quality?: Quality): Quality {
            if (quality !== undefined) {
                this.PlayerAction(PlayerActions.Quality, { quality: quality });
                this._quality = quality;
            }
            else
                return this._quality;
        }

        /** Gets or sets the position of the player. */
        Position(position?: MultiPosition): MultiPosition {

            if (position !== undefined) {
                this._position = position;
                // TODO: Update the player position.
            }

            return this._position;
        }

        /** Highlight the player. */
        Highlight(num: number): void {

            if (num === this._number)
                this._container.addClass('selected');
            else
                this._container.removeClass('selected');

            this._menu.Highlight(num === this._number);
        }

        /** Reloads the player. */
        Reload(): void {

            this._isLoaded = false;
            this._webview.reload();
        }

        /** Executes an action with the given param object on the player. */
        private PlayerAction(action: PlayerActions, params: PlayerActionParameters = {}): void {
            if (!this._webview.contentWindow) {
                setTimeout(() => this.PlayerAction(action, params), 100);
                return;
            }

            var data = {
                action: action,
                params: params
            };

            setTimeout(() => this._webview.contentWindow.postMessage(JSON.stringify(data), '*'), 100);
        }

        OnMessage(data: string): void {
            var json: PlayerActionInfo = JSON.parse(data);
            var params = json.params;

            switch (json.action) {
                case PlayerActions.Mute:
                    var div = this._container.find('#muted');
                    if (params.isMuted === true)
                        div.removeClass('closed');
                    else
                        div.addClass('closed');
                    this._isMuted = params.isMuted;
                    break;
                case PlayerActions.State:
                    this._state = params.state;
                    break;
                case PlayerActions.ViewMode:
                    this._viewMode = params.viewMode;
                    break;
                case PlayerActions.Quality:
                    App.Settings.Quality(params.quality);
                    var div = this._container.find('#quality');
                    div.text(Quality[params.quality]).removeClass('closed');
                    setTimeout(() => div.addClass('closed'), 5000);
                    break;
                default:
                    console.log('Unhandled method: {0}'.format(PlayerActions[json.action]));
                    break;
            }
        }
    }
}

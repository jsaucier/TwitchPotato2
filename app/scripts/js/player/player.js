var TwitchPotato;
(function (TwitchPotato) {
    var Player = (function () {
        function Player(num, id, isVideo) {
            var _this = this;
            this._isLoaded = false;
            this._isMuted = false;
            this._state = TwitchPotato.PlayerState.Playing;
            this._viewMode = TwitchPotato.ViewMode.Windowed;
            this._id = id;
            this._isVideo = isVideo;
            $('#players').append($($('#player-template').html().format(num)));
            this._number = num;
            this._container = $('#players .player[number="' + num + '"]');
            this._webview = this._container.find('webview')[0];
            this.GetPartnerStatus(function () {
                var src = 'http://www.twitch.tv/widgets/live_embed_player.swf?volume=100&auto_play=true&';
                src += (!isVideo) ? 'channel=' + id : 'videoId=' + id;
                _this._container.find('webview').attr('src', src);
            });
            this._webview.addEventListener('contentload', function () {
                _this._webview.executeScript({ file: 'js/Vendor/jquery.min.js' });
                _this._webview.executeScript({ file: 'js/Player/controller.js' });
                _this._isLoaded = true;
                _this.ViewMode(TwitchPotato.ViewMode.Fullscreen);
                _this.Mute(false);
                _this.State(TwitchPotato.PlayerState.Playing);
                _this.Quality(TwitchPotato.App.Settings.quality);
            });
            this._webview.addEventListener('consolemessage', function (e) { return TwitchPotato.ConsoleMessage(e); });
            this._menu = new TwitchPotato.PlayerMenu(this);
        }
        Player.prototype.Id = function () { return this._id; };
        Player.prototype.IsLoaded = function () { return this._isLoaded; };
        Player.prototype.IsPartnered = function () { return this._isPartnered; };
        Player.prototype.Container = function () { return this._container; };
        Player.prototype.Menu = function () { return this._menu; };
        Player.prototype.MultiLayout = function (layout) {
            if (layout !== undefined &&
                this._multiLayout !== layout) {
                this._multiLayout = layout;
                $(this._container)
                    .hide()
                    .attr('multi', TwitchPotato.MultiLayout[layout])
                    .fadeIn();
            }
            return this._multiLayout;
        };
        Player.prototype.Number = function (num) {
            if (num !== undefined) {
                this._number = num;
                $(this._container).attr('number', num);
            }
            return this._number;
        };
        Player.prototype.Remove = function () {
            $(this._webview).remove();
        };
        Player.prototype.Load = function (id, isVideo) {
            var _this = this;
            if (isVideo === void 0) { isVideo = false; }
            this._flashback = (this._id !== id) ? this._id : this._flashback;
            this._id = id;
            this._isVideo = isVideo;
            if (this._isVideo) {
                this.PlayerAction(TwitchPotato.PlayerActions.Load, { id: id, isVideo: isVideo });
                this.State(TwitchPotato.PlayerState.Playing);
            }
            else {
                this._isLoaded = false;
                this.GetPartnerStatus(function (isPartnered) {
                    if (isPartnered) {
                        _this.PlayerAction(TwitchPotato.PlayerActions.Load, { id: id, isVideo: isVideo });
                        _this.State(TwitchPotato.PlayerState.Playing);
                    }
                    else {
                        var src = 'http://www.twitch.tv/widgets/live_embed_player.swf?volume=100&auto_play=true&';
                        src += (!isVideo) ? 'channel=' + id : 'videoId=' + id;
                        _this._container.find('webview').attr('src', src);
                    }
                });
            }
        };
        Player.prototype.Flashback = function () {
            if (this._flashback !== undefined)
                this.Load(this._flashback);
        };
        Player.prototype.State = function (state, toggle) {
            if (toggle === void 0) { toggle = false; }
            if (state !== undefined) {
                if (toggle &&
                    state === TwitchPotato.PlayerState.Playing &&
                    this._state === TwitchPotato.PlayerState.Playing)
                    state = TwitchPotato.PlayerState.Stopped;
                this._state = state;
                this.PlayerAction(TwitchPotato.PlayerActions.State, { state: state, queue: true });
            }
            return this._state;
        };
        Player.prototype.Mute = function (mute) {
            if (mute !== undefined) {
                this._isMuted = mute;
                this.PlayerAction(TwitchPotato.PlayerActions.Mute, { mute: mute, queue: true });
            }
            return this._isMuted;
        };
        Player.prototype.ViewMode = function (viewMode) {
            if (viewMode !== undefined) {
                if (viewMode === TwitchPotato.ViewMode.Toggle)
                    viewMode = (this._viewMode === TwitchPotato.ViewMode.Fullscreen) ?
                        TwitchPotato.ViewMode.Windowed :
                        TwitchPotato.ViewMode.Fullscreen;
                if (this._viewMode !== viewMode) {
                    this._viewMode = viewMode;
                    this.PlayerAction(TwitchPotato.PlayerActions.ViewMode, { viewMode: viewMode });
                    this.DisplayActionNotification(TwitchPotato.ViewMode[this._viewMode]);
                }
            }
            return this._viewMode;
        };
        Player.prototype.Quality = function (quality) {
            if (quality !== undefined) {
                this._quality = quality;
                this.PlayerAction(TwitchPotato.PlayerActions.Quality, { quality: quality, queue: true });
            }
            return this._quality;
        };
        Player.prototype.Position = function (position) {
            if (position !== undefined) {
                this._position = position;
            }
            return this._position;
        };
        Player.prototype.Highlight = function (num) {
            if (num === this._number)
                this._container.addClass('selected');
            else
                this._container.removeClass('selected');
            this._menu.Highlight(num === this._number);
        };
        Player.prototype.Reload = function () {
            this._isLoaded = false;
            this._webview.reload();
        };
        Player.prototype.GetPartnerStatus = function (callback) {
            var _this = this;
            if (this._isVideo) {
                this._isPartnered = undefined;
                callback(undefined);
            }
            else
                TwitchPotato.App.Twitch.IsPartnered(this._id, function (isPartnered) {
                    _this._isPartnered = isPartnered;
                    callback(isPartnered);
                });
        };
        Player.prototype.PlayerAction = function (action, params) {
            var _this = this;
            if (params === void 0) { params = {}; }
            if (!this._webview.contentWindow) {
                setTimeout(function () { return _this.PlayerAction(action, params); }, 100);
                return;
            }
            var data = {
                action: action,
                params: params
            };
            setTimeout(function () { return _this._webview.contentWindow.postMessage(JSON.stringify(data), '*'); }, 100);
        };
        Player.prototype.DisplayActionNotification = function (action) {
        };
        return Player;
    })();
    TwitchPotato.Player = Player;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=player.js.map
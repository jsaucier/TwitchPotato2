var PlayerActions;
(function (PlayerActions) {
    PlayerActions[PlayerActions["ViewMode"] = 0] = "ViewMode";
    PlayerActions[PlayerActions["Load"] = 1] = "Load";
    PlayerActions[PlayerActions["State"] = 2] = "State";
    PlayerActions[PlayerActions["Mute"] = 3] = "Mute";
    PlayerActions[PlayerActions["Quality"] = 4] = "Quality";
    PlayerActions[PlayerActions["Position"] = 5] = "Position";
    PlayerActions[PlayerActions["Preview"] = 6] = "Preview";
    PlayerActions[PlayerActions["Chat"] = 7] = "Chat";
    PlayerActions[PlayerActions["Layout"] = 8] = "Layout";
})(PlayerActions || (PlayerActions = {}));
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Playing"] = 0] = "Playing";
    PlayerState[PlayerState["Stopped"] = 1] = "Stopped";
})(PlayerState || (PlayerState = {}));
var ViewMode;
(function (ViewMode) {
    ViewMode[ViewMode["Fullscreen"] = 0] = "Fullscreen";
    ViewMode[ViewMode["Windowed"] = 1] = "Windowed";
})(ViewMode || (ViewMode = {}));
var Quality;
(function (Quality) {
    Quality[Quality["Mobile"] = 0] = "Mobile";
    Quality[Quality["Low"] = 1] = "Low";
    Quality[Quality["Medium"] = 2] = "Medium";
    Quality[Quality["High"] = 3] = "High";
    Quality[Quality["Source"] = 4] = "Source";
})(Quality || (Quality = {}));
var Controller = (function () {
    function Controller() {
        var _this = this;
        this._queue = [];
        this._isLoaded = false;
        window.addEventListener('message', function (event) { return _this.OnMessage(event.data); });
        window.addEventListener('resize', function () { return _this.ViewMode(); });
        this._player = $('embed')[0];
        this.CheckLoaded();
    }
    Controller.prototype.OnMessage = function (data) {
        var json = JSON.parse(data);
        var params = json.params;
        if (this.QueueMessage(json))
            return;
        switch (json.action) {
            case PlayerActions.Load:
                this.Load(params.id, params.isVideo);
                break;
            case PlayerActions.Mute:
                this.Mute(params.mute);
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
            default:
                console.log('Unhandled method: {0}'.format(PlayerActions[json.action]));
                break;
        }
    };
    Controller.prototype.QueueMessage = function (json) {
        if (this._isLoaded || json.params.queue === undefined)
            return false;
        var data = JSON.stringify(json);
        this._queue.push(data);
        return true;
    };
    Controller.prototype.ProcessQueue = function () {
        if (this._isLoaded)
            return;
        this._isLoaded = true;
        for (var i = 0; i < this._queue.length; i++)
            this.OnMessage(this._queue[i]);
        this._queue = [];
    };
    Controller.prototype.CheckLoaded = function () {
        var _this = this;
        if (this._isLoaded)
            return;
        var status = this._player.onlineStatus();
        if (status === 'unknown')
            setTimeout(function () { return _this.CheckLoaded(); }, 100);
        else
            setTimeout(function () { return _this.ProcessQueue(); }, 100);
    };
    Controller.prototype.Mute = function (mute) {
        if (mute === true)
            this._player.mute();
        else
            this._player.unmute();
        this._isMuted = mute;
    };
    Controller.prototype.State = function (state) {
        if (state === PlayerState.Playing)
            this._player.playVideo();
        else if (state === PlayerState.Stopped)
            this._player.pauseVideo();
    };
    Controller.prototype.Quality = function (quality) {
        this._player.setQuality(Quality[quality]);
    };
    Controller.prototype.Load = function (id, isVideo) {
        if (isVideo)
            this._player.loadVideo(id);
        else
            this._player.loadStream(id);
    };
    Controller.prototype.ViewMode = function (mode) {
        if (mode !== ViewMode.Fullscreen)
            this._player.height = '100%';
        var body = document.body;
        var html = document.documentElement;
        var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        var heightStr = height + '';
        if (mode !== undefined)
            this._viewMode = mode;
        if (this._viewMode === ViewMode.Fullscreen)
            heightStr = (height + 30) + 'px';
        else if (mode === ViewMode.Windowed)
            heightStr = "100%";
        this._player.height = heightStr;
        console.log(heightStr);
    };
    return Controller;
})();
$(function () {
    var pc = new Controller();
});
//# sourceMappingURL=controller.js.map
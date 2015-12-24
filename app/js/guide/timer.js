var TwitchPotato;
(function (TwitchPotato) {
    var GuideTimer = (function () {
        function GuideTimer() {
            this._current = $('#status .current');
            this._update = $('#status .update');
            this._refresh = new Date();
            this.UpdateTick();
        }
        GuideTimer.prototype.UpdateTick = function () {
            var _this = this;
            var time = new Date();
            this._current.text(time.toLocaleTimeString());
            var seconds = (this._refresh.getTime() - time.getTime()) / 1000;
            if (seconds < 0)
                seconds = 0;
            this._update.text('{0} secs'.format(Math.round(seconds)));
            clearTimeout(this._updateTimeout);
            this._updateTimeout = setTimeout(function () { return _this.UpdateTick(); }, 1000);
        };
        GuideTimer.prototype.RefreshTick = function () {
            var time = new Date();
            this._refresh = new Date(time.getTime() + (60 * 1000));
            clearTimeout(this._refreshTimeout);
            this._refreshTimeout = setTimeout(function () { return TwitchPotato.App.Guide.Refresh(); }, 1000 * 60);
        };
        return GuideTimer;
    })();
    TwitchPotato.GuideTimer = GuideTimer;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=timer.js.map
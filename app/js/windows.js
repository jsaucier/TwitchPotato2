var TwitchPotato;
(function (TwitchPotato) {
    var LoadWindow = (function () {
        function LoadWindow() {
            this._isOpen = true;
            this.Open(false);
        }
        LoadWindow.prototype.Open = function (fade, callback) {
            if (this._isOpen)
                return;
            this._isOpen = true;
            if (fade)
                $('#load').cssFade('in', callback);
            else
                $('#load').show();
        };
        LoadWindow.prototype.Close = function (fade, callback) {
            if (!this._isOpen)
                return;
            this._isOpen = false;
            if (fade)
                $('#load').cssFade('out', callback);
            else
                $('#load').hide();
        };
        Object.defineProperty(LoadWindow.prototype, "isOpen", {
            get: function () { return this._isOpen; },
            enumerable: true,
            configurable: true
        });
        return LoadWindow;
    })();
    TwitchPotato.LoadWindow = LoadWindow;
    var ErrorWindow = (function () {
        function ErrorWindow() {
            this._isShown = false;
        }
        ErrorWindow.prototype.Show = function (error) {
            var _this = this;
            $('#error .error').html(error);
            $('#error').cssFade('in');
            clearTimeout(this._timeout);
            setTimeout(function () { return _this.Hide(); }, 5000);
        };
        ErrorWindow.prototype.Hide = function () {
            this._isShown = false;
            $('#error').cssFade('out');
        };
        Object.defineProperty(ErrorWindow.prototype, "isShown", {
            get: function () { return this._isShown; },
            enumerable: true,
            configurable: true
        });
        return ErrorWindow;
    })();
    TwitchPotato.ErrorWindow = ErrorWindow;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=windows.js.map
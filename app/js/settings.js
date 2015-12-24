var TwitchPotato;
(function (TwitchPotato) {
    var Settings = (function () {
        function Settings() {
            this._defaults = {
                zoom: 1,
                useViewPreview: false,
                hidden: [],
                quality: TwitchPotato.Quality.Mobile,
                isMouseEnabled: false,
                refreshRate: 60000
            };
            this._settings = this._defaults;
        }
        Settings.prototype.HideGame = function (game, showOrHide) {
            var index = this._settings.hidden.indexOf(game.toLowerCase());
            if (showOrHide === undefined)
                showOrHide = (index === -1) ? true : false;
            if (showOrHide === true)
                this._settings.hidden.push(game.toLowerCase());
            else
                this._settings.hidden.splice(index, 1);
            this.Save();
        };
        Settings.prototype.IsGameHidden = function (game) {
            return (this._settings.hidden.indexOf(game.toLowerCase()) !== -1);
        };
        Settings.prototype.Load = function (callback, defaults) {
            var _this = this;
            function update() {
                TwitchPotato.App.UpdateZoom();
                TwitchPotato.App.UpdateMouse();
                TwitchPotato.App.UpdateRefreshRate();
            }
            if (defaults === true) {
                this._settings = this._defaults;
                this.Save();
                update();
                if (typeof (callback) === 'function')
                    callback(this._settings);
            }
            else {
                this._settings = undefined;
                chrome.storage.local.get(null, function (store) {
                    _this._settings = $.extend(true, _this._settings, _this._defaults, store.settings);
                    update();
                    if (typeof (callback) === 'function')
                        callback(_this._settings);
                });
            }
        };
        Settings.prototype.Save = function () {
            var _this = this;
            chrome.storage.local.clear(function () {
                chrome.storage.local.set({ settings: _this._settings });
            });
        };
        Object.defineProperty(Settings.prototype, "settings", {
            get: function () { return this._settings; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "zoom", {
            get: function () { return this._settings.zoom; },
            set: function (zoom) {
                this._settings.zoom = zoom;
                this.Save();
                TwitchPotato.App.UpdateZoom();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "quality", {
            get: function () { return this._settings.quality; },
            set: function (quality) {
                this._settings.quality = quality;
                this.Save();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "useViewPreview", {
            get: function () { return this._settings.useViewPreview; },
            set: function (useViewPreview) {
                this._settings.useViewPreview = useViewPreview;
                this.Save();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "isMouseEnabled", {
            get: function () { return this._settings.isMouseEnabled; },
            set: function (enabledOrDisable) {
                this._settings.isMouseEnabled = enabledOrDisable;
                this.Save();
                TwitchPotato.App.UpdateMouse();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "refreshRate", {
            get: function () { return this._settings.refreshRate; },
            set: function (rate) {
                this._settings.refreshRate = rate;
                this.Save();
                TwitchPotato.App.UpdateRefreshRate();
            },
            enumerable: true,
            configurable: true
        });
        return Settings;
    })();
    TwitchPotato.Settings = Settings;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=settings.js.map
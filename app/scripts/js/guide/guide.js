var TwitchPotato;
(function (TwitchPotato) {
    var GuideHandler = (function () {
        function GuideHandler() {
            var _this = this;
            this._container = $('#guide');
            this._isOpen = true;
            this.Menu = new TwitchPotato.GuideMenu();
            this.ItemMenu = new TwitchPotato.GuideItemMenu();
            this.List = new TwitchPotato.GuideList();
            this.Timer = new TwitchPotato.GuideTimer();
            this.Content = new TwitchPotato.GuideContent();
            $(document).ajaxStop(function () { return _this.OnAjaxCompleted(); });
        }
        GuideHandler.prototype.OnInput = function (input) {
            if (!this._isOpen)
                return false;
            switch (input) {
                case TwitchPotato.Inputs.Left:
                case TwitchPotato.Inputs.Right:
                    this.Menu.Toggle();
                    this.List.Toggle();
                    return true;
                case TwitchPotato.Inputs.Refresh:
                    this.Refresh();
                    return true;
                case TwitchPotato.Inputs.ContextMenu:
                    this.ItemMenu.Create();
                    return true;
                default:
                    return false;
            }
        };
        GuideHandler.prototype.Toggle = function (showOrHide) {
            if (showOrHide === this._isOpen)
                return;
            if (showOrHide === undefined)
                showOrHide = !this._isOpen;
            if (!showOrHide && !TwitchPotato.App.Players.IsPlaying())
                return;
            TwitchPotato.App.Players.ToggleGuide(showOrHide);
            this._container.toggleClass('closed', !showOrHide);
            this._isOpen = showOrHide;
        };
        GuideHandler.prototype.OnAjaxCompleted = function () {
            this.Menu.CreateItems(this.Menu.selected);
            this.List.CreateItems(this.Menu.selected);
            this.Timer.RefreshTick();
            TwitchPotato.App.Notification.Notify();
            TwitchPotato.App.LoadWindow.Close(true);
        };
        GuideHandler.prototype.Refresh = function (skipFollowed) {
            if (skipFollowed === void 0) { skipFollowed = false; }
            TwitchPotato.App.Twitch.Refresh(skipFollowed);
        };
        Object.defineProperty(GuideHandler.prototype, "container", {
            get: function () { return this._container; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuideHandler.prototype, "isOpen", {
            get: function () { return this._isOpen; },
            enumerable: true,
            configurable: true
        });
        return GuideHandler;
    })();
    TwitchPotato.GuideHandler = GuideHandler;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=guide.js.map
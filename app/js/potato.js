var TwitchPotato;
(function (TwitchPotato) {
    var Application = (function () {
        function Application() {
            $(function () { return TwitchPotato.App.Initialize(); });
        }
        Application.prototype.Initialize = function () {
            var _this = this;
            this.Input = new TwitchPotato.InputHandler();
            this.LoadWindow = new TwitchPotato.LoadWindow();
            this.ErrorWindow = new TwitchPotato.ErrorWindow();
            this.Settings = new TwitchPotato.Settings();
            this.Guide = new TwitchPotato.GuideHandler();
            this.Notification = new TwitchPotato.NotificationHandler();
            this.Chat = new TwitchPotato.ChatHandler();
            this.Players = new TwitchPotato.Players();
            this.Authenticator = new TwitchPotato.Authenticator(function (user, name, token) {
                _this.Twitch = new TwitchPotato.TwitchHandler(user, token);
            });
            this.Settings.Load(function (settings) {
                _this.UpdateZoom();
                _this.UpdateMouse();
            });
        };
        Application.prototype.OnInput = function (input) {
            switch (input) {
                case TwitchPotato.Inputs.Close:
                    window.close();
                    return true;
                case TwitchPotato.Inputs.ToggleGuide:
                    this.Guide.Toggle();
                    return true;
                case TwitchPotato.Inputs.ZoomIncrease:
                case TwitchPotato.Inputs.ZoomDecrease:
                case TwitchPotato.Inputs.ZoomReset:
                    if (input === TwitchPotato.Inputs.ZoomIncrease)
                        this.Settings.zoom += .01;
                    else if (input === TwitchPotato.Inputs.ZoomDecrease)
                        this.Settings.zoom -= .01;
                    else if (input === TwitchPotato.Inputs.ZoomReset)
                        this.Settings.zoom = 1;
                    return true;
                default:
                    return false;
            }
        };
        Application.prototype.UpdateMouse = function () {
            var text = (this.Settings.isMouseEnabled ? 'Disable' : 'Enable') + ' Mouse';
            $('#mouse').text(text);
            TwitchPotato.App.Guide.Menu.UpdateMenuText();
            TwitchPotato.App.Guide.Menu.UpdateMouseHandlers();
            TwitchPotato.App.Guide.List.UpdateMouseHandlers();
            TwitchPotato.App.Guide.ItemMenu.UpdateMouseHandlers();
        };
        Application.prototype.UpdateRefreshRate = function () {
        };
        Application.prototype.UpdateZoom = function () {
            $('html').css('zoom', this.Settings.zoom);
            TwitchPotato.App.Guide.List.UpdateMenuScroll();
        };
        return Application;
    })();
    TwitchPotato.Application = Application;
    TwitchPotato.App = new Application();
    TwitchPotato.PostMessage = function (webview, method, params) {
        if (params === void 0) { params = {}; }
        if (!webview.contentWindow) {
            setTimeout(function () { return TwitchPotato.PostMessage(webview, method, params); }, 100);
            return;
        }
        var data = {
            method: method,
            params: params
        };
        setTimeout(function () {
            return webview.contentWindow.postMessage(JSON.stringify(data), '*');
        }, 100);
    };
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=potato.js.map
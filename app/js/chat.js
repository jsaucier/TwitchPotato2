var TwitchPotato;
(function (TwitchPotato) {
    var ChatHandler = (function () {
        function ChatHandler() {
            this._isLoaded = false;
            this._chatUrl = 'http://www.twitch.tv/{0}/chat?popout=true';
            this._layout = TwitchPotato.ChatLayout.FloatLeft;
            this._webview = $('#chat webview')[0];
            this._chat = '#chat';
            this._showChat = false;
        }
        ChatHandler.prototype.Load = function (channel) {
            var _this = this;
            this._isLoaded = false;
            $(this._webview).attr('src', this._chatUrl.format(channel));
            this._webview.addEventListener('loadcommit', function () {
                if (_this._isLoaded === false) {
                    _this._channel = channel;
                    _this._isLoaded = true;
                    _this._webview.insertCSS({ file: 'css/twitch.css' });
                    _this.UpdateFontSize();
                    _this.UpdateLayout();
                }
            });
        };
        ChatHandler.prototype.Guide = function (showOrHide) {
            if (showOrHide === false)
                $(this._chat).fadeOut();
            else {
                if (this._showChat)
                    $(this._chat).fadeIn();
                if (this._layout === TwitchPotato.ChatLayout.DockLeft)
                    TwitchPotato.App.Players.PlayerMode(TwitchPotato.PlayerMode.ChatLeft);
                else if (this._layout === TwitchPotato.ChatLayout.DockRight)
                    TwitchPotato.App.Players.PlayerMode(TwitchPotato.PlayerMode.ChatRight);
                else
                    TwitchPotato.App.Players.PlayerMode(TwitchPotato.PlayerMode.Full);
            }
        };
        ChatHandler.prototype.Toggle = function (channel) {
            if (channel === void 0) { channel = this._channel; }
            if ($(this._chat).is(':visible') === true) {
                this._showChat = false;
                $(this._chat).fadeOut();
                return TwitchPotato.App.Players.PlayerMode(TwitchPotato.PlayerMode.Full);
            }
            this._showChat = true;
            if (channel !== undefined && channel !== this._channel)
                this.Load(channel);
            else
                this.UpdateLayout();
        };
        ChatHandler.prototype.UpdateFontSize = function () {
            if (this._isLoaded === false)
                return;
            this._webview.insertCSS({
                code: 'html { zoom: {0}; }'.format(TwitchPotato.App.Settings.zoom)
            });
        };
        ChatHandler.prototype.UpdateLayout = function (direction) {
            if (direction === void 0) { direction = TwitchPotato.Direction.Down; }
            if (this._showChat === false && $(this._chat).is(':visible') === false)
                return;
            if (this._isLoaded === false)
                return;
            if (direction === TwitchPotato.Direction.Left)
                this._layout--;
            else if (direction === TwitchPotato.Direction.Right)
                this._layout++;
            var size = Object.keys(TwitchPotato.ChatLayout).length / 2;
            if (this._layout < 0)
                this._layout = size - 1;
            else if (this._layout > size - 1)
                this._layout = 0;
            $(this._chat)
                .hide()
                .attr('layout', this._layout)
                .fadeIn();
            if (this._layout === TwitchPotato.ChatLayout.DockLeft)
                TwitchPotato.App.Players.PlayerMode(TwitchPotato.PlayerMode.ChatLeft);
            else if (this._layout === TwitchPotato.ChatLayout.DockRight)
                TwitchPotato.App.Players.PlayerMode(TwitchPotato.PlayerMode.ChatRight);
            else
                TwitchPotato.App.Players.PlayerMode(TwitchPotato.PlayerMode.Full);
        };
        return ChatHandler;
    })();
    TwitchPotato.ChatHandler = ChatHandler;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=chat.js.map
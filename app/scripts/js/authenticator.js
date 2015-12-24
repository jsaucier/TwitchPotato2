var TwitchPotato;
(function (TwitchPotato) {
    var Authenticator = (function () {
        function Authenticator(onAuthenticated) {
            var _this = this;
            this._element = $('#login');
            this._isAuthenticated = false;
            this._webview = this._element[0];
            this._callback = onAuthenticated;
            this._webview.addEventListener('contentload', function () { return _this.ContentLoaded(); });
            this._webview.addEventListener('loadcommit', function (event) { return _this.LoadCommited(event); });
            this.GetToken();
        }
        Authenticator.prototype.LogIn = function () {
            this._element.show();
            this.Navigate('https://secure.twitch.tv/login');
        };
        Authenticator.prototype.LogOut = function () {
            var _this = this;
            this._isAuthenticated = false;
            TwitchPotato.App.LoadWindow.Open(true, function () { return _this.Navigate('http://www.twitch.tv/logout'); });
        };
        Authenticator.prototype.Navigate = function (url) {
            this._element.attr('src', url);
        };
        Authenticator.prototype.LoadCommited = function (event) {
            var _this = this;
            if (event.isTopLevel) {
                if (event.url === 'http://www.twitch.tv/') {
                    TwitchPotato.App.LoadWindow.Open(false);
                    this.GetToken();
                }
                else if (event.url.indexOf('https://api.twitch.tv/kraken/oauth2/authenticate') === 0) {
                    this.LogIn();
                }
                else if (event.url.indexOf('https://dl.dropboxusercontent.com/spa/tn9l4tkx2yhpiv3/') === 0) {
                    this._token = event.url.match(/#access_token=(.*)&/i)[1];
                    this.Navigate('about:blank');
                    this._element.hide();
                    $.ajax({
                        url: 'https://api.twitch.tv/kraken/user?oauth_token={0}'.format(this._token),
                        error: function (xhr, status, error) { return console.log(xhr, status, error); },
                        global: false,
                        success: function (json) {
                            _this._user = json.name;
                            _this._name = json.display_name;
                            _this._callback(_this._user, _this._name, _this._token);
                        }
                    });
                }
            }
        };
        Authenticator.prototype.ContentLoaded = function () {
            var url = this._element.attr('src');
            if (url === 'about:blank')
                return;
            if (url.indexOf('https://secure.twitch.tv/login') === 0 ||
                url.indexOf('https://api.twitch.tv/kraken/oauth2/authorize') === 0) {
                this._element.show();
                TwitchPotato.App.LoadWindow.Close(true);
                return;
            }
        };
        Authenticator.prototype.GetToken = function () {
            var url = 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=token' +
                '&client_id=60wzh4fjbowe6jwtofuc1jakjfgekry' +
                '&redirect_uri=https%3A%2F%2Fdl.dropboxusercontent.com%2Fspa%2Ftn9l4tkx2yhpiv3%2Ftwitch%2520potato%2Fpublic%2Ftoken.html' +
                '&scope=user_read%20user_follows_edit';
            this.Navigate(url);
        };
        return Authenticator;
    })();
    TwitchPotato.Authenticator = Authenticator;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=authenticator.js.map
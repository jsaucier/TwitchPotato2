module TwitchPotato {

    export class Authenticator {

        private _element: JQuery = $('#login');
        private _webview: WebviewElement;
        private _isAuthenticated = false;
        private _token: string;
        private _user: string;
        private _name: string;
        private _callback: (user: string, name: string, token: string) => void;

        /** Creates an instance of the AuthenticationHandler. */
        constructor(onAuthenticated?: (user: string, name: string, token: string) => void) {
            this._webview = <WebviewElement>this._element[0];
            this._callback = onAuthenticated;
            this._webview.addEventListener('contentload', () => this.ContentLoaded());
            this._webview.addEventListener('loadcommit', (event: LoadCommitEvent) => this.LoadCommited(event));
            this.GetToken();
        }

        /** Logs into Twitch.tv */
        LogIn(): void {
            this._element.show();
            this.Navigate('https://secure.twitch.tv/login');
        }

        /** Logs out of Twitch.tv */
        LogOut(): void {
            this._isAuthenticated = false;
            App.LoadWindow.Open(true,
                () => this.Navigate('http://www.twitch.tv/logout'));
        }

        /** Navigate the webview to the url. */
        private Navigate(url: string) {
            this._element.attr('src', url);
        }

        /** Fired when the webview begins loading. */
        private LoadCommited(event: LoadCommitEvent): void {

            if (event.isTopLevel) {

                if (event.url === 'http://www.twitch.tv/') {

                    App.LoadWindow.Open(false);
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
                        error: (xhr, status, error) => console.log(xhr, status, error),
                        global: false,
                        success: (json) => {

                            this._user = json.name;
                            this._name = json.display_name;

                            /** Return the token to the callback function */
                            this._callback(this._user, this._name, this._token);
                        }
                    });
                }
            }
        }

        /** Checks to see if the user is authenticated. */
        private ContentLoaded(): void {

            /** Get the webview element. */
            var url = this._element.attr('src');

            if (url === 'about:blank') return;

            /** User interaction is required. */
            if (url.indexOf('https://secure.twitch.tv/login') === 0 ||
                url.indexOf('https://api.twitch.tv/kraken/oauth2/authorize') === 0) {

                this._element.show();
                App.LoadWindow.Close(true);

                return;
            }
        }

        /** Get the OAuth2 access token. */
        private GetToken(): void {

            var url =
                'https://api.twitch.tv/kraken/oauth2/authorize?response_type=token' +
                '&client_id=60wzh4fjbowe6jwtofuc1jakjfgekry' +
                '&redirect_uri=https%3A%2F%2Fdl.dropboxusercontent.com%2Fspa%2Ftn9l4tkx2yhpiv3%2Ftwitch%2520potato%2Fpublic%2Ftoken.html' +
                '&scope=user_read%20user_follows_edit';

            this.Navigate(url);
        }
    }
}

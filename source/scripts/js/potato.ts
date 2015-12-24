module TwitchPotato {

    export class Application {

        constructor() {
            $(() => App.Initialize());
        }

        /** Initializes the Main class. */
        Initialize(): void {

            this.Input = new InputHandler();
            this.LoadWindow = new LoadWindow();
            this.ErrorWindow = new ErrorWindow();
            this.Settings = new Settings();
            this.Guide = new GuideHandler();
            this.Notification = new NotificationHandler();
            this.Chat = new ChatHandler();
            this.Players = new Players();
            //
            /** Authenticate the user. */
            this.Authenticator = new Authenticator((user, name, token) => {
                this.Twitch = new TwitchHandler(user, token);
            });

            this.Settings.Load((settings) => {
                this.UpdateZoom();
                this.UpdateMouse();
            });
        }

        /** Callback triggered after a keypress event. */
        OnInput(input: Inputs): boolean {

            switch (input) {

                case Inputs.Close:
                    window.close();
                    return true;

                case Inputs.ToggleGuide:
                    this.Guide.Toggle();
                    return true;

                case Inputs.ZoomIncrease:
                case Inputs.ZoomDecrease:
                case Inputs.ZoomReset:

                    if (input === Inputs.ZoomIncrease)
                        this.Settings.zoom += .01;
                    else if (input === Inputs.ZoomDecrease)
                        this.Settings.zoom -= .01;
                    else if (input === Inputs.ZoomReset)
                        this.Settings.zoom = 1;

                    return true;

                default:
                    return false;
            }
        }

        /** Updates the mouse menu item. */
        UpdateMouse(): void {

            var text = (this.Settings.isMouseEnabled ? 'Disable' : 'Enable') + ' Mouse';
            $('#mouse').text(text);

            App.Guide.Menu.UpdateMenuText();
            App.Guide.Menu.UpdateMouseHandlers();
            App.Guide.List.UpdateMouseHandlers();
            App.Guide.ItemMenu.UpdateMouseHandlers();
        }

        /** Updates the refresh menu item. */
        UpdateRefreshRate(): void {

        }

        /** Updates the application's zoom. */
        UpdateZoom(): void {

            $('html').css('zoom', this.Settings.zoom);

            // TODO: Fix this, put it on a timer.
            App.Guide.List.UpdateMenuScroll();
        }

        LoadWindow: LoadWindow;
        ErrorWindow: ErrorWindow;
        Settings: Settings;


        Guide: GuideHandler;
        Authenticator: Authenticator;
        Twitch: TwitchHandler;
        Input: InputHandler;
        Notification: NotificationHandler;
        Chat: ChatHandler;
        Players: Players;
    }

    /** The current application instance */
    export var App: Application = new Application();


    /** Post a message containing a method and params to the preview player. */
    export var PostMessage = function(webview: WebviewElement, method: string, params = {}): void {

        /** Make sure the contentwindow is loaded. */
        if (!webview.contentWindow) {
            setTimeout(() => PostMessage(webview, method, params), 100);
            return;
        }

        /** Data to be posted. */
        var data = {
            method: method,
            params: params
        };

        /** Post the data to the client application. */
        setTimeout(() =>
            webview.contentWindow.postMessage(
                JSON.stringify(data), '*'), 100);
    };
}

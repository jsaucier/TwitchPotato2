module TwitchPotato {

    export class GuideHandler {

        constructor() {
            $(document).ajaxStop(() => this.OnAjaxCompleted());
        }

        /** Handles input for the menu. */
        OnInput(input: Inputs): boolean {

            if (!this._isOpen) return false;

            switch (input) {

                case Inputs.Left:
                case Inputs.Right:
                    this.Menu.Toggle();
                    this.List.Toggle();
                    return true;

                case Inputs.Refresh:
                    this.Refresh();
                    return true;

                case Inputs.ContextMenu:
                    this.ItemMenu.Create();
                    return true;

                default:
                    return false;
            }
        }

        /** Shows the guide. */
        Toggle(showOrHide?: boolean): void {

            if (showOrHide === this._isOpen) return;

            if (showOrHide === undefined)
                showOrHide = !this._isOpen;

            if (showOrHide === false &&
                App.Players.IsPlaying() === false)
                return;

            App.Players.ToggleGuide(showOrHide);

            this._container.toggleClass('closed', !showOrHide);

            this._isOpen = showOrHide;
        }

        Refresh(skipFollowed = false): void {
            App.Twitch.Refresh(skipFollowed);
        }

        private OnAjaxCompleted(): void {
            this.Menu.CreateItems(this.Menu.selected)
            this.List.CreateItems(this.Menu.selected);

            this.Timer.RefreshTick();

            App.Notification.Notify();

            App.LoadWindow.Close(true);
        }

        private _container = $('#guide');
        get container(): JQuery { return this._container; }

        private _isOpen = true;
        get isOpen(): boolean { return this._isOpen; }

        Menu = new GuideMenu();
        ItemMenu = new GuideItemMenu();
        List = new GuideList();
        Timer = new GuideTimer();
        Content = new GuideContent();
        Keybinds = new GuideKeybinds();
    }
}

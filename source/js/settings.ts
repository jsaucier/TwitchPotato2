module TwitchPotato {

    export class Settings {

        constructor() {

            this._settings = this._defaults;
        }

        /** Hide a game. */
        HideGame(game: string, showOrHide?: boolean): void {

            var index = this._settings.hidden.indexOf(game.toLowerCase())

            if (showOrHide === undefined)
                showOrHide = (index === -1) ? true : false;

            if (showOrHide === true)
                this._settings.hidden.push(game.toLowerCase());
            else
                this._settings.hidden.splice(index, 1);

            this.Save();
        }

        /** Gets whether the game is hidden. */
        IsGameHidden(game: string): boolean {

            return (this._settings.hidden.indexOf(game.toLowerCase()) !== -1)
        }

        /** Loads the settings. */
        Load(callback?: (settings: StorageInterface) => void, defaults?: boolean): void {

            function update() {
                App.UpdateZoom();
                App.UpdateMouse();
                App.UpdateRefreshRate();
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

                chrome.storage.local.get(null, (store) => {

                    this._settings = <StorageInterface>$.extend(
                        true,
                        this._settings,
                        this._defaults,
                        store.settings)
                    ;

                    update();

                    if (typeof (callback) === 'function')
                        callback(this._settings);
                });
            }
        }

        /** Saves the settings. */
        Save(): void {

            chrome.storage.local.clear(() => {
                chrome.storage.local.set({ settings: this._settings });
            });
        }

        // Quality(quality?: Quality): Quality {
        //     if (quality !== undefined) {
        //         this._settings.quality = quality;
        //     }
        //     this.Save();
        //     return this._settings.quality;
        // }

        private _defaults = <StorageInterface>{
            zoom: 1,
            useViewPreview: false,
            hidden: [],
            quality: Quality.Source,
            isMouseEnabled: false,
            refreshRate: 60000
        };

        private _settings: StorageInterface;
        get settings(): StorageInterface { return this._settings; }

        /** Gets or sets the zoom level. */
        get zoom(): number { return this._settings.zoom; }
        set zoom(zoom: number) {
            this._settings.zoom = zoom;
            this.Save();
            App.UpdateZoom();
        }

        // /** Gets or sets the default stream quality. */
        // get Quality(): Quality { return this._settings.quality; }
        // set Quality(quality: Quality) {
        //     this._settings.quality = quality;
        //     this.Save();
        // }

        get useViewPreview(): boolean { return this._settings.useViewPreview; }
        set useViewPreview(useViewPreview: boolean) {
            this._settings.useViewPreview = useViewPreview;
            this.Save();
        }

        /** Gets or sets if the mouse is enabled. */
        get isMouseEnabled(): boolean { return this._settings.isMouseEnabled; }
        set isMouseEnabled(enabledOrDisable: boolean) {
            this._settings.isMouseEnabled = enabledOrDisable;
            this.Save();
            App.UpdateMouse();
        }

        /** Gets or sets the refresh rate of the guide. */
        get refreshRate(): number { return this._settings.refreshRate; }
        set refreshRate(rate: number) {
            this._settings.refreshRate = rate;
            this.Save();
            App.UpdateRefreshRate();
        }
    }
}

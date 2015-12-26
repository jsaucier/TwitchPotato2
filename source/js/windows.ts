module TwitchPotato {

    export class LoadWindow {

        constructor() {
            this.Open(false);
        }

        /** Shows the loading window. */
        Open(fade: boolean, callback?: () => void): void {

            if (this._isOpen) return;

            this._isOpen = true;

            if (fade)
                $('#load').cssFade('in', callback);
            else {
                $('#load').show();
                callback;
            }
        }

        /** Hides the loading window. */
        Close(fade: boolean, callback?: () => void): void {

            if (!this._isOpen) return;

            this._isOpen = false;

            if (fade)
                $('#load').cssFade('out', callback);
            else
                $('#load').hide();
        }

        private _isOpen = true;
        public get isOpen(): boolean { return this._isOpen; }
    }

    export class ErrorWindow {

        Show(error: string): void {

            $('#error .error').html(error);
            $('#error').cssFade('in');

            clearTimeout(this._timeout);
            setTimeout(() => this.Hide(), 5000);
        }

        Hide(): void {

            this._isShown = false;
            $('#error').cssFade('out');
        }

        private _timeout: number;

        private _isShown = false;
        public get isShown(): boolean { return this._isShown; }
    }
}

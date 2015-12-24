module TwitchPotato {

    export class GuideTimer {

        constructor() {
            this.UpdateTick();
        }

        /** Updates the current date and time. */
        UpdateTick(): void {

            var time = new Date();

            this._current.text(time.toLocaleTimeString());

            var seconds = (this._refresh.getTime() - time.getTime()) / 1000;

            if (seconds < 0) seconds = 0;

            this._update.text('{0} secs'.format(Math.round(seconds)));

            clearTimeout(this._updateTimeout);
            this._updateTimeout = setTimeout(() => this.UpdateTick(), 1000);
        }

        /** Updates the refreshed time. */
        RefreshTick(): void {

            var time = new Date();
            this._refresh = new Date(time.getTime() + (60 * 1000));

            clearTimeout(this._refreshTimeout);
            this._refreshTimeout = setTimeout(() => App.Guide.Refresh(), 1000 * 60);
        }

        private _current = $('#status .current');
        private _update = $('#status .update');
        private _refresh = new Date();
        private _updateTimeout: number;
        private _refreshTimeout: number;
    }
}

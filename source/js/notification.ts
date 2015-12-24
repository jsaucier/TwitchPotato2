module TwitchPotato {

    export class NotificationHandler {

        private _online: { [channel: string]: string } = {};

        /**
         * Displays a notification of the new channels that are online or when
         * a channel changes games. */
        Notify() {

            var online: { [channel: string]: string } = {};
            var followed = App.Twitch.followedChannels;

            for (var o in followed) {

                var channel = App.Twitch.GetChannel(o);

                if (this._online[o] !== channel.game)
                    online[o] = channel.game || online[o] || '';
            }

            var html = '';

            for (var o in online) {

                var channel = App.Twitch.GetChannel(o);

                html +=
                '<div class="line">' +
                '<div class="name">' + channel.streamer + '</div>' +
                '<div class="game">' + channel.game + '</div>' +
                '</div>';

                // html += item.format(channel.streamer, channel.game);

                // console.log(item)?
                this._online[o] = channel.game || '';
            }

            $('#notification').html(html);

            var cleanup: { [channel: string]: string } = {};

            for (var i in this._online)
                if (followed[i] !== undefined) cleanup[i] = this._online[i];

            this._online = cleanup;

            if ($('#notification div').length > 0) {

                $('#notification').removeClass('closed');
                setTimeout(() => $('#notification').addClass('closed'), 5000);
            }
        }
    }
}

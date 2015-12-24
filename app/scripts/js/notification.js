var TwitchPotato;
(function (TwitchPotato) {
    var NotificationHandler = (function () {
        function NotificationHandler() {
            this._online = {};
        }
        NotificationHandler.prototype.Notify = function () {
            var online = {};
            var followed = TwitchPotato.App.Twitch.followedChannels;
            for (var o in followed) {
                var channel = TwitchPotato.App.Twitch.GetChannel(o);
                if (this._online[o] !== channel.game)
                    online[o] = channel.game || online[o] || '';
            }
            var html = '';
            for (var o in online) {
                var channel = TwitchPotato.App.Twitch.GetChannel(o);
                html +=
                    '<div class="line">' +
                        '<div class="name">' + channel.streamer + '</div>' +
                        '<div class="game">' + channel.game + '</div>' +
                        '</div>';
                this._online[o] = channel.game || '';
            }
            $('#notification').html(html);
            var cleanup = {};
            for (var i in this._online)
                if (followed[i] !== undefined)
                    cleanup[i] = this._online[i];
            this._online = cleanup;
            if ($('#notification div').length > 0) {
                $('#notification').removeClass('closed');
                setTimeout(function () { return $('#notification').addClass('closed'); }, 5000);
            }
        };
        return NotificationHandler;
    })();
    TwitchPotato.NotificationHandler = NotificationHandler;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=notification.js.map
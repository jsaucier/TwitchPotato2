var TwitchPotato;
(function (TwitchPotato) {
    var TwitchHandler = (function () {
        function TwitchHandler(user, token) {
            this._limit = 100;
            this._followed = {};
            this._channels = {};
            this._games = {};
            this._videos = {};
            this._search = {};
            this._user = user;
            this._token = token;
            this.Refresh();
        }
        Object.defineProperty(TwitchHandler.prototype, "lastSearch", {
            get: function () { return this._lastSearch; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TwitchHandler.prototype, "followedChannels", {
            get: function () { return this._followed[TwitchPotato.FollowType.Channel]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TwitchHandler.prototype, "followedGames", {
            get: function () { return this._followed[TwitchPotato.FollowType.Game]; },
            enumerable: true,
            configurable: true
        });
        TwitchHandler.prototype.IsFollowing = function (followType, id) {
            return this._followed[followType][id] !== undefined;
        };
        TwitchHandler.prototype.GetFollows = function (followType) { return this._followed[followType]; };
        TwitchHandler.prototype.GetChannel = function (channel) { return this._channels[channel]; };
        TwitchHandler.prototype.GetGame = function (game) { return this._games[game]; };
        TwitchHandler.prototype.GetItems = function (menu) {
            if (menu === TwitchPotato.MenuType.Channels)
                return this._channels;
            if (menu === TwitchPotato.MenuType.Games)
                return this._games;
            if (menu === TwitchPotato.MenuType.Game)
                return this._search;
            if (menu === TwitchPotato.MenuType.Videos)
                return this._videos;
        };
        TwitchHandler.prototype.Refresh = function (skipFollowed) {
            if (skipFollowed === void 0) { skipFollowed = false; }
            this._followed[TwitchPotato.FollowType.Channel] = {};
            this._followed[TwitchPotato.FollowType.Game] = {};
            this._channels = {};
            this._games = {};
            this.GetChannels();
            this.GetGames();
            this.GetFollowedChannels();
            this.GetFollowedGames();
            if (this._lastSearch !== undefined)
                this.GetGameChannels(this._lastSearch);
        };
        TwitchHandler.prototype.IsPartnered = function (channel, callback) {
            var _this = this;
            $.ajax({
                url: 'https://api.twitch.tv/kraken/channels/{0}'.format(channel),
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (data) { return callback(data.partner); },
            });
        };
        TwitchHandler.prototype.Follow = function (name, type, unfollow) {
            var _this = this;
            var url = type === TwitchPotato.FollowType.Channel ?
                'https://api.twitch.tv/kraken/users/{0}/follows/channels/{1}?oauth_token={2}&scope=user_read+user_follows_edit' :
                'https://api.twitch.tv/api/users/{0}/follows/games/{1}?oauth_token={2}&scope=user_read+user_follows_edit';
            url = url.format(this._user, name, this._token);
            if (unfollow === undefined)
                unfollow = this.IsFollowing(type, name);
            $.ajax({
                url: url,
                type: (unfollow === true) ? 'DELETE' : 'PUT',
                error: function (xhr, status, error) { return _this.AuthenticationError(xhr, status, error); },
                success: function () {
                    if (unfollow)
                        delete _this._followed[type][name];
                    else
                        _this._followed[type][name] = true;
                    TwitchPotato.App.Guide.List.CreateItems();
                    setTimeout(function () { return TwitchPotato.App.Guide.Refresh(); }, 5000);
                    setTimeout(function () { return _this.GetFollowedGames(); }, 5000);
                }
            });
        };
        TwitchHandler.prototype.GetChannels = function (getAll) {
            var _this = this;
            if (getAll === void 0) { getAll = false; }
            var url = 'https://api.twitch.tv/kraken/streams?limit={0}'.format(this._limit);
            $.ajax({
                url: url,
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (json) {
                    _this.ParseChannelItems(json.streams, _this._channels);
                    if (getAll === true && json._total > _this._limit)
                        for (var offset = _this._limit; offset < json._total; offset += _this._limit)
                            _this.GetNextChannels(url, offset, _this._channels);
                }
            });
        };
        TwitchHandler.prototype.GetGames = function (getAll) {
            var _this = this;
            if (getAll === void 0) { getAll = true; }
            var url = 'https://api.twitch.tv/kraken/games/top?limit={0}'.format(this._limit);
            $.ajax({
                url: url,
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (json) {
                    _this.ParseGameItems(json.top);
                    if (getAll === true && json._total > _this._limit)
                        for (var offset = _this._limit; offset < json._total; offset += _this._limit)
                            _this.GetNextGames(url, offset);
                }
            });
        };
        TwitchHandler.prototype.GetGameChannels = function (searchGame, getAll) {
            var _this = this;
            if (getAll === void 0) { getAll = true; }
            this._search = {};
            this._lastSearch = searchGame;
            var url = 'https://api.twitch.tv/kraken/streams?game={0}&limit={1}'.format(searchGame, this._limit);
            $.ajax({
                url: url,
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (json) {
                    _this.ParseChannelItems(json.streams, _this._search);
                    if (getAll === true && json._total > _this._limit)
                        for (var offset = _this._limit; offset < json._total; offset += _this._limit)
                            _this.GetNextChannels(url, offset, _this._search);
                }
            });
        };
        TwitchHandler.prototype.GetChannelVideos = function (channel, getAll) {
            var _this = this;
            if (getAll === void 0) { getAll = true; }
            this._videos = {};
            var url = 'https://api.twitch.tv/kraken/channels/{0}/videos?&limit={1}'.format(channel, this._limit);
            $.ajax({
                url: url,
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (json) {
                    _this.ParseVideosObject(json.videos);
                    if (getAll === true && json._total > _this._limit)
                        for (var offset = _this._limit; offset < json._total; offset += _this._limit)
                            _this.GetNextVideos(url, offset);
                }
            });
        };
        TwitchHandler.prototype.GetFollowedChannels = function () {
            var _this = this;
            var url = 'https://api.twitch.tv/kraken/streams/followed?oauth_token={0}'.format(this._token);
            $.ajax({
                url: url,
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (json) {
                    _this.ParseChannelItems(json.streams, _this._channels, true);
                }
            });
        };
        TwitchHandler.prototype.GetFollowedGames = function () {
            var _this = this;
            var url = 'https://api.twitch.tv/api/users/{0}/follows/games?limit={1}'.format(this._user, this._limit);
            $.ajax({
                url: url,
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (json) {
                    for (var index in json.follows) {
                        var game = json.follows[index];
                        if (_this._games[game.name] === undefined)
                            _this._games[game.name] = {
                                name: game.name,
                                channels: -1,
                                viewers: -1,
                                boxArt: null,
                            };
                        _this._followed[TwitchPotato.FollowType.Game][game.name] = true;
                    }
                }
            });
        };
        TwitchHandler.prototype.ShowError = function (xhr, status, error) {
            var json = xhr.responseJSON;
            if (json === undefined)
                TwitchPotato.App.ErrorWindow.Show('{0} - {1}'.format(xhr.status, xhr.statusText));
            else
                TwitchPotato.App.ErrorWindow.Show('{0} - {1}: {2}'.format(json.status, json.error, json.message));
        };
        TwitchHandler.prototype.AuthenticationError = function (xhr, status, error) {
            this.ShowError(xhr, status, error);
        };
        TwitchHandler.prototype.GetNextChannels = function (url, offset, items, followed) {
            var _this = this;
            if (followed === void 0) { followed = false; }
            $.ajax({
                url: url + '&offset={0}'.format(offset),
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (json) { return _this.ParseChannelItems(json.streams, items, followed); },
            });
        };
        TwitchHandler.prototype.GetNextGames = function (url, offset) {
            var _this = this;
            $.ajax({
                url: url + '&offset={0}'.format(offset),
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (json) { return _this.ParseGameItems(json.top); },
            });
        };
        TwitchHandler.prototype.GetNextVideos = function (url, offset) {
            var _this = this;
            $.ajax({
                url: url + '&offset={0}'.format(offset),
                error: function (xhr, status, error) { return _this.ShowError(xhr, status, error); },
                success: function (json) { return _this.ParseVideosObject(json.videos); },
            });
        };
        TwitchHandler.prototype.ParseChannelItems = function (object, items, followed) {
            if (followed === void 0) { followed = false; }
            for (var key in object) {
                var data = object[key];
                if (data.stream !== undefined)
                    data = data.stream;
                items[data.channel.name] = {
                    name: data.channel.name,
                    streamer: data.channel.display_name,
                    title: data.channel.status || '',
                    viewers: data.viewers,
                    game: data.game || '',
                    preview: data.preview.large
                };
                if (followed)
                    this._followed[TwitchPotato.FollowType.Channel][data.channel.name] = true;
            }
        };
        TwitchHandler.prototype.ParseGameItems = function (object) {
            for (var key in object) {
                var data = object[key];
                if (data.game.name !== '') {
                    this._games[data.game.name] = {
                        name: data.game.name,
                        channels: data.channels || -1,
                        viewers: data.viewers || -1,
                        boxArt: data.game.box.large
                    };
                }
            }
        };
        TwitchHandler.prototype.ParseVideosObject = function (object) {
            for (var key in object) {
                var data = object[key];
                this._videos[data._id] = {
                    id: data._id,
                    name: data.channel.name,
                    streamer: data.channel.display_name,
                    title: data.title,
                    views: data.views,
                    length: data.length,
                    preview: (data.preview || '').replace(/320x240/, '640x360')
                };
            }
        };
        return TwitchHandler;
    })();
    TwitchPotato.TwitchHandler = TwitchHandler;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=twitch.js.map
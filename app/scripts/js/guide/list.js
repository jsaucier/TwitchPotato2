var TwitchPotato;
(function (TwitchPotato) {
    var GuideList = (function () {
        function GuideList() {
            this.SortChannels = function (a, b) {
                var aItem, bItem;
                aItem = TwitchPotato.App.Twitch.GetItems(TwitchPotato.App.Guide.Menu.selected)[a];
                bItem = TwitchPotato.App.Twitch.GetItems(TwitchPotato.App.Guide.Menu.selected)[b];
                var aIsFollowed = TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Channel, a);
                var bIsFollowed = TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Channel, b);
                var aNumber = aItem.viewers;
                var bNumber = bItem.viewers;
                aNumber += (aIsFollowed === true) ? 999999999 : aNumber;
                bNumber += (bIsFollowed === true) ? 999999999 : bNumber;
                if (aNumber > bNumber)
                    return -1;
                if (aNumber < bNumber)
                    return 1;
                if (aNumber === bNumber) {
                    a += (aIsFollowed === true) ? 'aaaaaaaaa' : a;
                    b += (bIsFollowed === true) ? 'aaaaaaaaa' : b;
                    if (a < b)
                        return -1;
                    if (a > b)
                        return 1;
                }
                return 0;
            };
            this.SortGames = function (a, b) {
                var aItem, bItem;
                aItem = TwitchPotato.App.Twitch.GetItems(TwitchPotato.App.Guide.Menu.selected)[a];
                bItem = TwitchPotato.App.Twitch.GetItems(TwitchPotato.App.Guide.Menu.selected)[b];
                var aIsFollowed = TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Game, a);
                var bIsFollowed = TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Game, b);
                var aIsHidden = TwitchPotato.App.Settings.IsGameHidden(a);
                var bIsHidden = TwitchPotato.App.Settings.IsGameHidden(b);
                var aNumber = aItem.viewers;
                var bNumber = bItem.viewers;
                if (aIsFollowed === true)
                    aNumber += 999999999;
                else if (aIsHidden === true)
                    aNumber += 99999999;
                if (bIsFollowed === true)
                    bNumber += 999999999;
                else if (bIsHidden === true)
                    bNumber += 99999999;
                if (aNumber > bNumber)
                    return -1;
                if (aNumber < bNumber)
                    return 1;
                if (aNumber === bNumber) {
                    aNumber = aItem.channels;
                    bNumber = bItem.channels;
                    if (aIsFollowed === true)
                        aNumber += 999999999;
                    else if (aIsHidden === true)
                        aNumber += 99999999;
                    if (bIsFollowed === true)
                        bNumber += 999999999;
                    else if (bIsHidden === true)
                        bNumber += 99999999;
                    if (aNumber > bNumber)
                        return -1;
                    if (aNumber < bNumber)
                        return 1;
                    if (aNumber === bNumber) {
                        a += (aIsFollowed === true) ? 'aaaaaaaaa' : a;
                        b += (bIsFollowed === true) ? 'aaaaaaaaa' : b;
                        if (a < b)
                            return -1;
                        if (a > b)
                            return 1;
                    }
                }
                return 0;
            };
            this._selected = {};
            this._isOpen = true;
        }
        GuideList.prototype.OnInput = function (input) {
            if (!TwitchPotato.App.Guide.isOpen)
                return false;
            switch (input) {
                case TwitchPotato.Inputs.Up:
                case TwitchPotato.Inputs.Down:
                    TwitchPotato.UpdateSelected('#list', '.item', input);
                    this._selected[TwitchPotato.App.Guide.Menu.selected] =
                        $('.item.selected', '#list').attr('key');
                    this.UpdateMenuScroll();
                    return true;
                case TwitchPotato.Inputs.PageUp:
                case TwitchPotato.Inputs.PageDown:
                    TwitchPotato.UpdateSelected('#list', '.item', input, 10);
                    this._selected[TwitchPotato.App.Guide.Menu.selected] =
                        $('.item.selected', '#list').attr('key');
                    return true;
                case TwitchPotato.Inputs.Select:
                    this.Select();
                    return true;
                default:
                    return false;
            }
        };
        GuideList.prototype.CreateItems = function (menu) {
            if (menu === void 0) { menu = TwitchPotato.App.Guide.Menu.selected; }
            var items = TwitchPotato.App.Twitch.GetItems(menu);
            var sorted = [];
            for (var key in items)
                sorted.push(key);
            if (menu === TwitchPotato.MenuType.Channels ||
                menu === TwitchPotato.MenuType.Game)
                sorted.sort(this.SortChannels);
            else if (menu === TwitchPotato.MenuType.Games)
                sorted.sort(this.SortGames);
            var html = '';
            for (var k in sorted) {
                k = sorted[k];
                var item = items[k];
                var isSelected = k === this._selected[menu];
                if (menu === TwitchPotato.MenuType.Channels ||
                    menu === TwitchPotato.MenuType.Game)
                    html += this.CreateChannelItem(item, k, isSelected);
                else if (menu === TwitchPotato.MenuType.Games) {
                    html += this.CreateGameItem(item, k, isSelected);
                }
            }
            $('#list').html(html);
            $('.item > div:empty()').remove();
            TwitchPotato.UpdateSelected('#list', '.item');
            this.UpdateMenuScroll();
            if (TwitchPotato.App.Guide.ItemMenu.isOpen)
                TwitchPotato.App.Guide.ItemMenu.Create();
            this.UpdateMouseHandlers();
        };
        GuideList.prototype.Toggle = function (openOrClose) {
            if (openOrClose == undefined)
                this._isOpen = !this._isOpen;
            else
                this._isOpen = openOrClose;
            $('#list').toggleClass('closed', !openOrClose);
        };
        GuideList.prototype.UpdateMouseHandlers = function () {
            var _this = this;
            var items = $('.item', '#list');
            items.off('mouseup');
            items.off('mouseover');
            items.css('cursor', '');
            if (TwitchPotato.App.Settings.isMouseEnabled) {
                items.on('mouseup', function (event) {
                    event.stopPropagation();
                    if (event.button === 0)
                        _this.Select(event);
                    else if (event.button === 2)
                        TwitchPotato.App.Guide.ItemMenu.Create(true);
                });
                items.on('mouseover', function (event) {
                    $('.item.selected', '#list').removeClass('selected');
                    var selected = $(event.currentTarget).addClass('selected');
                    _this._selected[TwitchPotato.App.Guide.Menu.selected] = selected.attr('key');
                });
                items.css('cursor', 'pointer');
            }
        };
        GuideList.prototype.UpdateMenuScroll = function () {
            var list = $('#list');
            var selected = $('.selected', '#list');
            if (selected.length !== 0) {
                var selectedItemTop = selected.offset().top;
                var halfListHeight = list.height() / 2;
                var halfItemHeight = selected.height() / 2;
                var scrollTop = list.scrollTop();
                var scroll = scrollTop + selectedItemTop - halfListHeight + halfItemHeight;
                list.scrollTop(scroll);
            }
        };
        GuideList.prototype.CreateChannelItem = function (channel, key, isSelected) {
            if (TwitchPotato.App.Settings.IsGameHidden(channel.game))
                return '';
            var html = '<div class="{0}" key="{1}">' +
                '   <div class="line">' +
                '       <div class="name">{2}</div>' +
                '       <div class="viewers">{3}</div>' +
                '   </div>' +
                '   <div class="game">{4}</div>' +
                '   <div class="title">{5}</div>' +
                '</div>';
            var isFollowing = TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Channel, key);
            var cls = 'item channels';
            if (isFollowing)
                cls += ' followed';
            if (isSelected)
                cls += ' selected';
            return html.format(cls, key, channel.streamer, channel.viewers.deliminate(), channel.game, channel.title);
        };
        GuideList.prototype.CreateGameItem = function (game, key, isSelected) {
            var html = '<div class="{0}" key="{1}">' +
                '   <div class="line">' +
                '       <div class="name">{2}</div>' +
                '       <div class="viewers">{3}</div>' +
                '   </div>' +
                '</div>';
            var isFollowing = TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Game, key);
            var isHidden = TwitchPotato.App.Settings.IsGameHidden(key);
            var cls = 'item games';
            if (isFollowing)
                cls += ' followed';
            if (isHidden)
                cls += ' hidden';
            if (isSelected)
                cls += ' selected';
            return html.format(cls, key, game.name, game.viewers.deliminate());
        };
        GuideList.prototype.Select = function (event) {
            var selected = $('.selected', '#list');
            if (event && event.target != null) {
                selected.removeClass('selected');
                selected = $(event.target);
                selected.addClass('selected');
            }
            var key = selected.attr('key');
            if (selected.hasClass('channels')) {
                TwitchPotato.App.Players.Play(key);
            }
            else if (selected.hasClass('games')) {
                TwitchPotato.App.LoadWindow.Open(true);
                TwitchPotato.App.Guide.Menu.selected = TwitchPotato.MenuType.Game;
                TwitchPotato.App.Twitch.GetGameChannels(key);
            }
        };
        Object.defineProperty(GuideList.prototype, "selected", {
            get: function () { return this._selected; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuideList.prototype, "isOpen", {
            get: function () { return this._isOpen; },
            enumerable: true,
            configurable: true
        });
        return GuideList;
    })();
    TwitchPotato.GuideList = GuideList;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=list.js.map
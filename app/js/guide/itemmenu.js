var TwitchPotato;
(function (TwitchPotato) {
    var GuideItemMenu = (function () {
        function GuideItemMenu() {
            this.contextMenu = '#guide #context-menu';
            this.selectedButton = '#guide #context-menu .button.selected';
            this._isOpen = false;
        }
        GuideItemMenu.prototype.OnInput = function (input) {
            if (!TwitchPotato.App.Guide.isOpen || !this._isOpen)
                return false;
            switch (input) {
                case TwitchPotato.Inputs.ContextMenu:
                    this.Destroy();
                    return true;
                case TwitchPotato.Inputs.Up:
                case TwitchPotato.Inputs.Down:
                    var s = TwitchPotato.UpdateSelected('#item-menu', '.menu-item', input);
                    this._selected = s.attr('action');
                    return true;
                case TwitchPotato.Inputs.Left:
                case TwitchPotato.Inputs.Right:
                    return true;
                case TwitchPotato.Inputs.Select:
                    this.Select();
                    return true;
                default:
                    return false;
            }
        };
        GuideItemMenu.prototype.Create = function (disableScroll) {
            if (disableScroll === void 0) { disableScroll = false; }
            var selected = this._selected;
            this.Destroy(disableScroll);
            var item = $('.selected', '#list');
            var html = '<div id="item-menu">';
            var key = item.attr('key');
            if (item.hasClass('channels') ||
                item.hasClass('game')) {
                var channel = TwitchPotato.App.Twitch.GetChannel(key);
                var isFollowingChannel = TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Channel, key);
                var isFollowingGame = TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Game, channel.game);
                var isHidden = TwitchPotato.App.Settings.IsGameHidden(key);
                html +=
                    '<div class="menu-item" action="multi-view" key="{0}">Multi View</div>' +
                        '<div class="menu-item" action="search" key="{1}">Browse Game</div>' +
                        '<div class="menu-item" action="follow-channel" key="{0}">{2} Channel</div>' +
                        '<div class="menu-item" action="follow-game" key="{1}">{3} Game</div>' +
                        '<div class="menu-item" action="hide" key="{1}">{4} Game</div>' +
                        '<div class="menu-item" action="videos" key="{0}">Browse Videos</div>' +
                        '<div class="menu-item" action="cancel">Cancel</div>';
                html = html.format(key, channel.game, isFollowingChannel ? 'Unfollow' : 'Follow', isFollowingGame ? 'Unfollow' : 'Follow', isHidden ? 'Unhide' : 'Hide');
            }
            else if (item.hasClass('games')) {
                var game = TwitchPotato.App.Twitch.GetGame(key);
                var isFollowing = TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Game, key);
                var isHidden = TwitchPotato.App.Settings.IsGameHidden(key);
                html +=
                    '<div class="menu-item" action="follow-game" key="{0}">{1} Game</div>' +
                        '<div class="menu-item" action="hide" key="{0}">{2} Game</div>' +
                        '<div class="menu-item" action="cancel">Cancel</div>';
                html = html.format(key, isFollowing ? 'Unfollow' : 'Follow', isHidden ? 'Unhide' : 'Hide');
            }
            html += '</div>';
            item.append(html);
            $('.menu-item[action="' + selected + '"]', '#item-menu')
                .addClass('selected');
            TwitchPotato.UpdateSelected('#item-menu', '.menu-item');
            this.UpdateMouseHandlers();
            if (!disableScroll)
                TwitchPotato.App.Guide.List.UpdateMenuScroll();
            this._isOpen = true;
        };
        GuideItemMenu.prototype.UpdateMouseHandlers = function () {
            var _this = this;
            var items = $('.menu-item', '#item-menu');
            items.off('mouseup');
            items.off('mouseover');
            items.css('cursor', '');
            if (TwitchPotato.App.Settings.isMouseEnabled) {
                items.on('mouseup', function (event) {
                    if (event.button !== 0)
                        return;
                    event.stopPropagation();
                    _this.Select(event);
                });
                items.on('mouseover', function (event) {
                    $('.menu-item.selected', '#item-menu').removeClass('selected');
                    var s = $(event.currentTarget).addClass('selected');
                    _this._selected = s.attr('action');
                });
            }
        };
        GuideItemMenu.prototype.Destroy = function (disableScroll) {
            if (disableScroll === void 0) { disableScroll = false; }
            $('#item-menu').remove();
            this._selected = undefined;
            if (!disableScroll)
                TwitchPotato.App.Guide.List.UpdateMenuScroll();
            this._isOpen = false;
        };
        GuideItemMenu.prototype.Select = function (event) {
            var selected = $('.menu-item.selected', '#item-menu');
            if (event && event.target != null)
                selected = $(event.target);
            var action = selected.attr('action');
            var key = selected.attr('key');
            switch (action) {
                case 'multi-view':
                    TwitchPotato.App.Players.Play(key, false, true);
                    break;
                case 'search':
                    TwitchPotato.App.Twitch.GetGameChannels(key);
                    TwitchPotato.App.Guide.Menu.selected = TwitchPotato.MenuType.Game;
                    break;
                case 'follow-channel':
                    TwitchPotato.App.Twitch.Follow(key, TwitchPotato.FollowType.Channel);
                    break;
                case 'follow-game':
                    TwitchPotato.App.Twitch.Follow(key, TwitchPotato.FollowType.Game);
                    break;
                case 'hide':
                    TwitchPotato.App.Settings.HideGame(key);
                    TwitchPotato.App.Guide.List.CreateItems();
                    break;
                case 'videos':
                    TwitchPotato.App.Twitch.GetChannelVideos(key);
                    TwitchPotato.App.Guide.Menu.selected = TwitchPotato.MenuType.Videos;
                    break;
                default:
                    break;
            }
            this.Destroy();
        };
        Object.defineProperty(GuideItemMenu.prototype, "isOpen", {
            get: function () { return this._isOpen; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuideItemMenu.prototype, "selected", {
            get: function () { return this._selected; },
            enumerable: true,
            configurable: true
        });
        return GuideItemMenu;
    })();
    TwitchPotato.GuideItemMenu = GuideItemMenu;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=itemmenu.js.map
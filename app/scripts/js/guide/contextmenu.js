var TwitchPotato;
(function (TwitchPotato) {
    var ContextMenuHandler = (function () {
        function ContextMenuHandler() {
            this.contextMenu = '#guide #context-menu';
            this.selectedButton = '#guide #context-menu .button.selected';
        }
        ContextMenuHandler.prototype.HandleInput = function (input, item) {
            if ($(this.contextMenu).length === 0)
                return false;
            switch (input) {
                case TwitchPotato.Inputs.ContextMenu:
                    this.Show(item);
                    return true;
                case TwitchPotato.Inputs.Up:
                    this.UpdateButton(TwitchPotato.Direction.Up);
                    return true;
                case TwitchPotato.Inputs.Down:
                    this.UpdateButton(TwitchPotato.Direction.Down);
                    return true;
                case TwitchPotato.Inputs.Select:
                    this.SelectButton(item);
                    return true;
                default:
                    return false;
            }
        };
        ContextMenuHandler.prototype.Close = function () {
            $(this.contextMenu).remove();
            TwitchPotato.App.Guide.List.UpdateMenuScroll();
        };
        ContextMenuHandler.prototype.Update = function (item, type) {
            this.Show(item);
            $(this.selectedButton).removeClass('selected');
            $(this.contextMenu)
                .find('.button[type="' + type + '"]')
                .addClass('selected');
        };
        ContextMenuHandler.prototype.Show = function (item) {
            if ($(this.contextMenu).length !== 0)
                return this.Close();
            var menu = parseInt(item.attr('menu'));
            if (menu === TwitchPotato.MenuType.Videos)
                return;
            var html = $($('#context-menu-template').html());
            if (menu === TwitchPotato.MenuType.Games) {
                html.find('[type="search-games"]').remove();
                html.find('[type="search-videos"]').remove();
                html.find('[type="view-multi"]').remove();
                html.find('[type="follow-channel"]').remove();
                html.find('[type="unfollow-channel"]').remove();
            }
            var key = item.attr('key');
            if (menu === TwitchPotato.MenuType.Channels || menu === TwitchPotato.MenuType.Game) {
                var game = item.attr('game');
                if (TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Channel, key) === false)
                    html.find('[type="unfollow-channel"]').remove();
                if (TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Channel, key))
                    html.find('[type="follow-channel"]').remove();
                if (TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Game, game) === false)
                    html.find('[type="unfollow-game"]').remove();
                if (TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Game, game))
                    html.find('[type="follow-game"]').remove();
            }
            else if (menu === TwitchPotato.MenuType.Games) {
                if (TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Game, key) === false)
                    html.find('[type="unfollow-game"]').remove();
                if (TwitchPotato.App.Twitch.IsFollowing(TwitchPotato.FollowType.Game, key))
                    html.find('[type="follow-game"]').remove();
                if (TwitchPotato.App.Settings.IsGameHidden(key) === true)
                    html.find(['type="hide-game"]']).remove();
                else
                    html.find(['type="unhide-game"]']).remove();
            }
            var hidden = TwitchPotato.App.Settings.IsGameHidden(game || key) || false;
            this.AddMenuItem(html, {
                'type': 'hide-game',
                'hide': !hidden,
                'key': game || key,
            });
            html.find('.button:eq(0)').addClass('selected');
            html.appendTo(item);
            TwitchPotato.App.Guide.List.UpdateMenuScroll();
        };
        ContextMenuHandler.prototype.AddMenuItem = function (html, attrs) {
            return $('<div>')
                .addClass('button')
                .attr(attrs)
                .insertBefore(html.find('[type="cancel"]'));
        };
        ContextMenuHandler.prototype.UpdateButton = function (direction) {
            var index = $(this.contextMenu).find('.button:visible')
                .index($(this.selectedButton));
            if (index === -1)
                index = 0;
            if (direction === TwitchPotato.Direction.Down)
                index++;
            else if (direction === TwitchPotato.Direction.Up)
                index--;
            if (index < 0)
                index = 0;
            if (index > $(this.contextMenu).find('.button:visible').length - 1)
                index = $(this.contextMenu).find('.button:visible').length - 1;
            $(this.selectedButton).removeClass('selected');
            $(this.contextMenu)
                .find('.button')
                .eq(index)
                .addClass('selected');
        };
        ContextMenuHandler.prototype.SelectButton = function (item) {
            var key = item.attr('key');
            var type = $(this.selectedButton).attr('type');
            switch (type) {
                case 'cancel':
                    this.Close();
                    break;
                case 'view-multi':
                    TwitchPotato.App.Players.Play(key, false, true);
                    break;
                case 'search-games':
                    var game = item.attr('game');
                    $('.list').eq(TwitchPotato.MenuType.Game).find('.head').text(game);
                    TwitchPotato.App.Twitch.GetGameChannels(game);
                    break;
                case 'search-videos':
                    $('.list').eq(TwitchPotato.MenuType.Videos).hide();
                    TwitchPotato.App.Twitch.GetChannelVideos(key);
                    break;
                case 'follow-channel':
                    TwitchPotato.App.Twitch.Follow(key, TwitchPotato.FollowType.Channel);
                    break;
                case 'unfollow-channel':
                    TwitchPotato.App.Twitch.Follow(key, TwitchPotato.FollowType.Channel, true);
                    break;
                case 'follow-game':
                    var game = item.attr('game') || item.attr('key');
                    TwitchPotato.App.Twitch.Follow(game, TwitchPotato.FollowType.Game);
                    break;
                case 'unfollow-game':
                    var game = item.attr('game') || item.attr('key');
                    TwitchPotato.App.Twitch.Follow(game, TwitchPotato.FollowType.Game, true);
                    break;
                case 'hide-game':
                    var hide = ($(this.selectedButton).attr('hide') === 'true') ? true : false;
                    var game = $(this.selectedButton).attr('key');
                    TwitchPotato.App.Settings.HideGame(game, hide);
                    TwitchPotato.App.Guide.Refresh();
                    break;
                default:
                    break;
            }
            this.Close();
        };
        return ContextMenuHandler;
    })();
    TwitchPotato.ContextMenuHandler = ContextMenuHandler;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=contextmenu.js.map
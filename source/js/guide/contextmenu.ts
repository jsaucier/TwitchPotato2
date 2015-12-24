module TwitchPotato {

    export class ContextMenuHandler {

        /** Gets the #context-menu jQuery element. */
        private contextMenu = '#guide #context-menu';
        /** Gets the selected button on the context menu. */
        private selectedButton = '#guide #context-menu .button.selected';

        /** Handles input for the context menu. */
        HandleInput(input: Inputs, item: JQuery): boolean {

            /** Context menu is not visible, return false. */
            if ($(this.contextMenu).length === 0) return false;

            switch (input) {

                case Inputs.ContextMenu:
                    this.Show(item);
                    return true;
                case Inputs.Up:
                    this.UpdateButton(Direction.Up);
                    return true;
                case Inputs.Down:
                    this.UpdateButton(Direction.Down);
                    return true;
                case Inputs.Select:
                    this.SelectButton(item);
                    return true;
                default:
                    return false;
            }
        }

        /** Closes the context menu. */
        Close() {

            $(this.contextMenu).remove();

            App.Guide.List.UpdateMenuScroll();
        }

        /** Updates the context menu after the guide refreshes. */
        Update(item, type: string) {

            this.Show(item);

            /** Remove selected menu item. */
            $(this.selectedButton).removeClass('selected');

            $(this.contextMenu)
                .find('.button[type="' + type + '"]')
                .addClass('selected')
        }

        /** Shows the context menu for the item. */
        Show(item: JQuery): void {

            /** Remove the context menu from the DOM. */
            if ($(this.contextMenu).length !== 0) return this.Close();

            /** The selected item menu type. */
            var menu = parseInt(item.attr('menu'));

            /** Context menu is disabled for videos. */
            if (menu === MenuType.Videos) return;

            /** The context menu template. */
            var html = $($('#context-menu-template').html());

            if (menu === MenuType.Games) {
                /** Remove unused buttons. */
                html.find('[type="search-games"]').remove();
                html.find('[type="search-videos"]').remove();
                html.find('[type="view-multi"]').remove();
                html.find('[type="follow-channel"]').remove();
                html.find('[type="unfollow-channel"]').remove();
            }

            /** The selected item key. */
            var key = item.attr('key');

            if (menu === MenuType.Channels || menu === MenuType.Game) {

                /** The selected item game. */
                var game = item.attr('game');

                if (App.Twitch.IsFollowing(FollowType.Channel, key) === false)
                    html.find('[type="unfollow-channel"]').remove();

                if (App.Twitch.IsFollowing(FollowType.Channel, key))
                    html.find('[type="follow-channel"]').remove();

                if (App.Twitch.IsFollowing(FollowType.Game, game) === false)
                    html.find('[type="unfollow-game"]').remove();

                if (App.Twitch.IsFollowing(FollowType.Game, game))
                    html.find('[type="follow-game"]').remove();
            }
            else if (menu === MenuType.Games) {

                if (App.Twitch.IsFollowing(FollowType.Game, key) === false)
                    html.find('[type="unfollow-game"]').remove();

                if (App.Twitch.IsFollowing(FollowType.Game, key))
                    html.find('[type="follow-game"]').remove();

                if (App.Settings.IsGameHidden(key) === true)
                    html.find(['type="hide-game"]']).remove();
                else
                    html.find(['type="unhide-game"]']).remove();
            }

            /** Gets if the game is hidden. */
            var hidden = App.Settings.IsGameHidden(game || key) || false;

            /** Create the hide-game menu item. */
            this.AddMenuItem(html, {
                'type': 'hide-game',
                'hide': !hidden,
                'key': game || key,
            });

            /** Select the appropriate button. */
            html.find('.button:eq(0)').addClass('selected');

            /** Appened the context menu to the item. */
            html.appendTo(item);

            /** Scroll the guide menu. */
            App.Guide.List.UpdateMenuScroll();
        }

        /** Create a context menu item. */
        private AddMenuItem(html: JQuery, attrs: { [key: string]: any }): JQuery {

            return $('<div>')
                .addClass('button')
                .attr(attrs)
                .insertBefore(html.find('[type="cancel"]'));
        }

        /** Update the selected button. */
        private UpdateButton(direction: Direction): void {

            /** The index of the selected menu item. */
            var index = $(this.contextMenu).find('.button:visible')
                .index($(this.selectedButton));

            /** Set default menu item. */
            if (index === -1)
                index = 0;

            /** Update the selected item index. */
            if (direction === Direction.Down)
                index++;
            else if (direction === Direction.Up)
                index--;

            /** Set the bounds for the index. */
            if (index < 0)
                index = 0;
            if (index > $(this.contextMenu).find('.button:visible').length - 1)
                index = $(this.contextMenu).find('.button:visible').length - 1;

            /** Remove selected menu item. */
            $(this.selectedButton).removeClass('selected');

            /** Select the new menu item. */
            $(this.contextMenu)
                .find('.button')
                .eq(index)
                .addClass('selected');
        }

        /** Selects the button. */
        private SelectButton(item: JQuery): void {

            /** The key of the selected item. */
            var key = item.attr('key');

            /** The button type that is selected. */
            var type = $(this.selectedButton).attr('type');

            switch (type) {
                case 'cancel':
                    this.Close();
                    break;
                case 'view-multi':
                    /** Play the channel in multi mode. */
                    App.Players.Play(key, false, true);
                    break;
                case 'search-games':
                    /** The game of the selected item. */
                    var game = item.attr('game');

                    /** Set the game title */
                    $('.list').eq(MenuType.Game).find('.head').text(game);

                    /** Set the update type. */
                    // App.Guide.SetUpdateType(UpdateType.Game);

                    /** Search for more games of this type. */
                    App.Twitch.GetGameChannels(game);
                    break;
                case 'search-videos':
                    /** Hide the game menu. */
                    $('.list').eq(MenuType.Videos).hide();

                    /** Set the update type. */
                    // App.Guide.SetUpdateType(UpdateType.Videos);

                    /** Search for videos from this streamer */
                    App.Twitch.GetChannelVideos(key);
                    break;
                case 'follow-channel':
                    /** Follow the channel. */
                    App.Twitch.Follow(key, FollowType.Channel);
                    break
                case 'unfollow-channel':
                    /** Unfollow the channel. */
                    App.Twitch.Follow(key, FollowType.Channel, true);
                    break
                case 'follow-game':
                    var game = item.attr('game') || item.attr('key');

                    /** Follow the game. */
                    App.Twitch.Follow(game, FollowType.Game);
                    break;
                case 'unfollow-game':
                    var game = item.attr('game') || item.attr('key');

                    /** Unfollow the game. */
                    App.Twitch.Follow(game, FollowType.Game, true);
                    break;
                case 'hide-game':
                    var hide = ($(this.selectedButton).attr('hide') === 'true') ? true : false;
                    var game = $(this.selectedButton).attr('key');
                    App.Settings.HideGame(game, hide);
                    App.Guide.Refresh();
                    break;
                default:
                    break;
            }

            this.Close();
        }
    }
}

module TwitchPotato {

    export class GuideItemMenu {

        /** Handles input for the action menu. */
        OnInput(input: Inputs): boolean {

            if (!App.Guide.isOpen || !this._isOpen) return false;

            switch (input) {

                case Inputs.ContextMenu:
                    this.Destroy();
                    return true;

                case Inputs.Up:
                case Inputs.Down:
                    var s = UpdateSelected('#item-menu', '.menu-item', input);
                    this._selected = s.attr('action');
                    return true;

                case Inputs.Left:
                case Inputs.Right:
                    return true;

                case Inputs.Select:
                    this.Select();
                    return true;

                default:
                    return false;
            }
        }

        /** Creates the item menu. */
        Create(disableScroll = false): void {

            var selected = this._selected;

            this.Destroy(disableScroll);

            var item = $('.selected', '#list');

            var html = '<div id="item-menu">';

            var key = item.attr('key');

            if (item.hasClass('channels') ||
                item.hasClass('game')) {

                var channel = App.Twitch.GetChannel(key);

                var isFollowingChannel = App.Twitch.IsFollowing(FollowType.Channel, key);
                var isFollowingGame = App.Twitch.IsFollowing(FollowType.Game, channel.game);
                var isHidden = App.Settings.IsGameHidden(key);

                html +=
                '<div class="menu-item" action="multi-view" key="{0}">Multi View</div>' +
                '<div class="menu-item" action="search" key="{1}">Browse Game</div>' +
                '<div class="menu-item" action="follow-channel" key="{0}">{2} Channel</div>' +
                '<div class="menu-item" action="follow-game" key="{1}">{3} Game</div>' +
                '<div class="menu-item" action="hide" key="{1}">{4} Game</div>' +
                '<div class="menu-item" action="videos" key="{0}">Browse Videos</div>' +
                '<div class="menu-item" action="cancel">Cancel</div>';

                html = html.format(
                    key,
                    channel.game,
                    isFollowingChannel ? 'Unfollow' : 'Follow',
                    isFollowingGame ? 'Unfollow' : 'Follow',
                    isHidden ? 'Unhide' : 'Hide');

            } else if (item.hasClass('games')) {

                var game = App.Twitch.GetGame(key);

                var isFollowing = App.Twitch.IsFollowing(FollowType.Game, key);
                var isHidden = App.Settings.IsGameHidden(key);

                html +=
                '<div class="menu-item" action="follow-game" key="{0}">{1} Game</div>' +
                '<div class="menu-item" action="hide" key="{0}">{2} Game</div>' +
                '<div class="menu-item" action="cancel">Cancel</div>';

                html = html.format(
                    key,
                    isFollowing ? 'Unfollow' : 'Follow',
                    isHidden ? 'Unhide' : 'Hide');
            }

            html += '</div>';

            item.append(html);

            $('.menu-item[action="' + selected + '"]', '#item-menu')
                .addClass('selected');

            UpdateSelected('#item-menu', '.menu-item');

            this.UpdateMouseHandlers();

            if (!disableScroll)
                App.Guide.List.UpdateMenuScroll();

            this._isOpen = true;
        }

        /** Updates the mouse handlers for the item-menu. */
        UpdateMouseHandlers(): void {

            var items = $('.menu-item', '#item-menu');

            items.off('mouseup');
            items.off('mouseover');

            items.css('cursor', '');

            if (App.Settings.isMouseEnabled) {

                items.on('mouseup',(event: Event) => {
                    if (event.button !== 0) return;
                    event.stopPropagation();
                    this.Select(event);
                });

                items.on('mouseover',(event: Event) => {
                    $('.menu-item.selected', '#item-menu').removeClass('selected');
                    var s = $(event.currentTarget).addClass('selected');
                    this._selected = s.attr('action');
                })
            }
        }

        /** Destroys the context menu. */
        Destroy(disableScroll = false) {

            $('#item-menu').remove();
            this._selected = undefined;

            if (!disableScroll)
                App.Guide.List.UpdateMenuScroll();

            this._isOpen = false;
        }

        /** Selects the menu item. */
        private Select(event?: Event) {

            var selected = $('.menu-item.selected', '#item-menu');

            if (event && event.target != null)
                selected = $(event.target);

            var action = selected.attr('action');
            var key = selected.attr('key');

            switch (action) {

                case 'multi-view':
                    App.Players.Play(key, false, true);
                    break;

                case 'search':
                    App.Twitch.GetGameChannels(key);
                    App.Guide.Menu.selected = MenuType.Game;
                    break;

                case 'follow-channel':
                    App.Twitch.Follow(key, FollowType.Channel);
                    break;

                case 'follow-game':
                    App.Twitch.Follow(key, FollowType.Game);
                    break;

                case 'hide':
                    App.Settings.HideGame(key);
                    App.Guide.List.CreateItems();
                    break;

                case 'videos':
                    App.Twitch.GetChannelVideos(key);
                    App.Guide.Menu.selected = MenuType.Videos;
                    break;

                default:
                    break;
            }

            this.Destroy();
        }

        private contextMenu = '#guide #context-menu';
        private selectedButton = '#guide #context-menu .button.selected';

        private _isOpen = false;
        get isOpen(): boolean { return this._isOpen; }

        private _selected;
        get selected(): string { return this._selected; }
    }
}

module TwitchPotato {

    export class GuideList {

        /** Handles input for the menu. */
        OnInput(input: Inputs): boolean {

            if (!App.Guide.isOpen) return false;

            switch (input) {

                case Inputs.Up:
                case Inputs.Down:
                    UpdateSelected('#list', '.item', input);
                    this._selected[App.Guide.Menu.selected] =
                    $('.item.selected', '#list').attr('key');

                    this.UpdateMenuScroll();
                    return true;

                case Inputs.PageUp:
                case Inputs.PageDown:
                    UpdateSelected('#list', '.item', input, 10);
                    this._selected[App.Guide.Menu.selected] =
                    $('.item.selected', '#list').attr('key');
                    return true;

                case Inputs.Select:
                    this.Select();
                    return true;

                default:
                    return false;
            }
        }

        /** Creates the list items. */
        CreateItems(menu = App.Guide.Menu.selected): void {

            var items = App.Twitch.GetItems(menu);

            var sorted: string[] = [];

            for (var key in items)
                sorted.push(key);

            if (menu === MenuType.Channels ||
                menu === MenuType.Game)
                sorted.sort(this.SortChannels);
            else if (menu === MenuType.Games)
                sorted.sort(this.SortGames);

            var html = '';

            for (var k in sorted) {

                k = sorted[k];

                var item = items[k];
                var isSelected = k === this._selected[menu];

                if (menu === MenuType.Channels ||
                    menu === MenuType.Game)
                    html += this.CreateChannelItem(item, k, isSelected, menu);
                else if (menu === MenuType.Games) {
                    html += this.CreateGameItem(item, k, isSelected);
                }
            }

            $('#list').html(html);

            /** Clean up any empty item divs. */
            $('.item > div:empty()').remove();

            UpdateSelected('#list', '.item');
            this.UpdateMenuScroll();

            if (App.Guide.ItemMenu.isOpen)
                App.Guide.ItemMenu.Create();

            this.UpdateMouseHandlers();
        }

        /** Toggles the menu open or closed. */
        Toggle(openOrClose?: boolean): void {

            if (openOrClose == undefined)
                this._isOpen = !this._isOpen;
            else
                this._isOpen = openOrClose;

            $('#list').toggleClass('closed', !openOrClose);
        }

        /** Updaetes the mouse handlers for the menu list. */
        UpdateMouseHandlers(): void {

            var items = $('.item', '#list');

            items.off('mouseup');
            items.off('mouseover');

            items.css('cursor', '');

            if (App.Settings.isMouseEnabled) {

                items.on('mouseup', (event: Event) => {
                    event.stopPropagation();
                    if (event.button === 0)
                        this.Select(event);
                    else if (event.button === 2)
                        App.Guide.ItemMenu.Create(true);
                });

                items.on('mouseover', (event: Event) => {
                    // event.stopPropagation();
                    $('.item.selected', '#list').removeClass('selected');
                    var selected = $(event.currentTarget).addClass('selected');
                    this._selected[App.Guide.Menu.selected] = selected.attr('key');
                });

                items.css('cursor', 'pointer');
            }
        }

        UpdateMenuScroll(): void {
            $('#list').scrollToMiddle('#list .selected');
        }

        private CreateChannelItem(channel: TwitchChannel, key: string, isSelected: boolean, menu: MenuType): string {

            if (App.Settings.IsGameHidden(channel.Game) && menu !== MenuType.Game) return '';

            var html =
                '<div class="{0}" key="{1}">' +
                '   <div class="line">' +
                '       <div class="name">{2}</div>' +
                '       <div class="viewers">{3}</div>' +
                '   </div>' +
                '   <div class="game">{4}</div>' +
                '   <div class="title">{5}</div>' +
                '</div>';

            var isFollowing = App.Twitch.IsFollowing(FollowType.Channel, key);

            var cls = 'item channels';
            if (isFollowing) cls += ' followed';
            if (isSelected) cls += ' selected';

            return html.format(
                cls,
                key,
                channel.Streamer,
                channel.Viewers.deliminate(),
                channel.Game,
                channel.Title);
        }

        private CreateGameItem(game: TwitchGame, key: string, isSelected: boolean): string {

            var html =
                '<div class="{0}" key="{1}">' +
                '   <div class="line">' +
                '       <div class="name">{2}</div>' +
                '       <div class="viewers">{3}</div>' +
                '   </div>' +
                '</div>';

            var isFollowing = App.Twitch.IsFollowing(FollowType.Game, key);
            var isHidden = App.Settings.IsGameHidden(key);

            var cls = 'item games';
            if (isFollowing) cls += ' followed';
            if (isHidden) cls += ' hidden';
            if (isSelected) cls += ' selected';

            return html.format(
                cls,
                key,
                game.name,
                game.viewers.deliminate());
        }

        private Select(event?: Event): void {

            var selected = $('.selected', '#list');

            if (event && event.target != null) {

                selected.removeClass('selected');
                selected = $(event.target);
                selected.addClass('selected');
            }

            var key = selected.attr('key');

            if (selected.hasClass('channels')) {
                App.Players.Play(key);
            }
            else if (selected.hasClass('games')) {

                App.LoadWindow.Open(true);
                App.Guide.Menu.selected = MenuType.Game;
                App.Twitch.GetGameChannels(key);
            }

        }

        private SortChannels = (a: string, b: string): number => {
            var aItem: TwitchChannel,
                bItem: TwitchChannel;

            aItem = <TwitchChannel>App.Twitch.GetItems(App.Guide.Menu.selected)[a];
            bItem = <TwitchChannel>App.Twitch.GetItems(App.Guide.Menu.selected)[b];

            var aIsFollowed = App.Twitch.IsFollowing(FollowType.Channel, a);
            var bIsFollowed = App.Twitch.IsFollowing(FollowType.Channel, b);

            var aNumber = aItem.Viewers;
            var bNumber = bItem.Viewers;

            aNumber += (aIsFollowed === true) ? 999999999 : aNumber;
            bNumber += (bIsFollowed === true) ? 999999999 : bNumber;

            if (aNumber > bNumber)
                return -1;
            if (aNumber < bNumber)
                return 1;

            /** Viewers are equal, sort by streamer instead. */
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

        private SortGames = (a: string, b: string): number => {
            var aItem: TwitchGame,
                bItem: TwitchGame;

            aItem = <TwitchGame>App.Twitch.GetItems(App.Guide.Menu.selected)[a];
            bItem = <TwitchGame>App.Twitch.GetItems(App.Guide.Menu.selected)[b];

            var aIsFollowed = App.Twitch.IsFollowing(FollowType.Game, a);
            var bIsFollowed = App.Twitch.IsFollowing(FollowType.Game, b);

            var aIsHidden = App.Settings.IsGameHidden(a);
            var bIsHidden = App.Settings.IsGameHidden(b);

            var aNumber = aItem.viewers;
            var bNumber = bItem.viewers;

            if (aIsFollowed === true) aNumber += 999999999;
            else if (aIsHidden === true) aNumber += 99999999;
            if (bIsFollowed === true) bNumber += 999999999;
            else if (bIsHidden === true) bNumber += 99999999;

            if (aNumber > bNumber)
                return -1;
            if (aNumber < bNumber)
                return 1;

            /** Viewers are equal, sort by channels instead. */
            if (aNumber === bNumber) {
                aNumber = aItem.channels;
                bNumber = bItem.channels;

                if (aIsFollowed === true) aNumber += 999999999;
                else if (aIsHidden === true) aNumber += 99999999;
                if (bIsFollowed === true) bNumber += 999999999;
                else if (bIsHidden === true) bNumber += 99999999;

                if (aNumber > bNumber)
                    return -1;
                if (aNumber < bNumber)
                    return 1;

                /** Channels are equal, sort by key instead. */
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

        private _selected: { [menu: number]: string } = {};
        get selected(): { [menu: number]: string } { return this._selected; }

        private _isOpen = true;
        get isOpen(): boolean { return this._isOpen; }
    }
}

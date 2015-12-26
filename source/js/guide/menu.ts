module TwitchPotato {

    export class GuideMenu {

        constructor() {
            $('#version').text(chrome.runtime.getManifest().version);
        }

        /** Handles input for the menu. */
        OnInput(input: Inputs): boolean {

            if (!App.Guide.isOpen || !this._isOpen) return false;

            switch (input) {
                case Inputs.Left:
                case Inputs.Right:
                    this.Cancel();
                    return true;

                case Inputs.Select:
                    this.Select();
                    return true;

                case Inputs.Up:
                case Inputs.Down:
                    var s = UpdateSelected('#menu-items', '.item', input);
                    this.UpdateMenuText(s.text());
                    return true;

                default:
                    return false;
            }
        }

        /** Creates the menu items. */
        CreateItems(menu = this._selected): void {

            var selection = -1;
            var selected = $('.item.selected', '#menu-items');

            if (this._isOpen) {
                if (selected.length > 0 &&
                    selected.attr('menu'))
                    selection = menu;
            }
            else
                selection = this._selected;

            $('.item[menu]', '#menu-items').remove();

            var html = '';

            for (var i = 0; i < Object.keys(MenuType).length / 2; i++) {

                var cls = (selection === i) ? 'item selected' : 'item';
                var name = MenuType[i];

                if (i === MenuType.Game && App.Twitch.lastSearch !== undefined)
                    name = App.Twitch.lastSearch;

                if (Object.keys(App.Twitch.GetItems(i)).length > 0)
                    html += '<div class="{0}" menu="{1}">{2}</div>'
                        .format(cls, i, name);
            }

            $('#menu-items').prepend(html);

            UpdateSelected('#menu-items', '.item');

            this.UpdateMenuText();

            this.UpdateMouseHandlers();
        }

        /** Toggles the menu open or closed. */
        Toggle(openOrClose?: boolean): void {

            if (openOrClose === null && this._isOpen)
                return this.Cancel();

            if (openOrClose === undefined || openOrClose === null)
                this._isOpen = !this._isOpen;
            else
                this._isOpen = openOrClose;

            $('#menu').toggleClass('closed', !this._isOpen);
        }

        /** Update mouse event handlers. */
        UpdateMouseHandlers(): void {

            var expander = $('#expander');
            var items = $('.item', '#menu-items');

            expander.off('mouseup');
            items.off('mouseup');
            items.off('mouseover');

            expander.css('cursor', '');
            items.css('cursor', '');

            if (App.Settings.isMouseEnabled) {

                expander.on('mouseup', () => {
                    expander
                    if (event.button !== 0) return;
                    this.Toggle(null)
                });

                items.on('mouseup', (event: Event) => {
                    if (event.button !== 0) return;
                    event.stopPropagation();
                    this.Select($(event.target));
                });

                items.on('mouseover', (event: Event) => {
                    event.stopPropagation();
                    $('.selected', '#menu-items').removeClass('selected');
                    var selected = $(event.target).addClass('selected');
                    this.UpdateMenuText(selected.text());
                });

                expander.css('cursor', 'pointer');
                items.css('cursor', 'pointer');
            }
        }

        /** Refreshes the menu text. */
        UpdateMenuText(text?: string, selected?: JQuery): void {

            if (selected === undefined && text === undefined)
                selected = $('.item.selected', '#menu-items');

            if (text === undefined)
                text = selected.text();

            $('#menu-text').text(text);
        }

        /** Selects the currently selected menu. */
        private Select(element?: JQuery): void {

            var selected = $('.selected', '#menu-items');

            if (element != null) {

                selected.removeClass('selected');
                selected = element;
                selected.addClass('selected');

                this.UpdateMenuText(selected.text());
            }

            if (!selected.hasClass('setting'))
                this.ItemSelection(selected);
            else
                this.SettingSelection(selected);
        }

        private ItemSelection(selected: JQuery): void {
            this._selected = parseInt(selected.attr('menu'));

            App.Guide.List.CreateItems(this._selected);

            this.Toggle(false);
            App.Guide.List.Toggle(true);
        }

        private SettingSelection(selected: JQuery): void {

            switch (selected.attr('id')) {

                case 'keybinds':
                    App.Guide.Keybinds.Open();
                    break;

                case 'logout':
                    App.Authenticator.LogOut();
                    this.Cancel();
                    break;

                case 'reset':
                    App.Settings.Load((settings) => App.Guide.List.CreateItems(), true);
                    this.Cancel();
                    break;

                case 'mouse':
                    App.Settings.isMouseEnabled = !App.Settings.isMouseEnabled;
                    break;

                case 'exit':
                    window.close();
                    break;

                default:
                    break;
            }
        }

        /** Cancels the menu selection. */
        private Cancel(): void {

            $('.selected', '#menu-items').removeClass('selected');

            var selected = $('.item[menu="' + this._selected + '"]', '#menu-items');

            selected.addClass('selected');

            this.UpdateMenuText(selected.text());

            this.Toggle(false);
            App.Guide.List.Toggle(true);
        }

        private _selected = MenuType.Channels;
        get selected(): MenuType { return this._selected; }
        set selected(menu: MenuType) { this._selected = menu; }

        private _isOpen = false;
        get isOpen(): boolean { return this._isOpen; }
    }
}

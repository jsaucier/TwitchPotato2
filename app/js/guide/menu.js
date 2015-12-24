var TwitchPotato;
(function (TwitchPotato) {
    var GuideMenu = (function () {
        function GuideMenu() {
            this._selected = TwitchPotato.MenuType.Channels;
            this._isOpen = false;
            $('#version').text(chrome.runtime.getManifest().version);
        }
        GuideMenu.prototype.OnInput = function (input) {
            if (!TwitchPotato.App.Guide.isOpen || !this._isOpen)
                return false;
            switch (input) {
                case TwitchPotato.Inputs.Left:
                case TwitchPotato.Inputs.Right:
                    this.Cancel();
                    return true;
                case TwitchPotato.Inputs.Select:
                    this.Select();
                    return true;
                case TwitchPotato.Inputs.Up:
                case TwitchPotato.Inputs.Down:
                    var s = TwitchPotato.UpdateSelected('#menu-items', '.item', input);
                    this.UpdateMenuText(s.text());
                    return true;
                default:
                    return false;
            }
        };
        GuideMenu.prototype.CreateItems = function (menu) {
            if (menu === void 0) { menu = this._selected; }
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
            for (var i = 0; i < Object.keys(TwitchPotato.MenuType).length / 2; i++) {
                var cls = (selection === i) ? 'item selected' : 'item';
                var name = TwitchPotato.MenuType[i];
                if (i === TwitchPotato.MenuType.Game && TwitchPotato.App.Twitch.lastSearch !== undefined)
                    name = TwitchPotato.App.Twitch.lastSearch;
                if (Object.keys(TwitchPotato.App.Twitch.GetItems(i)).length > 0)
                    html += '<div class="{0}" menu="{1}">{2}</div>'
                        .format(cls, i, name);
            }
            $('#menu-items').prepend(html);
            TwitchPotato.UpdateSelected('#menu-items', '.item');
            this.UpdateMenuText();
            this.UpdateMouseHandlers();
        };
        GuideMenu.prototype.Toggle = function (openOrClose) {
            if (openOrClose === null && this._isOpen)
                return this.Cancel();
            if (openOrClose === undefined || openOrClose === null)
                this._isOpen = !this._isOpen;
            else
                this._isOpen = openOrClose;
            $('#menu').toggleClass('closed', !this._isOpen);
        };
        GuideMenu.prototype.UpdateMouseHandlers = function () {
            var _this = this;
            var expander = $('#expander');
            var items = $('.item', '#menu-items');
            expander.off('mouseup');
            items.off('mouseup');
            items.off('mouseover');
            expander.css('cursor', '');
            items.css('cursor', '');
            if (TwitchPotato.App.Settings.isMouseEnabled) {
                expander.on('mouseup', function () {
                    expander;
                    if (event.button !== 0)
                        return;
                    _this.Toggle(null);
                });
                items.on('mouseup', function (event) {
                    if (event.button !== 0)
                        return;
                    event.stopPropagation();
                    _this.Select($(event.target));
                });
                items.on('mouseover', function (event) {
                    event.stopPropagation();
                    $('.selected', '#menu-items').removeClass('selected');
                    var selected = $(event.target).addClass('selected');
                    _this.UpdateMenuText(selected.text());
                });
                expander.css('cursor', 'pointer');
                items.css('cursor', 'pointer');
            }
        };
        GuideMenu.prototype.UpdateMenuText = function (text, selected) {
            if (selected === undefined && text === undefined)
                selected = $('.item.selected', '#menu-items');
            if (text === undefined)
                text = selected.text();
            $('#menu-text').text(text);
        };
        GuideMenu.prototype.Select = function (element) {
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
        };
        GuideMenu.prototype.ItemSelection = function (selected) {
            this._selected = parseInt(selected.attr('menu'));
            TwitchPotato.App.Guide.List.CreateItems(this._selected);
            this.Toggle(false);
            TwitchPotato.App.Guide.List.Toggle(true);
        };
        GuideMenu.prototype.SettingSelection = function (selected) {
            switch (selected.attr('id')) {
                case 'logout':
                    TwitchPotato.App.Authenticator.LogOut();
                    this.Cancel();
                    break;
                case 'reset':
                    TwitchPotato.App.Settings.Load(function (settings) { return TwitchPotato.App.Guide.List.CreateItems(); }, true);
                    this.Cancel();
                    break;
                case 'mouse':
                    TwitchPotato.App.Settings.isMouseEnabled = !TwitchPotato.App.Settings.isMouseEnabled;
                    break;
                default:
                    break;
            }
        };
        GuideMenu.prototype.Cancel = function () {
            $('.selected', '#menu-items').removeClass('selected');
            var selected = $('.item[menu="' + this._selected + '"]', '#menu-items');
            selected.addClass('selected');
            this.UpdateMenuText(selected.text());
            this.Toggle(false);
            TwitchPotato.App.Guide.List.Toggle(true);
        };
        Object.defineProperty(GuideMenu.prototype, "selected", {
            get: function () { return this._selected; },
            set: function (menu) { this._selected = menu; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuideMenu.prototype, "isOpen", {
            get: function () { return this._isOpen; },
            enumerable: true,
            configurable: true
        });
        return GuideMenu;
    })();
    TwitchPotato.GuideMenu = GuideMenu;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=menu.js.map
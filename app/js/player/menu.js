var TwitchPotato;
(function (TwitchPotato) {
    var PlayerMenu = (function () {
        function PlayerMenu(player) {
            this._isShown = false;
            this._player = player;
            this.CreateHighlight();
            this.CreateNotification;
            this.CreateMenu();
        }
        PlayerMenu.prototype.HandleInput = function (input) {
            if (!this._isShown)
                return false;
            switch (input) {
                case TwitchPotato.Inputs.Left:
                    this.UpdateSelection(TwitchPotato.Direction.Left);
                    return true;
                case TwitchPotato.Inputs.Right:
                    this.UpdateSelection(TwitchPotato.Direction.Right);
                    return true;
                case TwitchPotato.Inputs.Select:
                    this.SelectItem();
                    return true;
                case TwitchPotato.Inputs.ContextMenu:
                    this.ShowMenu(undefined, false, true);
                    return true;
                default:
                    return false;
            }
        };
        PlayerMenu.prototype.IsShown = function () { return this._isShown; };
        PlayerMenu.prototype.Highlight = function (showOrHide) {
            var _this = this;
            clearTimeout(this._hlTimeout);
            if (showOrHide) {
                this._highlight.fadeIn();
                setTimeout(function () { return _this._highlight.fadeOut(); }, 2500);
            }
            else
                this._highlight.fadeOut();
        };
        PlayerMenu.prototype.CreateHighlight = function () {
            if (this._player.Container().find('.highlight').length !== 0)
                return;
            var highlight = $('<div/>').addClass('highlight');
            this._player.Container().append(highlight).hide();
            this._highlight = this._player.Container().find('.highlight');
        };
        PlayerMenu.prototype.Notify = function () { };
        PlayerMenu.prototype.CreateNotification = function () {
            if (this._player.Container().find('.notification').length !== 0)
                return;
            var notification = $('<div/>').addClass('notification');
            this._player.Container().append(notification).hide();
            this._notification = this._player.Container().find('.notification');
        };
        PlayerMenu.prototype.ShowMenu = function (action, show, fade) {
            if (show === void 0) { show = true; }
            if (fade === void 0) { fade = true; }
            this._menu.find('.items').empty();
            if (action !== undefined) {
                switch (action) {
                    case -1:
                        this.ShowMainMenu();
                        break;
                    case TwitchPotato.PlayerActions.Quality:
                        this.ShowQualityMenu();
                        break;
                    default:
                        break;
                }
            }
            if (!fade)
                this._menu.toggle(show);
            else {
                if (show)
                    this._menu.fadeIn();
                else
                    this._menu.fadeOut();
            }
            this._isShown = show;
            this.ResetTimeout();
        };
        PlayerMenu.prototype.ShowMainMenu = function () {
            this.AddMenuItem(TwitchPotato.PlayerActions.Position, -1, -1, 'fullscreen');
            this.AddMenuItem(TwitchPotato.PlayerActions.Mute, -1, 0, 'fullscreen');
            this.AddMenuItem(TwitchPotato.PlayerActions.Quality, -1, 0, 'fullscreen');
            this.AddMenuItem(TwitchPotato.PlayerActions.ViewMode, -1, 0, 'fullscreen');
            this.AddMenuItem(TwitchPotato.PlayerActions.Chat, -1, 0, 'fullscreen');
            this.AddMenuItem(TwitchPotato.PlayerActions.Layout, -1, 0, 'fullscreen');
            this.AddMenuItem(-1, -1, 0, 'fullscreen');
        };
        PlayerMenu.prototype.ShowQualityMenu = function () {
            for (var i = 0; i < Object.keys(TwitchPotato.Quality).length / 2; i++) {
                this.AddMenuItem(TwitchPotato.PlayerActions.Quality, i, this._player.Quality(), TwitchPotato.Quality[i]);
            }
        };
        PlayerMenu.prototype.ShowPositionMenu = function () {
            var positions;
            if (this._player.MultiLayout() === TwitchPotato.MultiLayout.Equal) {
                positions.push(TwitchPotato.MultiPosition.TopLeft);
                positions.push(TwitchPotato.MultiPosition.TopRight);
                positions.push(TwitchPotato.MultiPosition.BottomLeft);
                positions.push(TwitchPotato.MultiPosition.BottomRight);
            }
            else if (this._player.MultiLayout() === TwitchPotato.MultiLayout.Default) {
                positions.push(TwitchPotato.MultiPosition.TopLeft);
                positions.push(TwitchPotato.MultiPosition.Top);
                positions.push(TwitchPotato.MultiPosition.TopRight);
                positions.push(TwitchPotato.MultiPosition.Left);
                positions.push(TwitchPotato.MultiPosition.Middle);
                positions.push(TwitchPotato.MultiPosition.Right);
                positions.push(TwitchPotato.MultiPosition.BottomLeft);
                positions.push(TwitchPotato.MultiPosition.Bottom);
                positions.push(TwitchPotato.MultiPosition.BottomRight);
            }
            for (var i = 0; i < positions.length; i++) {
                this.AddMenuItem(TwitchPotato.PlayerActions.Position, i, this._player.Position(), TwitchPotato.MultiPosition[i]);
            }
        };
        PlayerMenu.prototype.CreateMenu = function () {
            var menu = $('<div/>')
                .addClass('menu')
                .append($('<div/>')
                .addClass('items'));
            this._player.Container().append(menu).hide();
            this._menu = this._player.Container().find('.menu');
        };
        PlayerMenu.prototype.AddMenuItem = function (action, value, selected, image) {
            var item = $('<div/>')
                .addClass('item')
                .attr({
                action: action,
                value: value
            });
            item.append($('<img/>').
                attr('src', 'images/{0}.png'
                .format(image.toLowerCase())));
            if (selected === value)
                item.addClass('selected');
            this._menu.find('.items').append(item);
        };
        PlayerMenu.prototype.UpdateSelection = function (direction) {
            var index = this._menu
                .find('.item')
                .index(this._menu
                .find('.item.selected'));
            if (index === -1)
                index = 0;
            if (direction === TwitchPotato.Direction.Left)
                index--;
            else if (direction === TwitchPotato.Direction.Right)
                index++;
            var numItems = this._menu.find('.item').length;
            if (index < 0)
                index = numItems - 1;
            else if (index > numItems - 1)
                index = 0;
            this._menu
                .find('.item.selected')
                .removeClass('selected');
            this._menu
                .find('.item')
                .eq(index)
                .addClass('selected');
            this.ResetTimeout();
        };
        PlayerMenu.prototype.SelectItem = function () {
            console.log(this._menu.find('.item.selected')[0]);
        };
        PlayerMenu.prototype.ResetTimeout = function () {
            var _this = this;
            clearTimeout(this._menuTimeout);
            this._menuTimeout = setTimeout(function () { return _this.ShowMenu(undefined, false, true); }, 5000);
        };
        return PlayerMenu;
    })();
    TwitchPotato.PlayerMenu = PlayerMenu;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=menu.js.map
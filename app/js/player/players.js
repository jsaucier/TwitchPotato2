var TwitchPotato;
(function (TwitchPotato) {
    var Players = (function () {
        function Players() {
            this._container = $('#players');
            this._players = {};
            this._layout = TwitchPotato.PlayerMode.Full;
            this._multiLayout = TwitchPotato.MultiLayout.Default;
        }
        Players.prototype.HandleInput = function (input) {
            var player = this.GetSelected();
            if (player === undefined)
                return false;
            if (player.Menu().HandleInput(input))
                return;
            else {
                switch (input) {
                    case TwitchPotato.Inputs.ContextMenu:
                        player.Menu().ShowMenu(-1, true, true);
                        return true;
                    case TwitchPotato.Inputs.Stop:
                        player.State(TwitchPotato.PlayerState.Stopped);
                        if (!this.IsPlaying()) {
                            this._container.cssFade('out');
                            TwitchPotato.App.Guide.Toggle(true);
                        }
                        return true;
                    case TwitchPotato.Inputs.Play:
                        player.State(TwitchPotato.PlayerState.Playing, true);
                        return true;
                    case TwitchPotato.Inputs.Mute:
                        player.Mute();
                        return true;
                    case TwitchPotato.Inputs.Flashback:
                        player.Flashback();
                        return true;
                    case TwitchPotato.Inputs.ToggleViewMode:
                        player.ViewMode(TwitchPotato.ViewMode.Toggle);
                        return true;
                    case TwitchPotato.Inputs.Fullscreen:
                        player.ViewMode(TwitchPotato.ViewMode.Fullscreen);
                        return true;
                    case TwitchPotato.Inputs.Windowed:
                        player.ViewMode(TwitchPotato.ViewMode.Windowed);
                        return true;
                    case TwitchPotato.Inputs.QualityMobile:
                        player.Quality(TwitchPotato.Quality.Mobile);
                        return true;
                    case TwitchPotato.Inputs.QualityLow:
                        player.Quality(TwitchPotato.Quality.Low);
                        return true;
                    case TwitchPotato.Inputs.QualityMedium:
                        player.Quality(TwitchPotato.Quality.Medium);
                        return true;
                    case TwitchPotato.Inputs.QualityHigh:
                        player.Quality(TwitchPotato.Quality.High);
                        return true;
                    case TwitchPotato.Inputs.QualitySource:
                        player.Quality(TwitchPotato.Quality.Source);
                        return true;
                    case TwitchPotato.Inputs.Up:
                        this.UpdateSelector(TwitchPotato.Direction.Up);
                        return true;
                    case TwitchPotato.Inputs.Down:
                        this.UpdateSelector(TwitchPotato.Direction.Down);
                        return true;
                    case TwitchPotato.Inputs.Select:
                        this.Select();
                        return true;
                    case TwitchPotato.Inputs.MultiLayout:
                        var layout = (this._multiLayout === TwitchPotato.MultiLayout.Default) ?
                            TwitchPotato.MultiLayout.Equal : TwitchPotato.MultiLayout.Default;
                        this.MultiLayout(layout);
                        return true;
                    case TwitchPotato.Inputs.ToggleChat:
                        TwitchPotato.App.Chat.Toggle(player.Id());
                        return true;
                    case TwitchPotato.Inputs.Right:
                        TwitchPotato.App.Chat.UpdateLayout(TwitchPotato.Direction.Right);
                        return true;
                    case TwitchPotato.Inputs.Left:
                        TwitchPotato.App.Chat.UpdateLayout(TwitchPotato.Direction.Left);
                        return true;
                    case TwitchPotato.Inputs.Reload:
                        player.Reload();
                        return true;
                    default:
                        return false;
                }
            }
        };
        Players.prototype.IsPlaying = function () {
            for (var i in this._players)
                if (this._players[i].State() === TwitchPotato.PlayerState.Playing)
                    return true;
            return false;
        };
        Players.prototype.GetByNumber = function (num) {
            for (var i in this._players)
                if (this._players[i].Number() === num)
                    return this._players[i];
            return undefined;
        };
        Players.prototype.GetSelected = function () {
            var num = parseInt($('#players .player.selected').attr('number')) || 0;
            return this.GetByNumber(num);
        };
        Players.prototype.Play = function (id, isVideo, multi) {
            if (isVideo === void 0) { isVideo = false; }
            if (multi === void 0) { multi = false; }
            var player = this.GetByNumber(0);
            if (multi || player === undefined)
                player = this.Add(id, isVideo);
            else
                player.Load(id, isVideo);
            this.PlayerMode(TwitchPotato.PlayerMode.Full);
            this.MultiLayout();
            TwitchPotato.App.Guide.Toggle(false);
        };
        Players.prototype.Add = function (id, isVideo) {
            var num = Object.keys(this._players).length;
            if (num >= 4)
                return undefined;
            var player = new TwitchPotato.Player(num, id, isVideo);
            this._players[num] = player;
            return player;
        };
        Players.prototype.Remove = function () {
            this.ClearSelected();
            var removed = this.GetSelected().Number();
            this.GetSelected().Remove();
            delete this._players[removed];
            for (var i in this._players) {
                var player = this._players[i];
                var num = player.Number();
                if (num > removed) {
                    num--;
                    player.Number(num);
                    this._players[num] = player;
                    delete this._players[num + 1];
                }
            }
        };
        Players.prototype.ToggleGuide = function (isGuideMode) {
            if (!this.IsPlaying())
                return;
            if (isGuideMode) {
                this._container.addClass('guide');
                this._container.removeAttr('mode');
            }
            else {
                this._container.removeClass('guide');
                this._container.attr('mode', TwitchPotato.PlayerMode[this._layout]);
            }
        };
        Players.prototype.PlayerMode = function (layout) {
            if (layout === undefined)
                layout = this._previousMode;
            var lo = TwitchPotato.PlayerMode[layout];
            if (this._layout === layout) {
                if ($('#players').attr('mode') === lo &&
                    $('#players').css('display') === 'none') {
                    $('#players').show();
                    return;
                }
            }
            if ($('#players').attr('mode') !== lo) {
                $('#players').hide().attr('mode', lo).show();
            }
            this._layout = layout;
        };
        Players.prototype.MultiLayout = function (layout) {
            if (layout === undefined)
                layout = this._multiLayout;
            if (Object.keys(this._players).length === 1)
                layout = TwitchPotato.MultiLayout.Default;
            for (var index in this._players)
                this._players[index].MultiLayout(layout);
            this._multiLayout = layout;
        };
        Players.prototype.UpdateSelector = function (direction) {
            var num = parseInt($('#players .player.selected').attr('number')) || 0;
            this.ClearSelected();
            if (direction === TwitchPotato.Direction.Up)
                num--;
            else if (direction === TwitchPotato.Direction.Down)
                num++;
            var numPlayers = $('#players .player').length;
            if (num < 0)
                num = numPlayers - 1;
            else if (num > numPlayers - 1)
                num = 0;
            for (var index in this._players)
                this._players[index].Highlight(num);
        };
        Players.prototype.Select = function () {
            var current = this.GetByNumber(0);
            var player = this.GetSelected();
            if (player !== undefined) {
                current.Number(player.Number());
                this._players[player.Number()] = current;
                player.Number(0);
                this._players[0] = player;
            }
            this.ClearSelected();
        };
        Players.prototype.ClearSelected = function () {
            $('#players .player').removeClass('selected');
            $('#players .selector').removeAttr('number').hide();
        };
        return Players;
    })();
    TwitchPotato.Players = Players;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=players.js.map
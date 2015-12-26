module TwitchPotato {

    export class Players {

        private _container = $('#players');
        private _players: { [id: number]: Player } = {};
        private _layout: PlayerMode = PlayerMode.Full;
        private _previousMode: PlayerMode;
        private _multiLayout = MultiLayout.Default;
        private _selectionTimeout: number;

        HandleInput(input: Inputs): boolean {

            var player = this.GetSelected();

            if (player === undefined) return false;

            if (player.Menu().HandleInput(input))
                return;
            else {
                switch (input) {

                    case Inputs.ContextMenu:
                        player.Menu().ShowMenu(-1, true, true);
                        return true;

                    case Inputs.Stop:
                        player.State(PlayerState.Stopped);

                        if (this.IsPlaying() === false) {
                            this.Hide();
                            App.Guide.Toggle(true);
                        }
                        else
                            this.Remove();
                        return true;

                    case Inputs.Play:
                        player.State(PlayerState.Playing, true);
                        return true;

                    case Inputs.Mute:
                        player.Mute(null);
                        return true;

                    case Inputs.Flashback:
                        player.Flashback();
                        return true;

                    case Inputs.ToggleViewMode:
                        player.ViewMode(ViewMode.Toggle);
                        return true;

                    case Inputs.Fullscreen:
                        player.ViewMode(ViewMode.Fullscreen);
                        return true;

                    case Inputs.Windowed:
                        player.ViewMode(ViewMode.Windowed);
                        return true;

                    case Inputs.QualityMobile:
                        player.Quality(Quality.Mobile);
                        return true;

                    case Inputs.QualityLow:
                        player.Quality(Quality.Low);
                        return true;

                    case Inputs.QualityMedium:
                        player.Quality(Quality.Medium);
                        return true;

                    case Inputs.QualityHigh:
                        player.Quality(Quality.High);
                        return true;

                    case Inputs.QualitySource:
                        player.Quality(Quality.Source);
                        return true;

                    case Inputs.Up:
                        this.UpdateSelector(Direction.Up);
                        return true;

                    case Inputs.Down:
                        this.UpdateSelector(Direction.Down);
                        return true;

                    case Inputs.Select:
                        this.Select();
                        return true;

                    case Inputs.MultiLayout:
                        var layout = (this._multiLayout === MultiLayout.Default) ?
                            MultiLayout.Equal : MultiLayout.Default;

                        this.MultiLayout(layout);
                        return true;

                    case Inputs.ToggleChat:
                        App.Chat.Toggle(player.Id());
                        return true;

                    case Inputs.Right:
                        App.Chat.UpdateLayout(Direction.Right);
                        return true;

                    case Inputs.Left:
                        App.Chat.UpdateLayout(Direction.Left);
                        return true;

                    case Inputs.Reload:
                        player.Reload();
                        return true;

                    default:
                        return false;
                }
            }
        }

        /** Shows the guide. */
        Hide(): void { this._container.cssFade('out'); }

        /** Gets whether a player is playing. */
        IsPlaying(id?: string): boolean {
            if (id === undefined) {
                for (var i in this._players)
                    if (this._players[i].State() === PlayerState.Playing)
                        return true;
            }
            else {
                for (var i in this._players)
                    if (this._players[i].State() === PlayerState.Playing &&
                        this._players[i].Id() === id)
                        return true;
            }
            return false;
        }

        /** Gets the player by the given number. */
        GetByNumber(num: number): Player {
            for (var i in this._players)
                if (this._players[i].Number() === num)
                    return this._players[i];
            return undefined;
        }

        /** Gets the selected or first player. */
        GetSelected(): Player {
            var num = parseInt($('#players .player.selected').attr('number')) || 0;
            return this.GetByNumber(num);
        }

        /** Plays the channel or video. */
        Play(id: string, isVideo = false, multi = false): void {
            var canLoad = false;
            var player = this.GetByNumber(0);

            if (this.IsPlaying(id) === true) return;

            if (player !== undefined)
                if ((multi === true && player.State() === PlayerState.Stopped) ||
                    multi === false)
                    canLoad = true;

            if (canLoad === true)
                player.Load(id, isVideo);
            else
                player = this.Add(id, isVideo);

            this.PlayerMode(PlayerMode.Full);

            this.MultiLayout();

            App.Guide.Toggle(false);
        }

        /** Add a new player. */
        Add(id: string, isVideo: boolean): Player {
            var num = Object.keys(this._players).length;

            /** Only allow four players open at once. */
            if (num >= 4) return undefined;

            var player = new Player(num, id, isVideo);

            this._players[num] = player;

            return player;
        }

        /** Removes the selected player. */
        Remove(): void {
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
        }

        ToggleGuide(isGuideMode: boolean): void {
            if (!this.IsPlaying()) return;

            if (isGuideMode) {
                this._container.addClass('guide')
                this._container.removeAttr('mode');
            }
            else {
                this._container.removeClass('guide');
                this._container.attr('mode', PlayerMode[this._layout]);
            }
        }

        /** Updates the player mode. */
        // PlayerMode(fadeIn: boolean, layout?: PlayerMode): void {
        PlayerMode(layout?: PlayerMode): void {

            if (layout === undefined)
                layout = this._previousMode;

            var lo = PlayerMode[layout];

            if (this._layout === layout) {

                if ($('#players').attr('mode') === lo &&
                    $('#players').css('display') === 'none') {

                    // if (fadeIn === true)
                    //     $('#players').fadeIn();
                    // else
                    $('#players').show();

                    return;
                }
            }

            if ($('#players').attr('mode') !== lo) {
                // if (fadeIn === true)
                //     $('#players').hide().attr('mode', lo).fadeIn();
                // else
                $('#players').hide().attr('mode', lo).show();
            }

            this._layout = layout;
        }

        /** Sets the multi layout for the players. */
        MultiLayout(layout?: MultiLayout): void {
            if (layout === undefined)
                layout = this._multiLayout;

            if (Object.keys(this._players).length === 1)
                layout = MultiLayout.Default;

            for (var index in this._players)
                this._players[index].MultiLayout(layout)

            this._multiLayout = layout;

            for (var index in this._players)
                this._players[index].ViewMode(ViewMode.Update);
        }

        /** Updates the selected player. */
        private UpdateSelector(direction: Direction): void {
            var num = parseInt($('#players .player.selected').attr('number')) || 0;

            if (direction === Direction.Up) num--;
            else if (direction === Direction.Down) num++;

            var numPlayers = $('#players .player').length;

            if (num < 0)
                num = numPlayers - 1;
            else if (num > numPlayers - 1)
                num = 0;

            for (var index in this._players)
                this._players[index].Highlight(num);
        }

        /** Selects the selected player. */
        private Select(): void {
            var current = this.GetByNumber(0);
            var player = this.GetSelected();

            if (player !== undefined) {

                current.Number(player.Number());
                this._players[player.Number()] = current;

                player.Number(0);
                this._players[0] = player;
            }
        }
    }
}

var TwitchPotato;
(function (TwitchPotato) {
    var InputHandler = (function () {
        function InputHandler() {
            var _this = this;
            this._inputFocued = false;
            this._keyLookup = ['', '', '', 'CANCEL', '', '', 'HELP', '', 'BACK_SPACE', 'TAB', '', '', 'CLEAR', 'ENTER', 'RETURN', '', 'SHIFT', 'CONTROL', 'ALT', 'PAUSE', 'CAPS_LOCK', 'KANA', 'EISU', 'JUNJA', 'FINAL', 'HANJA', '', 'ESCAPE', 'CONVERT', 'NONCONVERT', 'ACCEPT', 'MODECHANGE', 'SPACE', 'PAGE_UP', 'PAGE_DOWN', 'END', 'HOME', 'LEFT', 'UP', 'RIGHT', 'DOWN', 'SELECT', 'PRINT', 'EXECUTE', 'PRINTSCREEN', 'INSERT', 'DELETE', '', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'COLON', 'SEMICOLON', 'LESS_THAN', 'EQUALS', 'GREATER_THAN', 'QUESTION_MARK', 'AT', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'WIN', '', 'CONTEXT_MENU', '', 'SLEEP', 'NUMPAD0', 'NUMPAD1', 'NUMPAD2', 'NUMPAD3', 'NUMPAD4', 'NUMPAD5', 'NUMPAD6', 'NUMPAD7', 'NUMPAD8', 'NUMPAD9', 'MULTIPLY', 'ADD', 'SEPARATOR', 'SUBTRACT', 'DECIMAL', 'DIVIDE', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', '', '', '', '', '', '', '', '', 'NUM_LOCK', 'SCROLL_LOCK', 'WIN_OEM_FJ_JISHO', 'WIN_OEM_FJ_MASSHOU', 'WIN_OEM_FJ_TOUROKU', 'WIN_OEM_FJ_LOYA', 'WIN_OEM_FJ_ROYA', '', '', '', '', '', '', '', '', '', 'CIRCUMFLEX', 'EXCLAMATION', 'DOUBLE_QUOTE', 'HASH', 'DOLLAR', 'PERCENT', 'AMPERSAND', 'UNDERSCORE', 'OPEN_PAREN', 'CLOSE_PAREN', 'ASTERISK', 'PLUS', 'PIPE', 'HYPHEN_MINUS', 'OPEN_CURLY_BRACKET', 'CLOSE_CURLY_BRACKET', 'TILDE', '', '', '', '', 'VOLUME_MUTE', 'VOLUME_DOWN', 'VOLUME_UP', '', '', 'SEMICOLON', 'EQUALS-PLUS', 'COMMA', 'MINUS', 'PERIOD', 'SLASH', 'BACK_QUOTE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'OPEN_BRACKET', 'BACK_SLASH', 'CLOSE_BRACKET', 'QUOTE', '', 'META', 'ALTGR', '', 'WIN_ICO_HELP', 'WIN_ICO_00', '', 'WIN_ICO_CLEAR', '', '', 'WIN_OEM_RESET', 'WIN_OEM_JUMP', 'WIN_OEM_PA1', 'WIN_OEM_PA2', 'WIN_OEM_PA3', 'WIN_OEM_WSCTRL', 'WIN_OEM_CUSEL', 'WIN_OEM_ATTN', 'WIN_OEM_FINISH', 'WIN_OEM_COPY', 'WIN_OEM_AUTO', 'WIN_OEM_ENLW', 'WIN_OEM_BACKTAB', 'ATTN', 'CRSEL', 'EXSEL', 'EREOF', 'PLAY', 'ZOOM', '', 'PA1', 'WIN_OEM_CLEAR', ''];
            this._inputLookup = {};
            this._inputs = [
                { name: 'Close', desc: 'Closes the application or current webview.', type: TwitchPotato.Inputs.Close, key: 'ESCAPE' },
                { name: 'Toggle Guide', desc: 'Toggles the guide.', type: TwitchPotato.Inputs.ToggleGuide, key: 'G' },
                { name: 'Font Size Increase', desc: 'Increases the application font size.', type: TwitchPotato.Inputs.ZoomIncrease, key: 'EQUALS-PLUS' },
                { name: 'Font Size Decrease', desc: 'Decreases the application font size.', type: TwitchPotato.Inputs.ZoomDecrease, key: 'MINUS' },
                { name: 'Font Size Reset', desc: 'Toggles the guide.', type: TwitchPotato.Inputs.ZoomReset, key: '0' },
                { name: 'Up', desc: 'Guide - Scrolls up the items.<br/>Player - Selects the previous player.', type: TwitchPotato.Inputs.Up, key: 'UP' },
                { name: 'Down', desc: 'Guide - Scrolls down the items.<br/>Player - Selects the next player.', type: TwitchPotato.Inputs.Down, key: 'DOWN' },
                { name: 'Left', desc: 'Guide - Scrolls up the menu.<br/>Player - Selects the previous chat layout.', type: TwitchPotato.Inputs.Left, key: 'LEFT' },
                { name: 'Right', desc: 'Guide - Scrolls down the menu.<br/>Player - Selects the next chat layout', type: TwitchPotato.Inputs.Right, key: 'RIGHT' },
                { name: 'Jump Up', desc: '', type: TwitchPotato.Inputs.PageUp, key: 'PAGE_UP' },
                { name: 'Jump Down', desc: '', type: TwitchPotato.Inputs.PageDown, key: 'PAGE_DOWN' },
                { name: 'Select Item', desc: '', type: TwitchPotato.Inputs.Select, key: 'ENTER' },
                { name: 'Refresh Guide', desc: '', type: TwitchPotato.Inputs.Refresh, key: 'R' },
                { name: 'Context Menu', desc: '', type: TwitchPotato.Inputs.ContextMenu, key: 'P' },
                { name: 'Toggle Chat', desc: '', type: TwitchPotato.Inputs.ToggleChat, key: 'C' },
                { name: 'Stop', desc: '', type: TwitchPotato.Inputs.Stop, key: 'S' },
                { name: 'Play', desc: '', type: TwitchPotato.Inputs.Play, key: 'SPACE' },
                { name: 'Mute Volume', desc: '', type: TwitchPotato.Inputs.Mute, key: 'M' },
                { name: 'Previous Channel', desc: '', type: TwitchPotato.Inputs.Flashback, key: 'F' },
                { name: 'Change Multi Layout', desc: '', type: TwitchPotato.Inputs.MultiLayout, key: 'H' },
                { name: 'Toggle View Mode', desc: '', type: TwitchPotato.Inputs.ToggleViewMode, key: 'U' },
                { name: 'Fullscreen View Mode', desc: '', type: TwitchPotato.Inputs.Fullscreen, key: 'I' },
                { name: 'Windowed View Mode', desc: '', type: TwitchPotato.Inputs.Windowed, key: 'O' },
                { name: 'Mobile Resolution', desc: '', type: TwitchPotato.Inputs.QualityMobile, key: '1' },
                { name: 'Low Resolution', desc: '', type: TwitchPotato.Inputs.QualityLow, key: '2' },
                { name: 'Medium Resolution', desc: '', type: TwitchPotato.Inputs.QualityMedium, key: '3' },
                { name: 'High Resolution', desc: '', type: TwitchPotato.Inputs.QualityHigh, key: '4' },
                { name: 'Source Resolution', desc: '', type: TwitchPotato.Inputs.QualitySource, key: '5' },
                { name: 'Reload Player', desc: 'Reloads the player completely.', type: TwitchPotato.Inputs.Reload, key: 'T' }
            ];
            for (var i = 0; i < this._inputs.length; i++) {
                var input = this._inputs[i];
                var keycode = this._keyLookup.indexOf(input.key);
                if (this._inputLookup[keycode] === undefined)
                    this._inputLookup[keycode] = [];
                this._inputLookup[keycode].push(i);
            }
            $(document).keydown(function (event) { return _this.OnInput(event); });
            $(document).on('focus', 'input', function () { return _this._inputFocued = true; });
            $(document).on('blur', 'input', function () { return _this._inputFocued = false; });
        }
        InputHandler.prototype.OnInput = function (event) {
            var input = this.GetInputFromKeyCode(event.keyCode);
            if (input !== undefined) {
                var inputType = input.type;
                if (TwitchPotato.App.LoadWindow.isOpen && inputType !== TwitchPotato.Inputs.Close)
                    return;
                if (this._inputFocued)
                    if (inputType !== TwitchPotato.Inputs.SaveSetting &&
                        inputType !== TwitchPotato.Inputs.Close)
                        return;
                if (TwitchPotato.App.OnInput(inputType))
                    return;
                else if (TwitchPotato.App.Guide.ItemMenu.OnInput(inputType))
                    return;
                else if (TwitchPotato.App.Guide.Menu.OnInput(inputType))
                    return;
                else if (TwitchPotato.App.Guide.List.OnInput(inputType))
                    return;
                else if (TwitchPotato.App.Guide.OnInput(inputType))
                    return;
                else if (TwitchPotato.App.Players.HandleInput(inputType))
                    return;
            }
        };
        InputHandler.prototype.GetInputFromKeyCode = function (keyCode) {
            for (var i in this._inputLookup[keyCode])
                return this._inputs[this._inputLookup[keyCode][i]];
            return undefined;
        };
        return InputHandler;
    })();
    TwitchPotato.InputHandler = InputHandler;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=input.js.map
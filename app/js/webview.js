var TwitchPotato;
(function (TwitchPotato) {
    var Webview = (function () {
        function Webview(id, appendTo, cssFiles, scriptFiles, onLoading, onLoaded) {
            var _this = this;
            appendTo.append($('<webview/>')
                .attr({
                id: id,
                autosize: 'on',
                partition: 'persist:twitchpotato'
            }));
            this._webview = $('#' + id)[0];
            this._webview.addEventListener('contentload', function () { return onLoaded; });
            this._webview.addEventListener('loadcommit', function (event) {
                for (var i in cssFiles)
                    _this._webview.insertCSS({ file: cssFiles[i] });
                for (var i in scriptFiles)
                    _this._webview.executeScript({ file: scriptFiles[i] });
                onLoading(event);
            });
            this._webview.addEventListener('consolemessage', function (e) {
                var message = '[{0}] Line: {1} - {2}'.format(id, e.line, e.message);
                switch (e.level) {
                    case 0:
                        return console.log(message);
                    case 1:
                        return console.warn(message);
                    case 2:
                        return console.info(message);
                    case 3:
                        return console.debug(message);
                    case 4:
                        return console.error(message);
                    default:
                        return console.log(message);
                }
            });
        }
        return Webview;
    })();
    TwitchPotato.Webview = Webview;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=webview.js.map
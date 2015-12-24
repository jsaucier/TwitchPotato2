// v2
module TwitchPotato {

    export class Webview {

        private _webview: WebviewElement;

        constructor(
            id: string,
            appendTo: JQuery,
            cssFiles: Array<string>,
            scriptFiles: Array<string>,
            onLoading: (event: LoadCommitEvent) => void,
            onLoaded: () => void) {

            appendTo.append($('<webview/>')
                .attr({
                id: id,
                autosize: 'on',
                partition: 'persist:twitchpotato'
            }));

            this._webview = <WebviewElement>$('#' + id)[0];

            this._webview.addEventListener('contentload', () => onLoaded);

            this._webview.addEventListener('loadcommit', (event: LoadCommitEvent) => {

                for (var i in cssFiles)
                    this._webview.insertCSS({ file: cssFiles[i] });

                for (var i in scriptFiles)
                    this._webview.executeScript({ file: scriptFiles[i] });

                onLoading(event);

            });

            this._webview.addEventListener('consolemessage', (e: any) => {

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
    }
}

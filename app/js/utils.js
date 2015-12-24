String.prototype.format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m == '{{')
            return '{';
        if (m === "}}")
            return '}';
        return args[n];
    });
};
Number.prototype.deliminate = function (char) {
    if (char === void 0) { char = ','; }
    var str = this + '';
    var x = str.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + char + '$2');
    }
    return x1 + x2;
};
Number.prototype.formatSeconds = function () {
    var hours = Math.floor(this / (60 * 60));
    var minDiv = this % (60 * 60);
    var mins = Math.floor(minDiv / 60);
    var secDiv = minDiv % 60;
    var secs = Math.ceil(secDiv);
    return ((hours > 0) ? hours + ':' : '') +
        ((mins < 10) ? '0' + mins : mins) + ':' +
        ((secs < 10) ? '0' + secs : secs);
};
var TwitchPotato;
(function (TwitchPotato) {
    function ConsoleMessage(e) {
        var message = 'webview:{0}:{1}: {2}'.format($(e.target).attr('type'), e.line, e.message);
        if (e.level === 0)
            console.log(message);
        else if (e.level === 1)
            console.warn(message);
        else if (e.level === 2)
            console.info(message);
        else if (e.level === 3)
            console.debug(message);
        else if (e.level === 4)
            console.error(message);
        else
            console.log(message);
    }
    TwitchPotato.ConsoleMessage = ConsoleMessage;
    function UpdateSelected(list, item, input, indexMod) {
        if (indexMod === void 0) { indexMod = 1; }
        var items = $(item, list);
        var selected = $(item + '.selected', list);
        var index = items.index(selected);
        if (index === -1)
            index = 0;
        if (input === TwitchPotato.Inputs.Down ||
            input === TwitchPotato.Inputs.PageDown ||
            input === TwitchPotato.Inputs.Right)
            index += indexMod;
        else if (input === TwitchPotato.Inputs.Up ||
            input === TwitchPotato.Inputs.PageUp ||
            input === TwitchPotato.Inputs.Left)
            index -= indexMod;
        var numItems = items.length;
        if (index < 0)
            index = 0;
        else if (index > numItems - 1)
            index = numItems - 1;
        selected.removeClass('selected');
        return items.eq(index).addClass('selected');
    }
    TwitchPotato.UpdateSelected = UpdateSelected;
})(TwitchPotato || (TwitchPotato = {}));
$.fn.cssFade = function (fadeType, callback) {
    var timers = $.fn.cssFade.timers || {};
    return $(this).each(function () {
        var element = $(this);
        var timer = timers[element.selector];
        var css = 'animate-fade-' + fadeType;
        clearTimeout(timer);
        element.removeClass(css);
        setTimeout(function () {
            element.addClass(css);
            if (fadeType === 'in') {
                element.css('opacity', 0).show();
            }
        });
        timer = setTimeout(function () {
            element.removeClass(css);
            if (fadeType === 'in') {
                element.css('opacity', '');
            }
            else if (fadeType === 'out') {
                element.hide();
            }
            if (typeof (callback) === 'function') {
                callback.call(element);
            }
        }, 250);
    });
};
//# sourceMappingURL=utils.js.map
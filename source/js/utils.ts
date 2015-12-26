interface String {
    /** Formats the string using the supplied arguments. */
    format(...args: any[]): string;

}

String.prototype.format = function(...args: any[]): string {
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, (m, n) => {
        if (m == '{{') return '{';
        if (m === "}}") return '}';
        return args[n];
    });
};

interface Number {
    /** Deliminates a number with commas or the supplied character. */
    deliminate(char?: string): string;
    /** Formats seconds to a time string. */
    formatSeconds(): string;
}

Number.prototype.deliminate = function(char = ','): string {
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

Number.prototype.formatSeconds = function(): string {
    var hours = Math.floor(this / (60 * 60));

    var minDiv = this % (60 * 60);
    var mins = Math.floor(minDiv / 60);

    var secDiv = minDiv % 60;
    var secs = Math.ceil(secDiv);

    return ((hours > 0) ? hours + ':' : '') +
        ((mins < 10) ? '0' + mins : mins) + ':' +
        ((secs < 10) ? '0' + secs : secs)
}

module TwitchPotato {
    export function ConsoleMessage(e: any): void {
        var message = 'webview:{0}:{1}: {2}'.format($(e.target).attr('type'), e.line, e.message);

        if (e.level === 0) console.log(message);
        else if (e.level === 1) console.warn(message);
        else if (e.level === 2) console.info(message);
        else if (e.level === 3) console.debug(message);
        else if (e.level === 4) console.error(message);
        else console.log(message);
    }

    export function UpdateSelected(
        list: string,
        item: string,
        input?: Inputs,
        indexMod = 1): JQuery {

        var items = $(item, list);
        var selected = $(item + '.selected', list);

        var index = items.index(selected);

        if (index === -1) index = 0;

        if (input === Inputs.Down ||
            input === Inputs.PageDown ||
            input === Inputs.Right)
            index += indexMod;
        else if (input === Inputs.Up ||
            input === Inputs.PageUp ||
            input === Inputs.Left)
            index -= indexMod;

        var numItems = items.length;

        if (index < 0) index = 0;
        else if (index > numItems - 1) index = numItems - 1;

        selected.removeClass('selected');
        return items.eq(index).addClass('selected');
    }
}

$.fn.scrollToMiddle = function(element, callback) {
    return $(this).each(() => {
        var selected = $(element);
        if (selected.length !== 0) {
            var selectedItemTop = selected.offset().top;
            var halfListHeight = $(this).height() / 2;
            var halfItemHeight = selected.height() / 2;
            var scrollTop = $(this).scrollTop();
            var scroll = scrollTop + selectedItemTop - halfListHeight + halfItemHeight;
            $(this).scrollTop(scroll);
        }
    });
}

$.fn.cssFade = function(fadeType, callback) {

    var timers = $.fn.cssFade.timers || {};

    return $(this).each(function() {

        var element = $(this);
        var timer = timers[element.selector];
        var css = 'animate-fade-' + fadeType;

        /* Clear the animation timer. */
        clearTimeout(timer);

        /* Ensure the antimation isn't currently on the element. */
        element.removeClass(css);

        /* Add the animation to the element with a slight delay so the browser
         * can have a chance to register if we had to remove it beforehand. */
        setTimeout(function() {
            /* Add the css class to the element. */
            element.addClass(css);

            if (fadeType === 'in') {
                /* Ensures the element is visible and ready to fade in. */
                element.css('opacity', 0).show();
            }
        });

        timer = setTimeout(function() {
            element.removeClass(css);

            if (fadeType === 'in') {
                /* Removes the opacity setting after fade in has finished. */
                element.css('opacity', '');
            } else if (fadeType === 'out') {
                /* Ensures the element is hidden after the fade out has finished. */
                element.hide();
            }

            if (typeof (callback) === 'function') {
                /* Call our callback. */
                callback.call(element);
            }
        }, 250);
    });
};

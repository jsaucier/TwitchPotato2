var TwitchPotato;
(function (TwitchPotato) {
    var GuideContent = (function () {
        function GuideContent() {
            var _this = this;
            this._objectUrls = [];
            this._isLoaded = false;
            $(function () { return _this.InitializePreview(); });
        }
        GuideContent.prototype.PreviewWebview = function () { return this._preview; };
        GuideContent.prototype.UpdateInfo = function () {
            this.UpdateSelectedItem();
            var key = this.SelectedItemAttribute('key');
            var menu = parseInt(this.SelectedItemAttribute('menu'));
            var isSetting = this.SelectedItemAttribute('setting') === 'true';
            if (isSetting)
                return this.ShowSetting();
            if (menu === TwitchPotato.MenuType.Channels ||
                menu === TwitchPotato.MenuType.Game)
                return this.ShowChannel(key, menu);
            if (menu === TwitchPotato.MenuType.Videos)
                return this.ShowVideo(key);
            if (menu === TwitchPotato.MenuType.Games)
                return this.ShowGame(key);
        };
        GuideContent.prototype.LoadPreview = function (channel, imageUrl, isVideo) {
            if (isVideo === void 0) { isVideo = false; }
            $('#info #preview img').remove();
            $('#info .content').hide();
            $(this._preview).hide();
            $('#info #preview').show();
            if (!TwitchPotato.App.Settings.useViewPreview)
                return this.LoadImage(imageUrl, $('#info #preview'));
            $(this._preview).show();
            if (channel === this._channel)
                return;
            if (TwitchPotato.App.Settings.useViewPreview)
                this.PostMessage('LoadPreview', { channel: channel, isVideo: isVideo });
            this._channel = channel;
        };
        GuideContent.prototype.PausePreview = function () {
            if (!TwitchPotato.App.Settings.useViewPreview)
                return;
            this.PostMessage('PauseVideo');
        };
        GuideContent.prototype.PlayPreview = function () {
            if (!TwitchPotato.App.Settings.useViewPreview)
                return;
            this.PostMessage('PlayVideo');
        };
        GuideContent.prototype.InitializePreview = function () {
        };
        GuideContent.prototype.PostMessage = function (method, params) {
            if (params === void 0) { params = {}; }
        };
        GuideContent.prototype.UpdateSelectedItem = function () {
            this._selectedItem = $('#guide .list.selected .item.selected');
            return this._selectedItem;
        };
        GuideContent.prototype.SelectedItemAttribute = function (attrib) {
            return this._selectedItem.attr(attrib);
        };
        GuideContent.prototype.CreateObjectURL = function (blob) {
            var objURL = URL.createObjectURL(blob);
            this._objectUrls = this._objectUrls || [];
            this._objectUrls.push(objURL);
            return objURL;
        };
        GuideContent.prototype.LoadImage = function (url, element) {
            var _this = this;
            var ele = element[0];
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.contentType = 'image/jpg';
            xhr.onload = function () {
                var img = document.createElement('img');
                img.setAttribute('data-src', url);
                var objURL = _this.CreateObjectURL(xhr.response);
                img.setAttribute('src', objURL);
                $(element).empty();
                ele.appendChild(img);
            };
            xhr.send();
        };
        GuideContent.prototype.ShowChannel = function (key, menu) {
            var channel = TwitchPotato.App.Twitch.GetItems(menu)[key];
            var head = $('#channel-info-head-template').html().format(channel.streamer, channel.title, channel.game, channel.viewers.deliminate());
            $('#info .head').html(head);
            this.LoadPreview(key, channel.preview);
        };
        GuideContent.prototype.ShowGame = function (key) {
            var game = TwitchPotato.App.Twitch.GetItems(TwitchPotato.MenuType.Games)[key];
            var head = $('#game-info-head-template').html().format(game.name, game.channels.deliminate(), game.viewers.deliminate());
            $('#info .head').html(head);
            this.LoadPreview(key, game.boxArt, true);
        };
        GuideContent.prototype.ShowVideo = function (key) {
            var video = TwitchPotato.App.Twitch.GetItems(TwitchPotato.MenuType.Videos)[key];
            var head = $('#video-info-head-template').html().format(video.title, video.streamer, video.length.formatSeconds(), video.views.deliminate());
            $('#info .head').html(head);
            this.LoadPreview(key, video.preview, true);
        };
        GuideContent.prototype.ShowSetting = function () {
            var type = this.SelectedItemAttribute('type');
            var isInput = this.SelectedItemAttribute('input') === 'true';
            var head = $('#{0}-setting-template'.format(type)).html();
            $('#info .head').html(head);
            $('#info .content').empty().show();
            if (isInput === true)
                $('#info .content')
                    .append($('<input>')
                    .attr('id', type));
            $('#preview').hide();
        };
        return GuideContent;
    })();
    TwitchPotato.GuideContent = GuideContent;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=content.js.map
var TwitchPotato;
(function (TwitchPotato) {
    (function (Inputs) {
        Inputs[Inputs["Close"] = 0] = "Close";
        Inputs[Inputs["ZoomIncrease"] = 1] = "ZoomIncrease";
        Inputs[Inputs["ZoomDecrease"] = 2] = "ZoomDecrease";
        Inputs[Inputs["ZoomReset"] = 3] = "ZoomReset";
        Inputs[Inputs["SaveSetting"] = 4] = "SaveSetting";
        Inputs[Inputs["ToggleGuide"] = 5] = "ToggleGuide";
        Inputs[Inputs["Up"] = 6] = "Up";
        Inputs[Inputs["Down"] = 7] = "Down";
        Inputs[Inputs["Left"] = 8] = "Left";
        Inputs[Inputs["Right"] = 9] = "Right";
        Inputs[Inputs["PageUp"] = 10] = "PageUp";
        Inputs[Inputs["PageDown"] = 11] = "PageDown";
        Inputs[Inputs["Select"] = 12] = "Select";
        Inputs[Inputs["Refresh"] = 13] = "Refresh";
        Inputs[Inputs["ContextMenu"] = 14] = "ContextMenu";
        Inputs[Inputs["Stop"] = 15] = "Stop";
        Inputs[Inputs["Play"] = 16] = "Play";
        Inputs[Inputs["Mute"] = 17] = "Mute";
        Inputs[Inputs["MultiLayout"] = 18] = "MultiLayout";
        Inputs[Inputs["ToggleViewMode"] = 19] = "ToggleViewMode";
        Inputs[Inputs["Fullscreen"] = 20] = "Fullscreen";
        Inputs[Inputs["Windowed"] = 21] = "Windowed";
        Inputs[Inputs["Flashback"] = 22] = "Flashback";
        Inputs[Inputs["QualityMobile"] = 23] = "QualityMobile";
        Inputs[Inputs["QualityLow"] = 24] = "QualityLow";
        Inputs[Inputs["QualityMedium"] = 25] = "QualityMedium";
        Inputs[Inputs["QualityHigh"] = 26] = "QualityHigh";
        Inputs[Inputs["QualitySource"] = 27] = "QualitySource";
        Inputs[Inputs["ToggleChat"] = 28] = "ToggleChat";
        Inputs[Inputs["Reload"] = 29] = "Reload";
    })(TwitchPotato.Inputs || (TwitchPotato.Inputs = {}));
    var Inputs = TwitchPotato.Inputs;
    (function (PlayerMode) {
        PlayerMode[PlayerMode["Full"] = 0] = "Full";
        PlayerMode[PlayerMode["ChatLeft"] = 1] = "ChatLeft";
        PlayerMode[PlayerMode["ChatRight"] = 2] = "ChatRight";
    })(TwitchPotato.PlayerMode || (TwitchPotato.PlayerMode = {}));
    var PlayerMode = TwitchPotato.PlayerMode;
    (function (MultiLayout) {
        MultiLayout[MultiLayout["Default"] = 0] = "Default";
        MultiLayout[MultiLayout["Equal"] = 1] = "Equal";
    })(TwitchPotato.MultiLayout || (TwitchPotato.MultiLayout = {}));
    var MultiLayout = TwitchPotato.MultiLayout;
    (function (ViewMode) {
        ViewMode[ViewMode["Fullscreen"] = 0] = "Fullscreen";
        ViewMode[ViewMode["Windowed"] = 1] = "Windowed";
        ViewMode[ViewMode["Toggle"] = 2] = "Toggle";
    })(TwitchPotato.ViewMode || (TwitchPotato.ViewMode = {}));
    var ViewMode = TwitchPotato.ViewMode;
    (function (MultiPosition) {
        MultiPosition[MultiPosition["Top"] = 0] = "Top";
        MultiPosition[MultiPosition["Left"] = 1] = "Left";
        MultiPosition[MultiPosition["Right"] = 2] = "Right";
        MultiPosition[MultiPosition["Bottom"] = 3] = "Bottom";
        MultiPosition[MultiPosition["Middle"] = 4] = "Middle";
        MultiPosition[MultiPosition["TopLeft"] = 5] = "TopLeft";
        MultiPosition[MultiPosition["TopRight"] = 6] = "TopRight";
        MultiPosition[MultiPosition["BottomLeft"] = 7] = "BottomLeft";
        MultiPosition[MultiPosition["BottomRight"] = 8] = "BottomRight";
    })(TwitchPotato.MultiPosition || (TwitchPotato.MultiPosition = {}));
    var MultiPosition = TwitchPotato.MultiPosition;
    (function (PlayerActions) {
        PlayerActions[PlayerActions["ViewMode"] = 0] = "ViewMode";
        PlayerActions[PlayerActions["Load"] = 1] = "Load";
        PlayerActions[PlayerActions["State"] = 2] = "State";
        PlayerActions[PlayerActions["Mute"] = 3] = "Mute";
        PlayerActions[PlayerActions["Quality"] = 4] = "Quality";
        PlayerActions[PlayerActions["Position"] = 5] = "Position";
        PlayerActions[PlayerActions["Preview"] = 6] = "Preview";
        PlayerActions[PlayerActions["Chat"] = 7] = "Chat";
        PlayerActions[PlayerActions["Layout"] = 8] = "Layout";
    })(TwitchPotato.PlayerActions || (TwitchPotato.PlayerActions = {}));
    var PlayerActions = TwitchPotato.PlayerActions;
    (function (PlayerState) {
        PlayerState[PlayerState["Playing"] = 0] = "Playing";
        PlayerState[PlayerState["Stopped"] = 1] = "Stopped";
    })(TwitchPotato.PlayerState || (TwitchPotato.PlayerState = {}));
    var PlayerState = TwitchPotato.PlayerState;
    (function (Quality) {
        Quality[Quality["Mobile"] = 0] = "Mobile";
        Quality[Quality["Low"] = 1] = "Low";
        Quality[Quality["Medium"] = 2] = "Medium";
        Quality[Quality["High"] = 3] = "High";
        Quality[Quality["Source"] = 4] = "Source";
    })(TwitchPotato.Quality || (TwitchPotato.Quality = {}));
    var Quality = TwitchPotato.Quality;
    (function (Template) {
        Template[Template["NotifyItem"] = 0] = "NotifyItem";
        Template[Template["ContextMenu"] = 1] = "ContextMenu";
        Template[Template["FollowMenu"] = 2] = "FollowMenu";
        Template[Template["ChannelItem"] = 3] = "ChannelItem";
        Template[Template["GameItem"] = 4] = "GameItem";
        Template[Template["VideoItem"] = 5] = "VideoItem";
        Template[Template["ChannelInfo"] = 6] = "ChannelInfo";
        Template[Template["GameInfo"] = 7] = "GameInfo";
        Template[Template["VideoInfo"] = 8] = "VideoInfo";
        Template[Template["PlayerWebview"] = 9] = "PlayerWebview";
        Template[Template["TwitchWebview"] = 10] = "TwitchWebview";
        Template[Template["ChatWebview"] = 11] = "ChatWebview";
    })(TwitchPotato.Template || (TwitchPotato.Template = {}));
    var Template = TwitchPotato.Template;
    (function (ChatLayout) {
        ChatLayout[ChatLayout["FloatLeft"] = 0] = "FloatLeft";
        ChatLayout[ChatLayout["FloatRight"] = 1] = "FloatRight";
        ChatLayout[ChatLayout["DockLeft"] = 2] = "DockLeft";
        ChatLayout[ChatLayout["DockRight"] = 3] = "DockRight";
        ChatLayout[ChatLayout["TopLeft"] = 4] = "TopLeft";
        ChatLayout[ChatLayout["TopRight"] = 5] = "TopRight";
        ChatLayout[ChatLayout["BottomLeft"] = 6] = "BottomLeft";
        ChatLayout[ChatLayout["BottomRight"] = 7] = "BottomRight";
    })(TwitchPotato.ChatLayout || (TwitchPotato.ChatLayout = {}));
    var ChatLayout = TwitchPotato.ChatLayout;
    (function (UpdateType) {
        UpdateType[UpdateType["All"] = 0] = "All";
        UpdateType[UpdateType["Channels"] = 1] = "Channels";
        UpdateType[UpdateType["Games"] = 2] = "Games";
        UpdateType[UpdateType["Game"] = 3] = "Game";
        UpdateType[UpdateType["Videos"] = 4] = "Videos";
        UpdateType[UpdateType["Refresh"] = 5] = "Refresh";
    })(TwitchPotato.UpdateType || (TwitchPotato.UpdateType = {}));
    var UpdateType = TwitchPotato.UpdateType;
    (function (InputType) {
        InputType[InputType["Global"] = 0] = "Global";
        InputType[InputType["Guide"] = 1] = "Guide";
        InputType[InputType["Player"] = 2] = "Player";
    })(TwitchPotato.InputType || (TwitchPotato.InputType = {}));
    var InputType = TwitchPotato.InputType;
    (function (Direction) {
        Direction[Direction["None"] = 0] = "None";
        Direction[Direction["Up"] = 1] = "Up";
        Direction[Direction["Down"] = 2] = "Down";
        Direction[Direction["Left"] = 3] = "Left";
        Direction[Direction["Right"] = 4] = "Right";
        Direction[Direction["JumpUp"] = 5] = "JumpUp";
        Direction[Direction["JumpDown"] = 6] = "JumpDown";
    })(TwitchPotato.Direction || (TwitchPotato.Direction = {}));
    var Direction = TwitchPotato.Direction;
    (function (MenuType) {
        MenuType[MenuType["Channels"] = 0] = "Channels";
        MenuType[MenuType["Games"] = 1] = "Games";
        MenuType[MenuType["Game"] = 2] = "Game";
        MenuType[MenuType["Videos"] = 3] = "Videos";
    })(TwitchPotato.MenuType || (TwitchPotato.MenuType = {}));
    var MenuType = TwitchPotato.MenuType;
    (function (FollowType) {
        FollowType[FollowType["Channel"] = 0] = "Channel";
        FollowType[FollowType["Game"] = 1] = "Game";
    })(TwitchPotato.FollowType || (TwitchPotato.FollowType = {}));
    var FollowType = TwitchPotato.FollowType;
})(TwitchPotato || (TwitchPotato = {}));
//# sourceMappingURL=enums.js.map
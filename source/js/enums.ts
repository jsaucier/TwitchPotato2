module TwitchPotato {

    export enum Inputs {
        Close,
        ZoomIncrease,
        ZoomDecrease,
        ZoomReset,
        SaveSetting,
        ToggleGuide,
        Up,
        Down,
        Left,
        Right,
        PageUp,
        PageDown,
        Select,
        Refresh,
        ContextMenu,
        Stop,
        Play,
        Mute,
        MultiLayout,
        ToggleViewMode,
        Fullscreen,
        Windowed,
        Flashback,
        QualityMobile,
        QualityLow,
        QualityMedium,
        QualityHigh,
        QualitySource,
        ToggleChat,
        Reload
    }

    export enum PlayerMode {
        Full,
        ChatLeft,
        ChatRight
    }

    export enum MultiLayout {
        Default,
        Equal
    }

    export enum ViewMode {
        Fullscreen,
        Windowed,
        Toggle,
        Update
    }

    export enum MultiPosition {
        Top,
        Left,
        Right,
        Bottom,
        Middle,
        TopLeft,
        TopRight,
        BottomLeft,
        BottomRight,
    }

    export enum PlayerActions {
        ViewMode,
        Load,
        State,
        Mute,
        Quality,
        Position,
        Preview,
        Chat,
        Layout
    }

    export enum PlayerState {
        Playing,
        Stopped
    }

    export enum Quality {
        Mobile,
        Low,
        Medium,
        High,
        Source
    }


    export enum Template {
        NotifyItem,
        ContextMenu,
        FollowMenu,
        ChannelItem,
        GameItem,
        VideoItem,
        ChannelInfo,
        GameInfo,
        VideoInfo,
        PlayerWebview,
        TwitchWebview,
        ChatWebview
    }

    export enum ChatLayout {
        FloatLeft,
        FloatRight,
        DockLeft,
        DockRight,
        TopLeft,
        TopRight,
        BottomLeft,
        BottomRight,
    }


    export enum UpdateType {
        All,
        Channels,
        Games,
        Game,
        Videos,
        Refresh
    }

    export enum InputType {
        Global,
        Guide,
        Player
    }

    export enum Direction {
        None,
        Up,
        Down,
        Left,
        Right,
        JumpUp,
        JumpDown
    }

    export enum MenuType {
        Channels,
        Games,
        Game,
        Videos
    }

    export enum FollowType {
        Channel,
        Game
    }
}

module TwitchPotato {

    export interface TimerInterval {
        minutes: number;
        seconds: number;
        hours: number;
    }

    // export class Timers
    // {
    //
    //
    //     Create(id: string, interval: TimerInterval, autoStart = true): Timer
    //     {
    //         if (this._timers[id] === undefined)
    //         {
    //             var timer = new Timer(id, interval, autoStart);
    //
    //             this._timers[id] = timer;
    //         }
    //
    //         return timer;
    //     }
    //
    //     Destroy(id: string): void
    //     {
    //         if (this._timers[id] !== undefined)
    //             delete this._timers[id];
    //     }
    //
    //     private _timers: { [id: string]: Timer } = {};
    // }

    export class Timer {
        constructor(id: string) {

        }

    }

}

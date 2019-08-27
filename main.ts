/**
 * Game lifecycle blocks for 5-second games
 */
//% weight=100 color=#2ac9ac icon="\uf188"
namespace gamejam {
    let _win: boolean;
    let _debug: boolean;

    function init() {
        _win = false;
        _debug = true;
        info.startCountdown(5);
        info.onCountdownEnd(end);
    }

    //% help=game/on-update weight=100 afterOnStart=true
    //% blockId=timestart block="on game start"
    //% blockAllowMultiple=1
    export function start(a: () => void): void {
        init();
        if (!a) return;
        a();
    }

    //% blockId=timeelapsed block="win game!"
    //% weight=80
    export function win(): void {
        _win = true;
    }

    //% blockId=setdebug block="set debug loop %on"
    //% on.shadow=toggleOnOff
    //% weight=80
    export function setDebug(on: boolean): void {
        _debug = on;
    }

    //% blockId=showtext block="show instruction %s for %duration=200 ms"
    //% weight=80
    export function showInstruction(s: string, duration: number): void {
        let r = showText(s);
        pause(duration);
        r.destroy();
    }

    function showText(s: string): scene.Renderable {
        return scene.createRenderable(scene.HUD_Z, function (target: Image, camera: scene.Camera) {
            target.printCenter(s, 0);
        })
    }

    function end(): void {
        control.runInParallel(function () {
            let r: scene.Renderable;
            if (_win) {
                // move to next game
                r = showText("WIN");
            } else {
                r = showText("LOSE");
            }
            pause(750);
            r.destroy();
            if (_debug) control.reset();
        })
    }

    init();
}
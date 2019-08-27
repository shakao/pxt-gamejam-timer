/**
 * Game lifecycle blocks for 5-second games
 */
//% weight=100 color=#2ac9ac icon="\uf188"
namespace gamejam {
    let _win: boolean;

    function init() {
        _win = false;
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

    //% blockId=showtext block="show instruction"
    export function showText(s: string): scene.Renderable {
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
            control.reset();
        })
    }

    init();
}
/**
 * Game lifecycle blocks for 5-second games
 */
//% weight=100 color=#2FBFAE icon="\uf188"
namespace gamejam {
    let _win: boolean;
    let _debug: boolean;

    function init() {
        _win = false;
        _debug = true;
        info.startCountdown(5);
        info.onCountdownEnd(end); // game.onGameOver(end);
    }

    /**
     * Block for starting a 5-second game. Starts the timer and sets
     * up handlers for when the game ends.
     * @param body code to execute at the start of the game
     */
    //% help=game/on-update weight=100 afterOnStart=true
    //% blockId=timestart block="on game start"
    //% blockAllowMultiple=1
    export function start(body: () => void): void {
        init();
        if (!body) return;
        body();
    }

    /**
     * Updates the win state. When the timer expires, if this win state
     * has not been set, the player loses the game.
     */
    //% blockId=timeelapsed block="win game!"
    //% weight=80
    export function win(): void {
        _win = true;
    }

    /**
     * Toggles debug looping. When "on", the game will automatically
     * reset after the time has elapsed.
     * @param on boolean for whether the debug state is on.
     */
    //% blockId=setdebug block="set debug loop %on"
    //% on.shadow=toggleOnOff
    //% weight=80
    export function setDebug(on: boolean): void {
        _debug = on;
    }

    /**
     * Displays text above the game for a length of time.
     * @param text string to display on the screen
     * @param duration length of time to display the string
     */
    //% blockId=showtext block="show instruction %s for %duration ms"
    //% duration.defl=200
    //% weight=80
    export function showInstruction(text: string, duration: number): void {
        let renderable = showText(text);
        pause(duration);
        renderable.destroy();
    }

    /**
     * Displays text above the game.
     * @param text string to display on the screen
     * @return {scene.Renderable} the renderable object containing the text
     */
    function showText(text: string): scene.Renderable {
        return scene.createRenderable(
            scene.HUD_Z,
            function (target: Image, camera: scene.Camera) {
                target.printCenter(text, 0);
            })
    }

    /**
     * Handler for ending the game, called automatically after five seconds
     * has elapsed. Will display "WIN" or "LOSE" text for game development
     * purposes. (In the final collaborative game, this may look different.)
     */
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
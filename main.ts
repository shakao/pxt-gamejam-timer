/**
 * Game lifecycle blocks for 5-second games
 */
//% weight=100 color=#2FBFAE icon="\uf188"
namespace gamejam {
    let _win: boolean;
    let _debug: boolean;
    let _current: number;
    let _scenes: string[] = [];
    let _font = image.scaledFont(image.font5, 2);

    let _winStr = ["GOOD JOB", "WIN!", "NICE", "GREAT", "WOW!", "HOORAY", ":)"];
    let _loseStr = ["TRY AGAIN", "OH NO", ":(", "REDO?", "WHOOPS", "GO AGAIN?"];


    ///////////////////////////////////////////////////////////////////////////
    /////////////////                                         /////////////////
    /////////////////             SCENE FUNCTIONS             /////////////////
    /////////////////                                         /////////////////
    ///////////////////////////////////////////////////////////////////////////

    export function init() {
        _win = false;
        _debug = true;
        _current = 0;
        if (_current < _scenes.length - 1) {
            storyboard.push(_scenes[_current]);
            start();
        }
    }

    export function start() {
        info.startCountdown(5);
        info.onCountdownEnd(end);
        game.onGameOver(end);
    }

    export function register(name: string, cb:() => any) {
        _scenes.push(name)
        storyboard.registerScene(name, cb)
    }

    ///////////////////////////////////////////////////////////////////////////
    /////////////////                                         /////////////////
    /////////////////           LIFECYCLE FUNCTIONS           /////////////////
    /////////////////                                         /////////////////
    ///////////////////////////////////////////////////////////////////////////

    /**
     * Updates the win state. When the timer expires, if this win state
     * has not been set, the player loses the game.
     * @param playerWin whether the player has one or lost the game, eg: true
     */
    //% blockId=timeelapsed block="%playerWin=toggleWinLose game!"
    //% weight=80
    export function win(playerWin: boolean = true): void {
        _win = playerWin;
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
     * Handler for ending the game, called automatically after five seconds
     * has elapsed. Will display "WIN" or "LOSE" text for game development
     * purposes. (In the final collaborative game, this may look different.)
     */
    function end(win?: boolean): void {
        if (win !== undefined) {
            info.stopCountdown();
            _win = win;
        }
        control.runInParallel(function () {
            scene.createRenderable(
                scene.HUD_Z - 1,
                function (target: Image, camera: scene.Camera) {
                    target.fillRect(0, 0, target.width, target.height, 11);
                })

            if (_win) {
                // move to next game
                if (_current < (_scenes.length - 1)) {
                    _current += 1;
                    showInstruction(_winStr[Math.round(Math.random() * _winStr.length - 1)], 750);
                    _win = false;
                    storyboard.replace(_scenes[_current]);
                    start();
                } else {
                    showInstruction("YOU WIN! :)", 750);
                }
            } else {
                showInstruction(_loseStr[Math.round(Math.random() * _loseStr.length - 1)], 750);
                storyboard.pop();
                storyboard.push(_scenes[_current]);
                start();
            }

            // if (_debug) control.reset();
        })
    }

    ///////////////////////////////////////////////////////////////////////////
    /////////////////                                         /////////////////
    /////////////////              TEXT FUNCTIONS             /////////////////
    /////////////////                                         /////////////////
    ///////////////////////////////////////////////////////////////////////////

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
                let x = (target.width - ((text.length - 0.5) * _font.charWidth)) / 2;
                let y = (target.height / 2) - (_font.charHeight / 2);

                printBorder(target, text, x, y, 12, _font);
                target.print(text, x, y, 0, _font);
            })
    }

    function printBorder(img: Image, txt: string, x: number, y: number, c: number, f: image.Font) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                img.print(txt, x + i * 2, y + j * 2, c, f);
            }
        }
    }

    function printShadow(img: Image, txt: string, x: number, y: number, c: number, f: image.Font, up?: boolean, left?: boolean) {
        for (let i = (left ? -1 : 0); i <= (left ? 0 : 1); i++) {
            for (let j = (up ? -1 : 0); j <= (up ? 0 : 1); j++) {
                img.print(txt, x + i * 2, y + j * 2, c, f);
            }
        }
    }

    // Initialize a five-second timer. The game will end when the time expires.
    // init();
}
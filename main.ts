//% color="#00CC00" icon="\uf1f9"
//% block="Traffic light"
//% block.loc.nl="Verkeerslicht"
namespace CTraffic {

    /////////////////
    // Radio group //
    /////////////////

    export enum Group {
        //% block="group 1"
        //% block.loc.nl="groep 1"
        Group1,
        //% block="group 2"
        //% block.loc.nl="groep 2"
        Group2,
        //% block="group 3"
        //% block.loc.nl="groep 3"
        Group3,
        //% block="group 4"
        //% block.loc.nl="groep 4"
        Group4,
        //% block="group 5"
        //% block.loc.nl="groep 5"
        Group5,
        //% block="group 6"
        //% block.loc.nl="groep 6"
        Group6,
        //% block="group 7"
        //% block.loc.nl="groep 7"
        Group7,
        //% block="group 8"
        //% block.loc.nl="groep 8"
        Group8,
        //% block="group 9"
        //% block.loc.nl="groep 9"
        Group9
    }

    let GROUP = Group.Group1

    input.onLogoEvent(TouchButtonEvent.Pressed, function () {
        GROUP++
        if (GROUP > Group.Group9) GROUP = Group.Group1
        radio.setGroup(GROUP)
        display()
    })

    //////////////////
    // Light colors //
    //////////////////

    export enum Color {
        //% block="green"
        //% block.loc.nl="groen"
        Green,
        //% block="orange"
        //% block.loc.nl="oranje"
        Orange,
        //% block="red"
        //% block.loc.nl="rood"
        Red
    }

    let COLOR = Color.Red

    ////////////////////////////
    // Communication commands //
    ////////////////////////////

    export enum COMMAND {
        RequestRed,
        ReadyRed
    }

    ///////////////////////
    // Program structure //
    ///////////////////////

    let BUSY = false

    type commandHandler = () => void
    let EventOnGreen: commandHandler
    let EventOnRed: commandHandler

    export function display() {
        basic.showNumber(GROUP + 1)
        basic.pause(1000)
        basic.clearScreen()
    }

    function handleOnRequestRed() {
        if (EventOnRed) EventOnRed();
        radio.sendNumber(COMMAND.ReadyRed)
    }

    function handleOnRequestGreen() {
        BUSY = true
        if (EventOnGreen) EventOnGreen();
    }

    radio.onReceivedNumber(function (cmd: number) {
        switch (cmd) {
            case COMMAND.RequestRed: handleOnRequestRed(); break;
            case COMMAND.ReadyRed: BUSY = false; break;
        }
    })

    input.onButtonPressed(Button.A, function () {
        handleOnRequestGreen()
    })

    ////////////////////////
    // Programming blocks //
    ////////////////////////

    //% block="wait %time sec"
    //% block.loc.nl="wacht %time sec"
    //% min.defl=1
    export function wait(time: number) {
        basic.pause(time * 1000)
    }

    //% block="light is %color"
    //% block.loc.nl="het licht staat op %color"
    export function isColour(color: Color): boolean {
        return (COLOR == color)
    }

    //% block="turn the light %color"
    //% block.loc.nl="zet het licht op %color"
    export function setColor(color: Color): void {
        COLOR = color

        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P1, 0)
        pins.digitalWritePin(DigitalPin.P2, 0)

        switch (color) {
            case Color.Red: pins.digitalWritePin(DigitalPin.P0, 1); break;
            case Color.Orange: pins.digitalWritePin(DigitalPin.P1, 1); break;
            case Color.Green: pins.digitalWritePin(DigitalPin.P2, 1); break;
        }
    }

    //% block="wait for the other lights to turn red"
    //% block.loc.nl="wacht tot de andere lichten op rood staan"
    export function waitReady(): void {
        while (BUSY) basic.pause(1)
    }

    //% block="request red for the other lights"
    //% block.loc.nl="vraag rood voor de ander lichten aan"
    export function requestRed(): void {
        radio.sendNumber(COMMAND.RequestRed)
    }

    //% color="#FFCC00"
    //% block="when green is requested"
    //% block.loc.nl="wanneer groen is aangevraagd"
    export function onEventGreen(programmableCode: () => void): void {
        EventOnGreen = programmableCode;
    }

    //% color="#FFCC00"
    //% block="when red is requested"
    //% block.loc.nl="wanneer rood is aangevraagd"
    export function onEventRed(programmableCode: () => void): void {
        EventOnRed = programmableCode;
    }
}

CTraffic.display()
CTraffic.setColor(CTraffic.Color.Orange)

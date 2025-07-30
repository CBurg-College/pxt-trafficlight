//% color="#00CC00" icon="\uf1f9"
//% block="Traffic light"
//% block.loc.nl="Verkeerslicht"
namespace CTraffic {

    //////////////////
    // Light colors //
    //////////////////

    export enum Light {
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

    let LIGHT = Light.Orange

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

    function handleOnRequestRed() {
        let clr = LIGHT
        if (EventOnRed) EventOnRed();
        if (clr != Light.Red)
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

    //% block="light is %light"
    //% block.loc.nl="het licht staat op %light"
    export function isLight(light: Light): boolean {
        return (LIGHT == light)
    }

    //% block="turn the light %light"
    //% block.loc.nl="zet het licht op %light"
    export function setLight(light: Light): void {
        LIGHT = light

        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P1, 0)
        pins.digitalWritePin(DigitalPin.P2, 0)

        switch (light) {
            case Light.Red: pins.digitalWritePin(DigitalPin.P0, 1); break;
            case Light.Orange: pins.digitalWritePin(DigitalPin.P1, 1); break;
            case Light.Green: pins.digitalWritePin(DigitalPin.P2, 1); break;
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

displayAfterLogo(() => {
    basic.clearScreen()
})

CTraffic.setLight(CTraffic.Light.Orange)

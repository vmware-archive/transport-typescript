Some simple handling code.


handleSuccess(msg: string) {
        console.log("handling success: ", msg);
    }

    handleError(msg: string) {
        console.log("handling error:", msg);
    }

    generateSuccessResponse(payload: number) {
        return "The number you sent is: " + payload + ", adding one: " + (++payload);
    }

    processNumber() {

        let bus = this.cspComponentService.bus;

        // handle requests on #somechannel and respond by returning value from local method
        bus.respondOnce("#somechannel").generate(
            (payload: number) => this.generateSuccessResponse(payload)
        );

        // send a request to the bus on #somechannel containing 123 as the payload
        bus.requestOnce("#somechannel", 123).handle(
            (success: string) => this.handleSuccess(success),
            (error: string) => this.handleError(error)
        );

    }
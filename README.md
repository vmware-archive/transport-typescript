# Transport - TypeScript

## Overview
### What is Transport?

Transport is a lightweight, framework-agnostic event bus that simplifies state management
in modern distributed web applications. This repository is the TypeScript implementation
of the Transport event bus which provides a reactive publish-subscribe infrastructure along with
built-in support for WebSocket over the STOMP to facilitate decoupling, modularization and universal design.

### A distributed event bus
Transport can be distributed across applications and connected up to RabbitMQ, Kafka or NATS.
It is also an API transport infrastructure & state store which enables actors using Transport to
utilize similar API interfaces across different language implementations.

### An internal freeway system, for applications.
Transport is part of VMware's UI architecture strategy. It decouples presentation logic,
from business logic via an asynchronous event bus. This bus is built on top of ReactiveX
that results in a super fast, super scalable mechanism for actors to communicate and decouple logic.
Transport can be extended from communication within UI components (for managing
Single Page Application states), to UI-to-backend or even backend-to-backend communication.

### [View Transport TypeScript Documentation](https://vmware.github.io/transport/ts)

#### [Transport Docs Repo](https://github.com/vmware/transport)

## Quick Start

```
npm install @vmware/transport-typescript --save
```

### Adding Transport to an Angular application
Angular provides angular.json (for Angular 7+) and angular-cli.json (for Angular 4-5).

In this file, there is a section defined as scripts. This section is where you provide third party scripts to be booted and loaded by your Angular application.

You will need to add the Transport UMD file to this section. It's already been saved in your node_modules folder. Just provide an entry like the one below.

Configuring angular.json
```json
...
"scripts": [
   "node_modules/@vmware/transport/transport.umd.min.js"
]
...
```
Your application is ready to go, now you just need to boot transport

Angular provides a src/main.ts file, which is essentially your initialization script, that you can use to Initialize the Bus.

### Importing Transport in your code
The main interface you will need is EventBus. It provides access to the most common methods.

```
import { EventBus } from '@vmware/transport-typescript';
```

### Hello World

```typescript
export class HelloWorldComponent extends AbstractBase implements OnInit {

    constructor() {
        super('HelloWorldComponent');
        this.run();
    }

    run() {

        // define a channel to talk on.
        let myChannel = 'some-channel';

        // listen for requests on 'myChannel' and return a response.
        this.bus.respondOnce(myChannel)
            .generate(
                (request: string) => {
                    this.log.info(`Request Received: ${request}, Sending Response...`);
                    return 'world';
                }
            );

        this.log.info('Sending Request');

        // send request 'hello' on channel 'myChannel'.
        this.bus.requestOnce(myChannel, 'hello')
            .handle(
                (response: string) => {
                    this.log.info(`hello ${response}`);
                }
            );
    }
}
```

### [Read More TypeScript Documentation](https://vmware.github.io/transport/ts)

## Contributing

The transport-typescript project team welcomes contributions from the community. Before you start working with transport-typescript, please
read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be
signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on
as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License
BSD-2-Clause

Copyright (c) 2017-2021, VMware, Inc.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

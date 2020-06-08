# VMware Transport - TypeScript

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

## Documentation
Work in progress

## Contributing

The transport-typescript project team welcomes contributions from the community. Before you start working with transport-typescript, please
read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be
signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on
as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License
BSD-2-Clause

Copyright (c) 2017-2020, VMware, Inc.

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

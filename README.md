[![pipeline status](https://gitlab.eng.vmware.com/bifrost/typescript/badges/master/pipeline.svg)](https://gitlab.eng.vmware.com/bifrost/typescript/commits/master)
[![coverage report](https://gitlab.eng.vmware.com/bifrost/typescript/badges/master/coverage.svg)](https://gitlab.eng.vmware.com/bifrost/typescript/commits/master)

# VMware Transport

Before using the Transport, we should understand what it is exactly and where it fits into an application's
architecture.

## What is the Transport?

**The Transport is the thread of the Application Fabric**

## A distributed event bus

An event bus that can be distributed across applications and connected up to AMQP or Kafka Brokers.
It is also an API transport infrastructure, & state store.

It's a framework independent backbone for applications. One that provides a reactive pub-sub core
and facilitates decoupling, modularization and universal design.

## An internal freeway system, for applications.
The Transport is part of our core UI architecture strategy. It decouples presentation logic, from business logic via an asynchronous event bus. This bus is built on top of ReactiveX, that
results in a super fast, super scalable mechanism for actors to communicate and decouple logic. The Transport can be extended from the UI/CLI to fabric applications, and between fabric applications.



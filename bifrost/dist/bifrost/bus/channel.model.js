"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Copyright(c) VMware Inc., 2016
 */
var core_1 = require('@angular/core');
var Subject_1 = require('rxjs/Subject');
/**
 * A Channel object represents a single channel on the message bus.
 * This enables many-to-many transactions. Anyone can send a packet on a stream, and anyone can subscribe to a stream.
 * There is no restriction on the object that is placed on a stream and its type is only known to the sender and the
 * receiver.
 *
 * The Channel stream allows for packets and errors to be transmitted and both can be received by subscribers.
 */
var Channel = (function () {
    function Channel(name) {
        this._name = name;
        this._refCount = 0;
        this._streamObject = new Subject_1.Subject();
        this._closed = false;
        this._galactic = false;
    }
    Object.defineProperty(Channel.prototype, "stream", {
        /**
         * Returns the stream object for subscription
         *
         * @returns {Subject<Message>}
         */
        get: function () {
            return this._streamObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "name", {
        /**
         * returns the channel identifier
         *
         * @returns {string}
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "isClosed", {
        /**
         * returns state of stream.
         *
         * @returns {boolean}
         */
        get: function () {
            return this._closed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Transmit data on the stream after switching to event loop.
     *
     * @param message Message
     */
    Channel.prototype.send = function (message) {
        var _this = this;
        setTimeout(function () {
            _this._streamObject.next(message);
        }, 0);
    };
    /**
     * Transmit an error on the stream
     *
     * @param err
     */
    Channel.prototype.error = function (err) {
        this._streamObject.error(err);
    };
    /**
     * Transmit a completion on the stream
     */
    Channel.prototype.complete = function () {
        this._closed = true;
        this._streamObject.complete();
    };
    Channel.prototype.increment = function () {
        return ++this._refCount;
    };
    Channel.prototype.decrement = function () {
        if (this._refCount > 0) {
            --this._refCount;
        }
        return this._refCount;
    };
    Object.defineProperty(Channel.prototype, "refCount", {
        get: function () {
            return this._refCount;
        },
        enumerable: true,
        configurable: true
    });
    Channel.prototype.setGalactic = function () {
        this._galactic = true;
        return this;
    };
    Channel.prototype.setPrivate = function () {
        this._galactic = false;
        return this;
    };
    Object.defineProperty(Channel.prototype, "galactic", {
        get: function () {
            return this._galactic;
        },
        enumerable: true,
        configurable: true
    });
    Channel = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [String])
    ], Channel);
    return Channel;
}());
exports.Channel = Channel;

/**
 * Copyright(c) VMware Inc., 2016
 */
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
var core_1 = require('@angular/core');
var message_schema_1 = require('./message.schema');
/**
 * A Message object represents a single message on the message bus.
 * Messages can contain either a data payload or an error payload.
 * Messages can be a request, or a response. An error notification is always a response.
 * The content of the payload is opaque and its format is only decodable by the sender(s) and the receiver(s)
 * At present, there is only a placeholder for the Message Schema. This is expected to be replaced with JSON-schema
 */
(function (MessageType) {
    MessageType[MessageType["MessageTypeRequest"] = 0] = "MessageTypeRequest";
    MessageType[MessageType["MessageTypeResponse"] = 1] = "MessageTypeResponse";
    MessageType[MessageType["MessageTypeError"] = 2] = "MessageTypeError";
})(exports.MessageType || (exports.MessageType = {}));
var MessageType = exports.MessageType;
var Message = (function () {
    function Message(messageSchema) {
        this._isError = false;
        this._messageSchema = messageSchema;
    }
    Message.prototype.build = function (type, payload, messageSchema, error) {
        if (messageSchema === void 0) { messageSchema = undefined; }
        if (error === void 0) { error = false; }
        this._isError = error;
        this._payload = payload;
        this._type = type;
        this._messageSchema = messageSchema;
        return this;
    };
    Message.prototype.request = function (payload, messageSchema) {
        return this.build(MessageType.MessageTypeRequest, payload, messageSchema);
    };
    Message.prototype.response = function (payload, messageSchema) {
        return this.build(MessageType.MessageTypeResponse, payload, messageSchema);
    };
    Message.prototype.error = function (error, messageSchema) {
        return this.build(MessageType.MessageTypeError, error, messageSchema, true);
    };
    Message.prototype.isRequest = function () {
        return this._type === MessageType.MessageTypeRequest;
    };
    Message.prototype.isResponse = function () {
        return this._type === MessageType.MessageTypeResponse;
    };
    Message.prototype.isError = function () {
        return this._type === MessageType.MessageTypeError;
    };
    Object.defineProperty(Message.prototype, "payload", {
        get: function () {
            return this._payload;
        },
        set: function (payload) {
            this._payload = payload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "messageSchema", {
        get: function () {
            return this._messageSchema;
        },
        enumerable: true,
        configurable: true
    });
    Message = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [message_schema_1.MessageSchema])
    ], Message);
    return Message;
}());
exports.Message = Message;

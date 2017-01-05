/**
 * Copyright(c) VMware Inc., 2016
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * The MessageSchema describes the format of the Message payload (API).
 * We use JSON-schema to describe our message payloads.
 *
 * The accessors are underscored because they are meant to be used by the validation engine and should not be
 * invoked directly from anywhere else in the application. The instance variables need to have the provided names.
 */
var MessageSchema = (function () {
    function MessageSchema(title, description, payload, type) {
        if (description === void 0) { description = 'message schema'; }
        if (type === void 0) { type = 'object'; }
        this.title = title;
        this.description = description;
        this.type = type;
        this.$schema = 'http://json-schema.org/draft-04/schema#';
        this.properties = {
            '_payload': {
                'type': 'object'
            },
            '_isError': {
                'type': 'boolean'
            },
            '_type': {
                'type': 'integer'
            },
            'required': ['_payload', '_type', 'isError']
        };
        if (payload) {
            this.properties._payload = payload;
        }
    }
    Object.defineProperty(MessageSchema.prototype, "_title", {
        get: function () {
            return this.title;
        },
        set: function (title) {
            this.title = title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageSchema.prototype, "_description", {
        get: function () {
            return this.description;
        },
        set: function (description) {
            this.description = description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageSchema.prototype, "_type", {
        get: function () {
            return this.type;
        },
        set: function (type) {
            this.type = type;
        },
        enumerable: true,
        configurable: true
    });
    return MessageSchema;
}());
exports.MessageSchema = MessageSchema;
var ErrorSchema = (function (_super) {
    __extends(ErrorSchema, _super);
    function ErrorSchema() {
        _super.call(this, 'Error', 'Error Response');
    }
    return ErrorSchema;
}(MessageSchema));
exports.ErrorSchema = ErrorSchema;

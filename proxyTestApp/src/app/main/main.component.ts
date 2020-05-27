/*
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { AfterContentInit, Component, OnInit } from '@angular/core';

import { EventBus, MessageHandler } from '@vmw/bifrost/bus.api';
import { Message } from '@vmw/bifrost/bus/model/message.model';
import { MonitorObject, MonitorType } from '@vmw/bifrost/bus/model/monitor.model';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy.api';
import { LogLevel } from '@vmw/bifrost/log';
import { ToastNotification } from '@vmw/ngx-components';
import { ChatMessage, GeneralChatChannel } from '../chat-message';
import { AbstractBase } from '@vmw/bifrost/core';
import { ServbotService } from '../../../services/servbot/servbot.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent extends AbstractBase implements OnInit {

    public generalChatMessages: ChatMessage[];
    public id = EventBus.id;
    public notifications: ToastNotification[];
    public consoleEvents: string[];
    public activeChildren = 0;
    public registeredChildren = 0;
    private generalChat: MessageHandler;

    constructor() {
        super('MainComponent');
        this.bus.api.setLogLevel(LogLevel.Verbose);
        this.bus.api.enableMonitorDump(true);
        this.generalChatMessages = [];
        this.consoleEvents = [];



    }

    ngOnInit() {
        this.listenToBusMonitor();
        this.bus.enableMessageProxy({
            protectedChannels: [GeneralChatChannel, ServbotService.queryChannel],
            proxyType: ProxyType.Parent,
            parentOrigin: 'http://localhost:4300',
            acceptedOrigins: ['http://localhost:4400', 'http://localhost:4300'],
            targetAllFrames: true,
            targetSpecificFrames: null,
        });

        this.notifications = [];
        this.listenChat();
    }

    listenChat() {

        this.generalChat = this.bus.listenStream(GeneralChatChannel);
        this.generalChat.handle(
            () => {
                // do nothing for now, just keep this channel open so children can talk.
            }
        );
    }


    private listenToBusMonitor(): void {
        this.bus.api.getMonitor().subscribe(
            (msg: Message) => {
                const mo: MonitorObject = msg.payload as MonitorObject;
                switch (mo.type) {
                    case MonitorType.MonitorChildProxyRegistered:
                        this.registeredChildren++;
                        this.activeChildren++;
                        this.postToast('Bus Registered', `Child Bus ${mo.from} has registered`, false);
                        break;

                    case MonitorType.MonitorChildProxyNotListening:
                        this.activeChildren--;
                        this.postToast('Bus Disconnected', `Child Bus ${mo.from} has stopped listening`, true);
                        break;

                    case MonitorType.MonitorChildProxyListening:
                        this.activeChildren++;
                        this.postToast('Bus Connected', `Child Bus ${mo.from} has started listening`, false);
                        break;

                    case MonitorType.MonitorBrokerConnectorConnected:
                        this.postToast('Bifröst Extended', `Broker connector has extended bus`, false);
                        break;

                }
            }
        );
    }

    private postToast(title: string, description: string, error: boolean): void {
        this.notifications.push(
            {
                title: title,
                description: description,
                date: new Date(),
                link: null,
                error: error,
                fade: false
            }
        );
    }
}

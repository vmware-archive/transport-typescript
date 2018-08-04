import { Component, OnInit } from '@angular/core';

import { EventBus, Message, MonitorObject, MonitorType } from '@vmw/bifrost';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy';
import { LogLevel } from '@vmw/bifrost/log';
import { ToastNotification } from '@vmw/ngx-components';
import { ChatMessage, GeneralChatChannel } from '../chat-message';
import { AbstractBase } from '@vmw/bifrost/core';
import { ServbotService } from '../../services/servbot/servbot.service';
import { ServiceLoader } from '@vmw/bifrost/util/service.loader';
import { ChatCommand } from '../../services/servbot/servbot.model';

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
    public activeChildren: number = 0;
    public registeredChildren: number = 0;

    constructor() {
        super('MainComponent');
        this.bus.api.setLogLevel(LogLevel.Verbose);
        this.bus.api.enableMonitorDump(true);
        this.generalChatMessages = [];
        this.consoleEvents = [];

        ServiceLoader.addService(ServbotService);
    }

    ngOnInit() {
        this.listenToBusMonitor();
        this.bus.enableMessageProxy({
            protectedChannels: [GeneralChatChannel, ServbotService.queryChannel],
            proxyType: ProxyType.Parent,
            parentOrigin: 'http://localhost:4200',
            acceptedOrigins: ['http://localhost:4200'],
            targetAllFrames: true,
            targetSpecificFrames: null,
        });

        this.notifications = [];
    }

    public connectServbot() {
        this.bus.sendRequestMessage(ServbotService.queryChannel, {command: ChatCommand.Connect}, EventBus.id);
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

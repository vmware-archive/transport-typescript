import { AbstractService } from '@vmw/bifrost/core';
import { EventBus, MessageArgs, MessageHandler } from '@vmw/bifrost';
import { VMCBotRequest, VMCBotResponse, VMCCommand } from './vmcbot.model';
import { BaseTask } from '../../vmc-models/api/vmc-api';
import { GeneralChatChannel } from '../../app/chat-message';

export class VMCBotService extends AbstractService<VMCBotRequest, VMCBotResponse> {

    public static serviceChannel = 'vmcbot';
    public static onlineChannel = 'vmcbot-online';
    public connectionHandler: MessageHandler;

    // hard wired org ID, for demo puposes only.
    private orgId = 'a67ba602-6689-450c-a743-8842ca6b032a';

    public sessionId;

    private sampleObject = '{"user_id":"4ebcab56-5deb-3ffa-8899-190047d54b1d","user_name":"csp@vmware.com","created":"2018-08-06T03:28:59.000490Z","version":32,"id":"e94f9303-a13f-4f56-a73a-4e08a2c87326","updated_by_user_id":"4ebcab56-5deb-3ffa-8899-190047d54b1d","updated_by_user_name":"csp@vmware.com","updated":"2018-08-06T03:30:08.000000Z","status":"FINISHED","resource_id":"f882ba65-ec2d-4f1c-bd2c-bbc76e531f68","resource_type":"sddc","start_resource_entity_version":1,"end_resource_entity_version":16,"parent_task_id":null,"parent_notifications":null,"sub_status":"FINISHED","task_type":"SDDC-PROVISION","error_message":null,"localized_error_message":null,"start_time":"2018-08-06T03:28:56.485000Z","end_time":"2018-08-06T03:30:09.538000Z","retries":0,"task_version":"20180321","progress_percent":100,"estimated_remaining_minutes":0,"task_progress_phases":[{"id":"SDDC_PROVISION","name":"Deploying ESXi Hosts","progress_percent":100},{"id":"SDDC_PREPARE_VMC","name":"Preparing the SDDC Environment","progress_percent":100},{"id":"SDDC_DEPLOY_GATEWAY","name":"Deploying Network Gateways","progress_percent":100},{"id":"SDDC_CONFIG_VMC","name":"Configuring SDDC","progress_percent":100}],"service_errors":[],"locale":"en_US","params":{"mgwName":"sddc-mgw","sddcConfig":{"num_hosts":4,"name":"pizza 2!","provider":"ZEROCLOUD","vxlan_subnet":"192.168.1.0/24","sddc_type":"DEFAULT","deployment_type":"SingleAZ","region":"US_WEST_2"},"registerDomainTaskParam":"1c0c8b63-903d-4866-a774-6d0a7a4cca00"},"org_type":"CUSTOMER","phase_in_progress":"","org_id":"a67ba602-6689-450c-a743-8842ca6b032a"}';

    constructor() {
        super('VMCBot', VMCBotService.serviceChannel);
        this.log.info("VMCBot Service Online");
    }

    private connectService() {

        this.connectionHandler = this.bus.connectBridge(
            (sessionId: string) => {

                this.sessionId = sessionId;
                this.log.info(`VMCBotService connected to broker successfully on bus ${EventBus.id}`);
                this.bus.sendResponseMessage(VMCBotService.onlineChannel, true);

                this.listenToVMCTasks();

                this.bus.sendResponseMessage(GeneralChatChannel, {
                    from: "VMCBot",
                    avatar: "",
                    body: null,
                    time: Date.now(),
                    controlEvent: "VMCBot is online.",
                    error: false,
                });

            },
            '/vmc/ss/nexus/orgs/' + this.orgId,
            '',
            '/queue',
            2,
            'localhost',
            8080
        );


    }

    private listenToVMCTasks() {

        this.bus.listenGalacticStream(`topic/orgs.${this.orgId}.tasks`, this.getName())
            .handle(
                (taskJson: any) => {
                    const task: BaseTask = new BaseTask(taskJson);
                    console.log(task);
                    this.bus.sendResponseMessage(GeneralChatChannel, {
                        from: "VMCBot",
                        avatar: "assets/vmcicon.svg",
                        body: "Task Update",
                        time: Date.now(),
                        controlEvent: "task update",
                        error: false,
                        task: task
                    });
                }
            );

    }

    protected handleServiceRequest(requestObject: VMCBotRequest, requestArgs?: MessageArgs): void {

        if (requestObject && requestObject.command) {
            switch (requestObject.command) {

                case VMCCommand.Connect:
                    this.connectService();
                    break;

                default:
                    break;
            }
        } else {
            this.log.warn('Unable to proceed, no valid commands passed.')
        }
    }

}

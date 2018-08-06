/*
 * Copyright Â© 2018 VMware, Inc. All rights reserved.
 * AUTO-GENERATED 2018-06-11 15:08:14 - DO NOT EDIT DIRECTLY
 *
 */

// tslint:disable


import { BaseTask, BaseTaskProgressPhase, BaseAbstractEntity } from './vmc-api';


/* *********************************************** BaseAbstractEntity *********************************************** */
export class DRaaSBaseAbstractEntity {
    // required: id, version, created, user_id, user_name, updated, updated_by_user_id, updated_by_user_name
    public  created             : string;    // format: date-time
    public  id                  : string;
    public  updated             : string;    // format: date-time
    public  updated_by_user_id  : string;    // description: User id that last updated this record
    public  updated_by_user_name: string;    // description: User name that last updated this record
    public  user_id             : string;    // description: User id that last updated this record
    public  user_name           : string;    // description: User name that last updated this record
    public  version             : string;
    constructor (json?: any) {
        if (json) {
            this.created = json['created'];
            this.id = json['id'];
            this.updated = json['updated'];
            this.updated_by_user_id = json['updated_by_user_id'];
            this.updated_by_user_name = json['updated_by_user_name'];
            this.user_id = json['user_id'];
            this.user_name = json['user_name'];
            this.version = json['version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.created !== undefined
            && this.id !== undefined
            && this.updated !== undefined
            && this.updated_by_user_id !== undefined
            && this.updated_by_user_name !== undefined
            && this.user_id !== undefined
            && this.user_name !== undefined
            && this.version !== undefined;
    }
}

/* *********************************************** BaseErrorResponse ************************************************ */
export class BaseErrorResponse {
    // required: error_code, error_messages, status, path, retryable
    public  error_code    : string;    // description: unique error code
    public  error_messages: Array<string>;    // description: localized error messages
    public  path          : string;    // description: Originating request URI
    public  retryable     : boolean;    // description: If true, client should retry operation
    public  status        : number;    // description: HTTP status code
    constructor (json?: any) {
        if (json) {
            this.error_code = json['error_code'];
            this.error_messages = json['error_messages'];
            this.path = json['path'];
            this.retryable = json['retryable'];
            this.status = json['status'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.error_code !== undefined
            && this.error_messages !== undefined
            && this.path !== undefined
            && this.retryable !== undefined
            && this.status !== undefined;
    }
}

/* ************************************************ BaseFirewallRule ************************************************ */
export const FIREWALLRULE_ACTION_ALLOW = 'ALLOW';
export const FIREWALLRULE_ACTION_DENY = 'DENY';
export const FIREWALLRULE_RULE_TYPE_USER = 'USER';
export const FIREWALLRULE_RULE_TYPE_DEFAULT = 'DEFAULT';

export enum FIREWALLRULE_action {
   Allow = 'ALLOW',
   Deny = 'DENY'
}

export enum FIREWALLRULE_ruletype {
   Default = 'DEFAULT',
   User = 'USER'
}

export class BaseFirewallRule {
    public  action           : string;    // enum: ['ALLOW', 'DENY']
    public  application_ids  : Array<string>;    // description: Id of Service available to the gateway.
    public  destination      : string;    // description: Optional. Possible formats are IP, IP1-IPn, CIDR or comma
                                    // separated list of those entries. If not specified, defaults to 'any'.
    public  destination_scope: BaseFirewallRuleScope;
    public  id               : string;    // readOnly: True
    public  name             : string;
    public  revision         : number;    // description: current revision of the list of firewall rules, used to protect
                                 // against concurrent modification (first writer wins), format: int32, readOnly:
                                 // True
    public  rule_interface   : string;    // description: Deprecated, left for backwards compatibility. Remove once UI
                                       // stops using it.
    public  rule_type        : string;    // enum: ['USER', 'DEFAULT'], readOnly: True
    public  services         : Array<BaseFirewallService>;    // description: list of protocols and ports for this firewall
                                                     // rule
    public  source           : string;    // description: Optional. Possible formats are IP, IP1-IPn, CIDR or comma separated
                               // list of those entries. If not specified, defaults to 'any'.
    public  source_scope     : BaseFirewallRuleScope;
    constructor (json?: any) {
        if (json) {
            this.action = json['action'];
            this.application_ids = json['application_ids'];
            this.destination = json['destination'];
            this.destination_scope = new BaseFirewallRuleScope(json['destination_scope']);
            Object.assign(this.destination_scope, json['destination_scope']);
            this.id = json['id'];
            this.name = json['name'];
            this.revision = json['revision'];
            this.rule_interface = json['rule_interface'];
            this.rule_type = json['rule_type'];

            if (json['services']) {
                this.services = [];
                for (let item of json['services']) {
                    this.services.push(Object.assign(new BaseFirewallService(item), item));
                }
            }
            this.source = json['source'];
            this.source_scope = new BaseFirewallRuleScope(json['source_scope']);
            Object.assign(this.source_scope, json['source_scope']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.action !== undefined
            && this.application_ids !== undefined
            && this.destination !== undefined
            && this.destination_scope !== undefined
            && this.id !== undefined
            && this.name !== undefined
            && this.revision !== undefined
            && this.rule_interface !== undefined
            && this.rule_type !== undefined
            && this.services !== undefined
            && this.source !== undefined
            && this.source_scope !== undefined;
    }
}

/* ********************************************* BaseFirewallRuleScope ********************************************** */
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VSE = 'vse';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_INTERNAL = 'internal';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_EXTERNAL = 'external';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_0 = 'vnic-index-0';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_1 = 'vnic-index-1';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_2 = 'vnic-index-2';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_3 = 'vnic-index-3';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_4 = 'vnic-index-4';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_5 = 'vnic-index-5';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_6 = 'vnic-index-6';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_7 = 'vnic-index-7';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_8 = 'vnic-index-8';
export const FIREWALLRULESCOPE_VNIC_GROUP_IDS_VNIC_INDEX_9 = 'vnic-index-9';

export enum FIREWALLRULESCOPE_vnicgroupids {
   External = 'external',
   Internal = 'internal',
   Vnicindex0 = 'vnic-index-0',
   Vnicindex1 = 'vnic-index-1',
   Vnicindex2 = 'vnic-index-2',
   Vnicindex3 = 'vnic-index-3',
   Vnicindex4 = 'vnic-index-4',
   Vnicindex5 = 'vnic-index-5',
   Vnicindex6 = 'vnic-index-6',
   Vnicindex7 = 'vnic-index-7',
   Vnicindex8 = 'vnic-index-8',
   Vnicindex9 = 'vnic-index-9',
   Vse = 'vse'
}

export class BaseFirewallRuleScope {
    public  grouping_object_ids: Array<string>;    // description: Id of IPAddresses grouping Objects available to
                                                   // the gateway.
    public  vnic_group_ids     : Array<string>;    // description: vnic group id, enum: ['vse', 'internal', 'external',
                                              // 'vnic-index-0', 'vnic-index-1', 'vnic-index-2', 'vnic-index-3',
                                              // 'vnic-index-4', 'vnic-index-5', 'vnic-index-6', 'vnic-index-7',
                                              // 'vnic-index-8', 'vnic-index-9']
    constructor (json?: any) {
        if (json) {
            this.grouping_object_ids = json['grouping_object_ids'];
            this.vnic_group_ids = json['vnic_group_ids'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.grouping_object_ids !== undefined
            && this.vnic_group_ids !== undefined;
    }
}

/* ********************************************** BaseFirewallService *********************************************** */
export class BaseFirewallService {
    public  ports   : Array<string>;    // description: a list of port numbers and port ranges, such as {80, 91-95,
                                     // 99}. If not specified, defaults to 'any'.
    public  protocol: string;    // description: protocol name, such as 'tcp', 'udp' etc.
    constructor (json?: any) {
        if (json) {
            this.ports = json['ports'];
            this.protocol = json['protocol'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.ports !== undefined
            && this.protocol !== undefined;
    }
}

/* *************************************** BaseManagementVmGuestOsCredentials *************************************** */
export class BaseManagementVmGuestOsCredentials {
    // required: vm
    public  os_admin_password  : string;
    public  os_admin_username  : string;
    public  os_service_password: string;
    public  os_service_username: string;
    public  vm                 : string;
    constructor (json?: any) {
        if (json) {
            this.os_admin_password = json['os_admin_password'];
            this.os_admin_username = json['os_admin_username'];
            this.os_service_password = json['os_service_password'];
            this.os_service_username = json['os_service_username'];
            this.vm = json['vm'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.vm !== undefined;
    }
}

/* ************************************************ BaseSiteRecovery ************************************************ */
export const SITERECOVERY_SITE_RECOVERY_STATE_ACTIVATING = 'ACTIVATING';
export const SITERECOVERY_SITE_RECOVERY_STATE_ACTIVATED = 'ACTIVATED';
export const SITERECOVERY_SITE_RECOVERY_STATE_DEACTIVATING = 'DEACTIVATING';
export const SITERECOVERY_SITE_RECOVERY_STATE_DEACTIVATED = 'DEACTIVATED';
export const SITERECOVERY_SITE_RECOVERY_STATE_FAILED = 'FAILED';
export const SITERECOVERY_SITE_RECOVERY_STATE_CANCELED = 'CANCELED';
export const SITERECOVERY_SITE_RECOVERY_STATE_DELETED = 'DELETED';

export enum SITERECOVERY_siterecoverystate {
   Activated = 'ACTIVATED',
   Activating = 'ACTIVATING',
   Canceled = 'CANCELED',
   Deactivated = 'DEACTIVATED',
   Deactivating = 'DEACTIVATING',
   Deleted = 'DELETED',
   Failed = 'FAILED'
}

export class BaseSiteRecovery extends BaseAbstractEntity {
    // required: sddc_id, site_recovery_state
    public  draas_h5_url        : string;
    public  hms_roles           : Array<string>;    // uniqueItems: True, x-vmw-vmc-exclude: client
    public  hms_solution_user   : string;    // x-vmw-vmc-exclude: client
    public  sddc_id             : string;    // format: UUID
    public  site_recovery_state : string;    // enum: ['ACTIVATING', 'ACTIVATED', 'DEACTIVATING', 'DEACTIVATED',
                                            // 'FAILED', 'CANCELED', 'DELETED']
    public  srm_instance_uuid   : string;    // x-vmw-vmc-exclude: client
    public  srm_license_asset_id: string;    // x-vmw-vmc-exclude: client
    public  srm_node            : BaseSiteRecoveryNode;
    public  srm_ovf_library_id  : string;    // x-vmw-vmc-exclude: client
    public  vr_node             : BaseSiteRecoveryNode;
    public  vr_ovf_library_id   : string;    // x-vmw-vmc-exclude: client
    constructor (json?: any) {
        super(json);
        if (json) {
            this.draas_h5_url = json['draas_h5_url'];
            this.hms_roles = json['hms_roles'];
            this.hms_solution_user = json['hms_solution_user'];
            this.sddc_id = json['sddc_id'];
            this.site_recovery_state = json['site_recovery_state'];
            this.srm_instance_uuid = json['srm_instance_uuid'];
            this.srm_license_asset_id = json['srm_license_asset_id'];
            this.srm_node = new BaseSiteRecoveryNode(json['srm_node']);
            Object.assign(this.srm_node, json['srm_node']);
            this.srm_ovf_library_id = json['srm_ovf_library_id'];
            this.vr_node = new BaseSiteRecoveryNode(json['vr_node']);
            Object.assign(this.vr_node, json['vr_node']);
            this.vr_ovf_library_id = json['vr_ovf_library_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.sddc_id !== undefined
            && this.site_recovery_state !== undefined;
    }
}

/* ****************************************** BaseSiteRecoveryCredentials ******************************************* */
export class BaseSiteRecoveryCredentials {
    public  site_recovery_manager: Array<BaseManagementVmGuestOsCredentials>;
    public  vsphere_replication  : Array<BaseManagementVmGuestOsCredentials>;
    constructor (json?: any) {
        if (json) {

            if (json['site_recovery_manager']) {
                this.site_recovery_manager = [];
                for (let item of json['site_recovery_manager']) {
                    this.site_recovery_manager.push(Object.assign(new BaseManagementVmGuestOsCredentials(item), item));
                }
            }

            if (json['vsphere_replication']) {
                this.vsphere_replication = [];
                for (let item of json['vsphere_replication']) {
                    this.vsphere_replication.push(Object.assign(new BaseManagementVmGuestOsCredentials(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.site_recovery_manager !== undefined
            && this.vsphere_replication !== undefined;
    }
}

/* ********************************************** BaseSiteRecoveryNode ********************************************** */
export const SITERECOVERYNODE_TYPE_VRMS = 'VRMS';
export const SITERECOVERYNODE_TYPE_SRM = 'SRM';
export const SITERECOVERYNODE_TYPE_VRS = 'VRS';

export enum SITERECOVERYNODE_type {
   Srm = 'SRM',
   Vrms = 'VRMS',
   Vrs = 'VRS'
}

export class BaseSiteRecoveryNode {
    // required: type
    public  additional_password: string;    // x-vmw-vmc-exclude: client
    public  additional_username: string;    // x-vmw-vmc-exclude: client
    public  gateway            : string;
    public  hostname           : string;
    public  ip_address         : string;
    public  password           : string;    // x-vmw-vmc-exclude: client
    public  subnet             : string;
    public  type               : string;    // enum: ['VRMS', 'SRM', 'VRS']
    public  username           : string;    // x-vmw-vmc-exclude: client
    public  vm_moref_id        : string;
    constructor (json?: any) {
        if (json) {
            this.additional_password = json['additional_password'];
            this.additional_username = json['additional_username'];
            this.gateway = json['gateway'];
            this.hostname = json['hostname'];
            this.ip_address = json['ip_address'];
            this.password = json['password'];
            this.subnet = json['subnet'];
            this.type = json['type'];
            this.username = json['username'];
            this.vm_moref_id = json['vm_moref_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.type !== undefined;
    }
}

/* ****************************************** BaseSiteRecoveryNodeVersion ******************************************* */
export const SITERECOVERYNODEVERSION_NODE_TYPE_VRMS = 'VRMS';
export const SITERECOVERYNODEVERSION_NODE_TYPE_SRM = 'SRM';
export const SITERECOVERYNODEVERSION_NODE_TYPE_VRS = 'VRS';

export enum SITERECOVERYNODEVERSION_nodetype {
   Srm = 'SRM',
   Vrms = 'VRMS',
   Vrs = 'VRS'
}

export class BaseSiteRecoveryNodeVersion {
    public  full_version: string;
    public  node_id     : string;    // format: UUID
    public  node_ip     : string;
    public  node_type   : string;    // enum: ['VRMS', 'SRM', 'VRS']
    constructor (json?: any) {
        if (json) {
            this.full_version = json['full_version'];
            this.node_id = json['node_id'];
            this.node_ip = json['node_ip'];
            this.node_type = json['node_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.full_version !== undefined
            && this.node_id !== undefined
            && this.node_ip !== undefined
            && this.node_type !== undefined;
    }
}

/* ********************************************* BaseSiteRecoveryState ********************************************** */
export class BaseSiteRecoveryState {
    /* No var_list in class SiteRecoveryState */
    constructor (json?: any) {
        if (json) {}
    }

    public hasRequiredProperties(): boolean {
        return true;
    }
}

/* ******************************************** BaseSiteRecoveryVersions ******************************************** */
export class BaseSiteRecoveryVersions {
    public  node_versions: Array<BaseSiteRecoveryNodeVersion>;    // description: list of site recovery node version
    public  sddc_id      : string;    // format: UUID
    constructor (json?: any) {
        if (json) {

            if (json['node_versions']) {
                this.node_versions = [];
                for (let item of json['node_versions']) {
                    this.node_versions.push(Object.assign(new BaseSiteRecoveryNodeVersion(item), item));
                }
            }
            this.sddc_id = json['sddc_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.node_versions !== undefined
            && this.sddc_id !== undefined;
    }
}

/* **************************************************** BaseTask **************************************************** */
export const TASK_STATUS_STARTED = 'STARTED';
export const TASK_STATUS_CANCELING = 'CANCELING';
export const TASK_STATUS_FINISHED = 'FINISHED';
export const TASK_STATUS_FAILED = 'FAILED';
export const TASK_STATUS_CANCELED = 'CANCELED';

export enum TASK_status {
   Canceled = 'CANCELED',
   Canceling = 'CANCELING',
   Failed = 'FAILED',
   Finished = 'FINISHED',
   Started = 'STARTED'
}

export class DRaaSBaseTask extends BaseAbstractEntity {
    // required: id, start_time, status, sub_status, task_type, version
    public  end_time                   : string;    // format: date-time
    public  error_message              : string;
    public  estimated_remaining_minutes: number;    // description: Estimated remaining time in minute of the task
                                                    // execution, < 0 means no estimation for the task., format:
                                                    // int32
    public  params                     : any;
    public  parent_task_id             : string;
    public  progress_percent           : number;    // description: Estimated progress percentage the task executed, format:
                                         // int32
    public  resource_id                : string;    // description: UUID of resources task is acting upon
    public  resource_type              : string;    // description: Type of resource being acted upon
    public  retries                    : number;    // format: int32
    public  start_time                 : string;
    public  status                     : string;    // enum: ['STARTED', 'CANCELING', 'FINISHED', 'FAILED', 'CANCELED']
    public  sub_status                 : string;
    public  task_progress_phases       : Array<BaseTaskProgressPhase>;    // description: Task progress phases involved in
                                                                   // current task execution
    public  task_type                  : string;
    public  task_version               : string;
    public  tenant_id                  : string;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.end_time = json['end_time'];
            this.error_message = json['error_message'];
            this.estimated_remaining_minutes = json['estimated_remaining_minutes'];
            this.params = json['params'];
            this.parent_task_id = json['parent_task_id'];
            this.progress_percent = json['progress_percent'];
            this.resource_id = json['resource_id'];
            this.resource_type = json['resource_type'];
            this.retries = json['retries'];
            this.start_time = json['start_time'];
            this.status = json['status'];
            this.sub_status = json['sub_status'];

            if (json['task_progress_phases']) {
                this.task_progress_phases = [];
                for (let item of json['task_progress_phases']) {
                    this.task_progress_phases.push(Object.assign(new BaseTaskProgressPhase(item), item));
                }
            }
            this.task_type = json['task_type'];
            this.task_version = json['task_version'];
            this.tenant_id = json['tenant_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.id !== undefined
            && this.start_time !== undefined
            && this.status !== undefined
            && this.sub_status !== undefined
            && this.task_type !== undefined
            && this.version !== undefined;
    }
}

/* ********************************************* BaseTaskProgressPhase ********************************************** */
export class DRaaSBaseTaskProgressPhase {
    // required: id, name, progress_percent
    public  id              : string;    // description: The identifier of the task progress phase
    public  name            : string;    // description: The display name of the task progress phase
    public  progress_percent: number;    // description: The percentage of the phase that has completed, format:
                                         // int32
    constructor (json?: any) {
        if (json) {
            this.id = json['id'];
            this.name = json['name'];
            this.progress_percent = json['progress_percent'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.id !== undefined
            && this.name !== undefined
            && this.progress_percent !== undefined;
    }
}




/*  ================================================================================================================ */
/*  PATHS                                                                                                            */
/*  ================================================================================================================ */

export const BASE_PATH = '/';

// URI: /vmc/draas/api/operator/sddcs/site-recovery
export class API_VmcDraasApiOperatorSddcsSiterecovery<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/site-recovery';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: string[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(item);
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSiterecovery'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/site-recovery-state
export class API_VmcDraasApiOperatorSddcsSiterecoverystate<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/site-recovery-state';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: string[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(item);
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSiterecoverystate'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/site-recovery-state/{state}
export class API_VmcDraasApiOperatorSddcsSiterecoverystateState<T> {
   private state: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, state: string) {
      this.state = state;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/site-recovery-state/' + state;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {{ successHandler(ref, responseJSON); }},
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSiterecoverystateState'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/site-recovery
export class API_VmcDraasApiOperatorSddcsSddcSiterecovery<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc + '/site-recovery';
      this.ref = ref;
   }

   public httpDelete(force: boolean, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (force) {
         uri = uri + '&force=' + force;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecovery'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSiteRecovery(responseJSON)); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecovery'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/site-recovery-state
export class API_VmcDraasApiOperatorSddcsSddcSiterecoverystate<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc + '/site-recovery-state';
      this.ref = ref;
   }

   public httpPatch(
      siteRecoveryState: BaseSiteRecoveryState,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(siteRecoveryState);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecoverystate'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/site-recovery/credentials
export class API_VmcDraasApiOperatorSddcsSddcSiterecoveryCredentials<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc + '/site-recovery/credentials';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSiteRecoveryCredentials(responseJSON)); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecoveryCredentials'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/site-recovery/reconfigure-permission
export class API_VmcDraasApiOperatorSddcsSddcSiterecoveryReconfigurepermission<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc + '/site-recovery/reconfigure-permission';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecoveryReconfigurepermission'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/site-recovery/reconfigure-ui
export class API_VmcDraasApiOperatorSddcsSddcSiterecoveryReconfigureui<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc + '/site-recovery/reconfigure-ui';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecoveryReconfigureui'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/site-recovery/reconfigure-vr
export class API_VmcDraasApiOperatorSddcsSddcSiterecoveryReconfigurevr<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc + '/site-recovery/reconfigure-vr';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecoveryReconfigurevr'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/site-recovery/srm-license
export class API_VmcDraasApiOperatorSddcsSddcSiterecoverySrmlicense<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc + '/site-recovery/srm-license';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecoverySrmlicense'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/site-recovery/srm-ntp
export class API_VmcDraasApiOperatorSddcsSddcSiterecoverySrmntp<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc + '/site-recovery/srm-ntp';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecoverySrmntp'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/site-recovery/support-bundle/prevent-log-collection-freeze
export class API_VmcDraasApiOperatorSddcsSddcSiterecoverySupportbundlePreventlogcollectionfreeze<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc +
      '/site-recovery/support-bundle/prevent-log-collection-freeze';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSiterecoverySupportbundlePreventlogcollectionfreeze'
      );
   }
}

// URI: /vmc/draas/api/operator/sddcs/{sddc}/support-bundle/{siteRecoverySupportBundleType}
export class API_VmcDraasApiOperatorSddcsSddcSupportbundleSiterecoverysupportbundletype<T> {
   private sddc: string;
   private siterecoverysupportbundletype: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, siterecoverysupportbundletype: string) {
      this.sddc = sddc;
      this.siterecoverysupportbundletype = siterecoverysupportbundletype;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/sddcs/' + sddc +
      '/support-bundle/' + siterecoverysupportbundletype;
      this.ref = ref;
   }

   public httpPost(ipAddress: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (ipAddress) {
         uri = uri + '&ipAddress=' + ipAddress;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_VmcDraasApiOperatorSddcsSddcSupportbundleSiterecoverysupportbundletype'
      );
   }
}

// URI: /vmc/draas/api/operator/support-bundle/{task}/cleanup
export class API_VmcDraasApiOperatorSupportbundleTaskCleanup<T> {
   private task: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, task: string) {
      this.task = task;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/support-bundle/' + task + '/cleanup';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOperatorSupportbundleTaskCleanup'
      );
   }
}

// URI: /vmc/draas/api/operator/support-bundle/{task}/download
export class API_VmcDraasApiOperatorSupportbundleTaskDownload<T> {
   private task: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, task: string) {
      this.task = task;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/operator/support-bundle/' + task + '/download';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOperatorSupportbundleTaskDownload'
      );
   }
}

// URI: /vmc/draas/api/orgs/{org}/sddcs/{sddc}/site-recovery
export class API_VmcDraasApiOrgsOrgSddcsSddcSiterecovery<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/orgs/' + org + '/sddcs/' + sddc + '/site-recovery';
      this.ref = ref;
   }

   public httpDelete(force: boolean, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (force) {
         uri = uri + '&force=' + force;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_VmcDraasApiOrgsOrgSddcsSddcSiterecovery'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSiteRecovery(responseJSON)); },
         failureHandler,
         'API_VmcDraasApiOrgsOrgSddcsSddcSiterecovery'
      );
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_VmcDraasApiOrgsOrgSddcsSddcSiterecovery'
      );
   }
}

// URI: /vmc/draas/api/orgs/{org}/sddcs/{sddc}/site-recovery/default-firewall-rules
export class API_VmcDraasApiOrgsOrgSddcsSddcSiterecoveryDefaultfirewallrules<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/orgs/' + org + '/sddcs/' + sddc + '/site-recovery/default-firewall-rules';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseFirewallRule[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseFirewallRule(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_VmcDraasApiOrgsOrgSddcsSddcSiterecoveryDefaultfirewallrules'
      );
   }
}

// URI: /vmc/draas/api/orgs/{org}/sddcs/{sddc}/site-recovery/versions
export class API_VmcDraasApiOrgsOrgSddcsSddcSiterecoveryVersions<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/orgs/' + org + '/sddcs/' + sddc + '/site-recovery/versions';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSiteRecoveryVersions(responseJSON)); },
         failureHandler,
         'API_VmcDraasApiOrgsOrgSddcsSddcSiterecoveryVersions'
      );
   }
}

// URI: /vmc/draas/api/orgs/{org}/sddcs/{sddc}/support-bundle/{siteRecoverySupportBundleType}
export class API_VmcDraasApiOrgsOrgSddcsSddcSupportbundleSiterecoverysupportbundletype<T> {
   private org: string;
   private sddc: string;
   private siterecoverysupportbundletype: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, siterecoverysupportbundletype: string) {
      this.org = org;
      this.sddc = sddc;
      this.siterecoverysupportbundletype = siterecoverysupportbundletype;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/orgs/' + org + '/sddcs/' +
      sddc + '/support-bundle/' + siterecoverysupportbundletype;
      this.ref = ref;
   }

   public httpPost(ipAddress: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (ipAddress) {
         uri = uri + '&ipAddress=' + ipAddress;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_VmcDraasApiOrgsOrgSddcsSddcSupportbundleSiterecoverysupportbundletype'
      );
   }
}

// URI: /vmc/draas/api/orgs/{org}/support-bundle/{task}/cleanup
export class API_VmcDraasApiOrgsOrgSupportbundleTaskCleanup<T> {
   private org: string;
   private task: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, task: string) {
      this.org = org;
      this.task = task;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/orgs/' + org + '/support-bundle/' + task + '/cleanup';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOrgsOrgSupportbundleTaskCleanup'
      );
   }
}

// URI: /vmc/draas/api/orgs/{org}/support-bundle/{task}/download
export class API_VmcDraasApiOrgsOrgSupportbundleTaskDownload<T> {
   private org: string;
   private task: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, task: string) {
      this.org = org;
      this.task = task;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/draas/api/orgs/' + org + '/support-bundle/' + task + '/download';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcDraasApiOrgsOrgSupportbundleTaskDownload'
      );
   }
}



/* >>> END OF FILE <<< */

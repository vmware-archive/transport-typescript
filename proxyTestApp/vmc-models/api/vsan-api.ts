/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * AUTO-GENERATED 2018-08-01 13:16:08 - DO NOT EDIT DIRECTLY
 *
 */

// tslint:disable





/* ********************************************** BaseApplicableScope *********************************************** */
export class BaseApplicableScope {
    public  blacklisted_keys: Array<string>;
    public  rollout_percent : number;    // format: int32
    public  whitelisted_keys: Array<string>;
    constructor (json?: any) {
        if (json) {
            this.blacklisted_keys = json['blacklisted_keys'];
            this.rollout_percent = json['rollout_percent'];
            this.whitelisted_keys = json['whitelisted_keys'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.blacklisted_keys !== undefined
            && this.rollout_percent !== undefined
            && this.whitelisted_keys !== undefined;
    }
}

/* **************************************** BaseApplicableScopePatchRequest ***************************************** */
export class BaseApplicableScopePatchRequest {
    public  add_blacklisted_keys   : Array<string>;
    public  add_whitelisted_keys   : Array<string>;
    public  blacklisted_keys       : Array<string>;
    public  remove_blacklisted_keys: Array<string>;
    public  remove_whitelisted_keys: Array<string>;
    public  rollout_percent        : number;    // format: int32
    public  whitelisted_keys       : Array<string>;
    constructor (json?: any) {
        if (json) {
            this.add_blacklisted_keys = json['add_blacklisted_keys'];
            this.add_whitelisted_keys = json['add_whitelisted_keys'];
            this.blacklisted_keys = json['blacklisted_keys'];
            this.remove_blacklisted_keys = json['remove_blacklisted_keys'];
            this.remove_whitelisted_keys = json['remove_whitelisted_keys'];
            this.rollout_percent = json['rollout_percent'];
            this.whitelisted_keys = json['whitelisted_keys'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.add_blacklisted_keys !== undefined
            && this.add_whitelisted_keys !== undefined
            && this.blacklisted_keys !== undefined
            && this.remove_blacklisted_keys !== undefined
            && this.remove_whitelisted_keys !== undefined
            && this.rollout_percent !== undefined
            && this.whitelisted_keys !== undefined;
    }
}

/* ************************************************* BaseAuthToken ************************************************** */
export class BaseAuthToken {
    // required: auth_token
    public  auth_token: string;
    constructor (json?: any) {
        if (json) {
            this.auth_token = json['auth_token'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.auth_token !== undefined;
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

/* ****************************************** BaseFeatureEvaluationStatus ******************************************* */
export class BaseFeatureEvaluationStatus {
    public  applicable_status: boolean;    // readOnly: True
    constructor (json?: any) {
        if (json) {
            this.applicable_status = json['applicable_status'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.applicable_status !== undefined;
    }
}

/* *********************************************** BaseOrgProperties ************************************************ */
export class BaseOrgProperties {
    public  values: any;
    constructor (json?: any) {
        if (json) {
            this.values = json['values'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.values !== undefined;
    }
}

/* ************************************************ BaseOrganization ************************************************ */
export const ORGANIZATION_ORG_STATE_CREATED = 'CREATED';
export const ORGANIZATION_ORG_STATE_DELETED = 'DELETED';

export enum ORGANIZATION_orgstate {
   Created = 'CREATED',
   Deleted = 'DELETED'
}

export class BaseOrganization {
    // required: created, display_name, id, name, org_state, user_id, user_name, version
    public  created     : string;    // format: date-time
    public  display_name: string;
    public  id          : string;
    public  name        : string;
    public  org_state   : string;    // enum: ['CREATED', 'DELETED']
    public  properties  : any;
    public  user_id     : string;
    public  user_name   : string;
    public  version     : number;    // format: int32
    constructor (json?: any) {
        if (json) {
            this.created = json['created'];
            this.display_name = json['display_name'];
            this.id = json['id'];
            this.name = json['name'];
            this.org_state = json['org_state'];
            this.properties = json['properties'];
            this.user_id = json['user_id'];
            this.user_name = json['user_name'];
            this.version = json['version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.created !== undefined
            && this.display_name !== undefined
            && this.id !== undefined
            && this.name !== undefined
            && this.org_state !== undefined
            && this.user_id !== undefined
            && this.user_name !== undefined
            && this.version !== undefined;
    }
}

/* ************************************************* BaseSksFeature ************************************************* */
export const SKSFEATURE_CATEGORY_UI = 'UI';
export const SKSFEATURE_CATEGORY_SERVICE = 'SERVICE';
export const SKSFEATURE_CATEGORY_E2E = 'E2E';
export const SKSFEATURE_STATE_ACTIVE = 'ACTIVE';
export const SKSFEATURE_STATE_OBSOLETE = 'OBSOLETE';
export const SKSFEATURE_STATE_NOT_FOUND = 'NOT_FOUND';
export const SKSFEATURE_TYPE_INTERNAL = 'INTERNAL';
export const SKSFEATURE_TYPE_CUSTOMER = 'CUSTOMER';

export enum SKSFEATURE_category {
   E2e = 'E2E',
   Service = 'SERVICE',
   Ui = 'UI'
}

export enum SKSFEATURE_state {
   Active = 'ACTIVE',
   Not_found = 'NOT_FOUND',
   Obsolete = 'OBSOLETE'
}

export enum SKSFEATURE_type {
   Customer = 'CUSTOMER',
   Internal = 'INTERNAL'
}

export class BaseSksFeature {
    // required: id, description, enable
    public  additional_properties: any;
    public  applicable_scope     : BaseApplicableScope;
    public  category             : string;    // enum: ['UI', 'SERVICE', 'E2E']
    public  description          : string;
    public  enable               : boolean;
    public  id                   : string;
    public  is_base_feature      : boolean;
    public  namespace            : string;
    public  state                : string;    // enum: ['ACTIVE', 'OBSOLETE', 'NOT_FOUND']
    public  type                 : string;    // enum: ['INTERNAL', 'CUSTOMER']
    constructor (json?: any) {
        if (json) {
            this.additional_properties = json['additional_properties'];
            this.applicable_scope = new BaseApplicableScope(json['applicable_scope']);
            Object.assign(this.applicable_scope, json['applicable_scope']);
            this.category = json['category'];
            this.description = json['description'];
            this.enable = json['enable'];
            this.id = json['id'];
            this.is_base_feature = json['is_base_feature'];
            this.namespace = json['namespace'];
            this.state = json['state'];
            this.type = json['type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.description !== undefined
            && this.enable !== undefined
            && this.id !== undefined;
    }
}

/* ********************************************* BaseSksFeatureDetails ********************************************** */
export class BaseSksFeatureDetails {
    public  feature: BaseSksFeature;
    public  status : BaseFeatureEvaluationStatus;
    constructor (json?: any) {
        if (json) {
            this.feature = new BaseSksFeature(json['feature']);
            Object.assign(this.feature, json['feature']);
            this.status = new BaseFeatureEvaluationStatus(json['status']);
            Object.assign(this.status, json['status']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.feature !== undefined
            && this.status !== undefined;
    }
}

/* ******************************************* BaseSksFeaturePatchRequest ******************************************* */
export class BaseSksFeaturePatchRequest {
    public  applicable_scope: any;
    public  description     : string;
    public  enable          : boolean;
    constructor (json?: any) {
        if (json) {
            this.applicable_scope = json['applicable_scope'];
            this.description = json['description'];
            this.enable = json['enable'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.applicable_scope !== undefined
            && this.description !== undefined
            && this.enable !== undefined;
    }
}

/* *********************************************** BaseStorageVolume ************************************************ */
export class BaseStorageVolume {
    // required: id, size, encrypted, vendor_type
    public  encrypted  : boolean;    // description: Indicates whether the volume is encrypted.
    public  id         : string;    // description: The unique identifier for the storage volume., format: uuid
    public  iops       : number;    // description: The IOPS capability of the volume, if known., format: int64
    public  size       : number;    // description: Size of the volume (GiB)., format: int64
    public  vendor_type: string;    // description: The specific type of storage to be allocated on the cloud
                                    // provider.
    constructor (json?: any) {
        if (json) {
            this.encrypted = json['encrypted'];
            this.id = json['id'];
            this.iops = json['iops'];
            this.size = json['size'];
            this.vendor_type = json['vendor_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.encrypted !== undefined
            && this.id !== undefined
            && this.size !== undefined
            && this.vendor_type !== undefined;
    }
}

/* ********************************************* BaseStorageVolumeSpec ********************************************** */
export class BaseStorageVolumeSpec {
    // required: size, encrypted, vendor_type
    public  encrypted  : boolean;    // description: Indicates whether the volume is encrypted.
    public  iops       : number;    // description: The IOPS capability of the volume, if known., format: int64
    public  size       : number;    // description: Size of the volume, in GiB., format: int64
    public  vendor_type: string;    // description: The specific type of storage to be allocated on the cloud
                                    // provider.
    constructor (json?: any) {
        if (json) {
            this.encrypted = json['encrypted'];
            this.iops = json['iops'];
            this.size = json['size'];
            this.vendor_type = json['vendor_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.encrypted !== undefined
            && this.size !== undefined
            && this.vendor_type !== undefined;
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

export class BaseTask {
    // required: created, id, start_time, status, sub_status, task_type, user_id, user_name, version
    public  created      : string;    // format: date-time
    public  end_time     : string;    // format: date-time
    public  error_message: string;
    public  id           : string;
    public  org_id       : string;
    public  params       : any;
    public  resource_id  : string;    // description: UUID of resources task is acting upon
    public  resource_type: string;    // description: Type of resource being acted upon
    public  retries      : number;    // format: int32
    public  start_time   : string;
    public  status       : string;    // enum: ['STARTED', 'CANCELING', 'FINISHED', 'FAILED', 'CANCELED']
    public  sub_status   : string;
    public  task_type    : string;
    public  task_version : string;
    public  user_id      : string;
    public  user_name    : string;
    public  version      : number;    // format: int32
    constructor (json?: any) {
        if (json) {
            this.created = json['created'];
            this.end_time = json['end_time'];
            this.error_message = json['error_message'];
            this.id = json['id'];
            this.org_id = json['org_id'];
            this.params = json['params'];
            this.resource_id = json['resource_id'];
            this.resource_type = json['resource_type'];
            this.retries = json['retries'];
            this.start_time = json['start_time'];
            this.status = json['status'];
            this.sub_status = json['sub_status'];
            this.task_type = json['task_type'];
            this.task_version = json['task_version'];
            this.user_id = json['user_id'];
            this.user_name = json['user_name'];
            this.version = json['version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.created !== undefined
            && this.id !== undefined
            && this.start_time !== undefined
            && this.status !== undefined
            && this.sub_status !== undefined
            && this.task_type !== undefined
            && this.user_id !== undefined
            && this.user_name !== undefined
            && this.version !== undefined;
    }
}

/* ******************************************* BaseVsanConfigConstraints ******************************************** */
export class BaseVsanConfigConstraints {
    // required: num_hosts, min_capacity, max_capacity, recommended_capacities
    public  max_capacity                : number;    // description: Maximum capacity supported for cluster (GiB)., format: int64
    public  min_capacity                : number;    // description: Minimum capacity supported for cluster (GiB)., format: int64
    public  num_hosts                   : number;    // description: Number of hosts in cluster., format: int64
    public  recommended_capacities      : Array<number>;    // description: Recommended capacity., format: int64
    public  supported_capacity_increment: number;    // description: Increment to be added to min_capacity to result
                                                     // in a supported capacity (GiB)., format: int64
    constructor (json?: any) {
        if (json) {
            this.max_capacity = json['max_capacity'];
            this.min_capacity = json['min_capacity'];
            this.num_hosts = json['num_hosts'];
            this.recommended_capacities = json['recommended_capacities'];
            this.supported_capacity_increment = json['supported_capacity_increment'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.max_capacity !== undefined
            && this.min_capacity !== undefined
            && this.num_hosts !== undefined
            && this.recommended_capacities !== undefined;
    }
}

/* *********************************************** BaseVsanDiskGroup ************************************************ */
export class BaseVsanDiskGroup {
    // required: cache_volume, capacity_volumes
    public  cache_volume    : BaseStorageVolume;
    public  capacity_volumes: Array<BaseStorageVolume>;
    constructor (json?: any) {
        if (json) {
            this.cache_volume = new BaseStorageVolume(json['cache_volume']);
            Object.assign(this.cache_volume, json['cache_volume']);

            if (json['capacity_volumes']) {
                this.capacity_volumes = [];
                for (let item of json['capacity_volumes']) {
                    this.capacity_volumes.push(Object.assign(new BaseStorageVolume(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cache_volume !== undefined
            && this.capacity_volumes !== undefined;
    }
}

/* ********************************************* BaseVsanDiskGroupSpec ********************************************** */
export class BaseVsanDiskGroupSpec {
    // required: cache_volume_spec, capacity_volume_specs
    public  cache_volume_spec    : BaseStorageVolumeSpec;
    public  capacity_volume_specs: Array<BaseStorageVolumeSpec>;
    constructor (json?: any) {
        if (json) {
            this.cache_volume_spec = new BaseStorageVolumeSpec(json['cache_volume_spec']);
            Object.assign(this.cache_volume_spec, json['cache_volume_spec']);

            if (json['capacity_volume_specs']) {
                this.capacity_volume_specs = [];
                for (let item of json['capacity_volume_specs']) {
                    this.capacity_volume_specs.push(Object.assign(new BaseStorageVolumeSpec(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cache_volume_spec !== undefined
            && this.capacity_volume_specs !== undefined;
    }
}

/* ******************************************* BaseVsanHostConfiguration ******************************************** */
export class BaseVsanHostConfiguration {
    // required: diskgroups
    public  diskgroups: Array<BaseVsanDiskGroup>;
    constructor (json?: any) {
        if (json) {

            if (json['diskgroups']) {
                this.diskgroups = [];
                for (let item of json['diskgroups']) {
                    this.diskgroups.push(Object.assign(new BaseVsanDiskGroup(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.diskgroups !== undefined;
    }
}

/* ***************************************** BaseVsanHostConfigurationSpec ****************************************** */
export class BaseVsanHostConfigurationSpec {
    // required: diskgroup_specs
    public  diskgroup_specs: Array<BaseVsanDiskGroupSpec>;
    constructor (json?: any) {
        if (json) {

            if (json['diskgroup_specs']) {
                this.diskgroup_specs = [];
                for (let item of json['diskgroup_specs']) {
                    this.diskgroup_specs.push(Object.assign(new BaseVsanDiskGroupSpec(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.diskgroup_specs !== undefined;
    }
}

/* ************************************ BaseVsanExistingHostsConfigurationSpecs ************************************* */
export class BaseVsanExistingHostsConfigurationSpecs extends BaseVsanHostConfigurationSpec {
    /* No var_list in class VsanExistingHostsConfigurationSpecs */
    constructor (json?: any) {
        super(json);
        if (json) {}
    }

    public hasRequiredProperties(): boolean {
        return true;
    }
}

/* ******************************************* BaseVsanHostConfigurations ******************************************* */
export class BaseVsanHostConfigurations extends BaseVsanHostConfiguration {
    /* No var_list in class VsanHostConfigurations */
    constructor (json?: any) {
        super(json);
        if (json) {}
    }

    public hasRequiredProperties(): boolean {
        return true;
    }
}

/* ********************************************** BaseVsanAddHostsSpec ********************************************** */
export class BaseVsanAddHostsSpec {
    // required: total_size, num_new_hosts, provider
    public  existing_configurations: BaseVsanHostConfigurations;
    public  num_new_hosts          : number;    // description: Number of hosts to add to the cluster., format: int32
    public  provider               : string;    // description: Cloud storage provider ID of the configuration.
    public  total_size             : number;    // description: Total capacity size of the cluster after adding the hosts (GiB).,
                                   // format: int64
    constructor (json?: any) {
        if (json) {
            this.existing_configurations = new BaseVsanHostConfigurations(json['existing_configurations']);
            Object.assign(this.existing_configurations, json['existing_configurations']);
            this.num_new_hosts = json['num_new_hosts'];
            this.provider = json['provider'];
            this.total_size = json['total_size'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.num_new_hosts !== undefined
            && this.provider !== undefined
            && this.total_size !== undefined;
    }
}

/* *************************************** BaseVsanNewHostsConfigurationSpecs *************************************** */
export class BaseVsanNewHostsConfigurationSpecs extends BaseVsanHostConfigurationSpec {
    /* No var_list in class VsanNewHostsConfigurationSpecs */
    constructor (json?: any) {
        super(json);
        if (json) {}
    }

    public hasRequiredProperties(): boolean {
        return true;
    }
}

/* ********************************************* BaseVsanAddHostsResult ********************************************* */
export class BaseVsanAddHostsResult {
    // required: new_hosts_specs
    public  hosts_with_moved_storage: BaseVsanHostConfigurations;
    public  hosts_with_new_storage  : BaseVsanExistingHostsConfigurationSpecs;
    public  new_hosts_specs         : BaseVsanNewHostsConfigurationSpecs;
    constructor (json?: any) {
        if (json) {
            this.hosts_with_moved_storage = new BaseVsanHostConfigurations(json['hosts_with_moved_storage']);
            Object.assign(this.hosts_with_moved_storage, json['hosts_with_moved_storage']);
            this.hosts_with_new_storage = new BaseVsanExistingHostsConfigurationSpecs(json['hosts_with_new_storage']);
            Object.assign(this.hosts_with_new_storage, json['hosts_with_new_storage']);
            this.new_hosts_specs = new BaseVsanNewHostsConfigurationSpecs(json['new_hosts_specs']);
            Object.assign(this.new_hosts_specs, json['new_hosts_specs']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.new_hosts_specs !== undefined;
    }
}

/* ******************************************* BaseVsanRemoveHostsResult ******************************************** */
export class BaseVsanRemoveHostsResult {
    // required: hosts_with_removed_storage
    public  hosts_with_moved_storage  : BaseVsanHostConfigurations;
    public  hosts_with_removed_storage: BaseVsanHostConfigurations;
    constructor (json?: any) {
        if (json) {
            this.hosts_with_moved_storage = new BaseVsanHostConfigurations(json['hosts_with_moved_storage']);
            Object.assign(this.hosts_with_moved_storage, json['hosts_with_moved_storage']);
            this.hosts_with_removed_storage = new BaseVsanHostConfigurations(json['hosts_with_removed_storage']);
            Object.assign(this.hosts_with_removed_storage, json['hosts_with_removed_storage']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.hosts_with_removed_storage !== undefined;
    }
}

/* ******************************************** BaseVsanRemoveHostsSpec ********************************************* */
export class BaseVsanRemoveHostsSpec {
    // required: total_size, existing_configurations, hosts_to_remove, provider
    public  existing_configurations: BaseVsanHostConfigurations;
    public  hosts_to_remove        : Array<string>;    // description: Host IDs, referenced in the existing configurations,
                                               // that are to be removed.
    public  provider               : string;    // description: Cloud storage provider ID of the configuration.
    public  total_size             : number;    // description: Total capacity size of the cluster, in GiB, after removing the
                                   // hosts., format: int64
    constructor (json?: any) {
        if (json) {
            this.existing_configurations = new BaseVsanHostConfigurations(json['existing_configurations']);
            Object.assign(this.existing_configurations, json['existing_configurations']);
            this.hosts_to_remove = json['hosts_to_remove'];
            this.provider = json['provider'];
            this.total_size = json['total_size'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.existing_configurations !== undefined
            && this.hosts_to_remove !== undefined
            && this.provider !== undefined
            && this.total_size !== undefined;
    }
}




/*  ================================================================================================================ */
/*  PATHS                                                                                                            */
/*  ================================================================================================================ */

export const BASE_PATH = '';

// URI: /vmc/api/auth/token
export class API_VmcApiAuthToken<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/auth/token';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAuthToken(responseJSON)); },
         failureHandler,
         'API_VmcApiAuthToken'
      );
   }
}

// URI: /vmc/api/operator/features
export class API_VmcApiOperatorFeatures<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/operator/features';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSksFeature[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSksFeature(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_VmcApiOperatorFeatures'
      );
   }
}

// URI: /vmc/api/operator/features/{featureId}
export class API_VmcApiOperatorFeaturesFeatureid<T> {
   private featureid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, featureid: string) {
      this.featureid = featureid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/operator/features/' + featureid;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSksFeature(responseJSON)); },
         failureHandler,
         'API_VmcApiOperatorFeaturesFeatureid'
      );
   }

   public httpPatch(
      feature: BaseSksFeaturePatchRequest,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(feature);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSksFeature(responseJSON)); },
         failureHandler,
         'API_VmcApiOperatorFeaturesFeatureid'
      );
   }
}

// URI: /vmc/api/operator/orgs
export class API_VmcApiOperatorOrgs<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/operator/orgs';
      this.ref = ref;
   }

   public httpGet($filter: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if ($filter) {
         uri = uri + '&$filter=' + $filter;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseOrganization[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseOrganization(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_VmcApiOperatorOrgs'
      );
   }
}

// URI: /vmc/api/operator/orgs/{org}
export class API_VmcApiOperatorOrgsOrg<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/operator/orgs/' + org;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcApiOperatorOrgsOrg'
      );
   }

   public httpPatch(
      properties: BaseOrgProperties,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(properties);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_VmcApiOperatorOrgsOrg'
      );
   }
}

// URI: /vmc/api/operator/orgs/{org}/features
export class API_VmcApiOperatorOrgsOrgFeatures<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/operator/orgs/' + org + '/features';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSksFeatureDetails(responseJSON)); },
         failureHandler,
         'API_VmcApiOperatorOrgsOrgFeatures'
      );
   }
}

// URI: /vmc/api/operator/orgs/{org}/features/{featureId}
export class API_VmcApiOperatorOrgsOrgFeaturesFeatureid<T> {
   private org: string;
   private featureid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, featureid: string) {
      this.org = org;
      this.featureid = featureid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/operator/orgs/' + org + '/features/' + featureid;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSksFeatureDetails(responseJSON)); },
         failureHandler,
         'API_VmcApiOperatorOrgsOrgFeaturesFeatureid'
      );
   }
}

// URI: /vmc/api/operator/tasks
export class API_VmcApiOperatorTasks<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/operator/tasks';
      this.ref = ref;
   }

   public httpGet($filter: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if ($filter) {
         uri = uri + '&$filter=' + $filter;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseTask[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseTask(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_VmcApiOperatorTasks'
      );
   }
}

// URI: /vmc/api/operator/tasks/{taskId}
export class API_VmcApiOperatorTasksTaskid<T> {
   private taskid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, taskid: string) {
      this.taskid = taskid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/operator/tasks/' + taskid;
      this.ref = ref;
   }

   public httpPost(action: string, sub_status: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (action) {
         uri = uri + '&action=' + action;
      }
      if (sub_status) {
         uri = uri + '&sub_status=' + sub_status;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_VmcApiOperatorTasksTaskid'
      );
   }
}

// URI: /vmc/api/operator/tasks/{taskId}/versions
export class API_VmcApiOperatorTasksTaskidVersions<T> {
   private taskid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, taskid: string) {
      this.taskid = taskid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/operator/tasks/' + taskid + '/versions';
      this.ref = ref;
   }

   public httpGet(max: number, start: number, end: number, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (max) {
         uri = uri + '&max=' + max;
      }
      if (start) {
         uri = uri + '&start=' + start;
      }
      if (end) {
         uri = uri + '&end=' + end;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseTask[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseTask(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_VmcApiOperatorTasksTaskidVersions'
      );
   }
}

// URI: /vmc/api/orgs
export class API_VmcApiOrgs<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/orgs';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseOrganization[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseOrganization(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_VmcApiOrgs'
      );
   }
}

// URI: /vmc/api/orgs/{org}
export class API_VmcApiOrgsOrg<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/orgs/' + org;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseOrganization(responseJSON)); },
         failureHandler,
         'API_VmcApiOrgsOrg'
      );
   }
}

// URI: /vmc/api/orgs/{org}/features
export class API_VmcApiOrgsOrgFeatures<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/orgs/' + org + '/features';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseFeatureEvaluationStatus(responseJSON)); },
         failureHandler,
         'API_VmcApiOrgsOrgFeatures'
      );
   }
}

// URI: /vmc/api/orgs/{org}/features/{featureId}
export class API_VmcApiOrgsOrgFeaturesFeatureid<T> {
   private org: string;
   private featureid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, featureid: string) {
      this.org = org;
      this.featureid = featureid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/orgs/' + org + '/features/' + featureid;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseFeatureEvaluationStatus(responseJSON)); },
         failureHandler,
         'API_VmcApiOrgsOrgFeaturesFeatureid'
      );
   }
}

// URI: /vmc/api/orgs/{org}/tasks
export class API_VmcApiOrgsOrgTasks<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/orgs/' + org + '/tasks';
      this.ref = ref;
   }

   public httpGet($filter: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if ($filter) {
         uri = uri + '&$filter=' + $filter;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseTask[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseTask(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_VmcApiOrgsOrgTasks'
      );
   }
}

// URI: /vmc/api/orgs/{org}/tasks/{taskId}
export class API_VmcApiOrgsOrgTasksTaskid<T> {
   private org: string;
   private taskid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, taskid: string) {
      this.org = org;
      this.taskid = taskid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/api/orgs/' + org + '/tasks/' + taskid;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_VmcApiOrgsOrgTasksTaskid'
      );
   }

   public httpPost(action: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_VmcApiOrgsOrgTasksTaskid'
      );
   }
}

// URI: /vmc/vsan/api/orgs/{org}/config/constraints
export class API_VmcVsanApiOrgsOrgConfigConstraints<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/vsan/api/orgs/' + org + '/config/constraints';
      this.ref = ref;
   }

   public httpGet(provider: string, numHosts: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (provider) {
         uri = uri + '&provider=' + provider;
      }
      if (numHosts) {
         uri = uri + '&numHosts=' + numHosts;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseVsanConfigConstraints(responseJSON)); },
         failureHandler,
         'API_VmcVsanApiOrgsOrgConfigConstraints'
      );
   }
}

// URI: /vmc/vsan/api/orgs/{org}/designer/addHosts
export class API_VmcVsanApiOrgsOrgDesignerAddhosts<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/vsan/api/orgs/' + org + '/designer/addHosts';
      this.ref = ref;
   }

   public httpPost(addHostsSpec: BaseVsanAddHostsSpec, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(addHostsSpec);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseVsanAddHostsResult(responseJSON)); },
         failureHandler,
         'API_VmcVsanApiOrgsOrgDesignerAddhosts'
      );
   }
}

// URI: /vmc/vsan/api/orgs/{org}/designer/removeHosts
export class API_VmcVsanApiOrgsOrgDesignerRemovehosts<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/vsan/api/orgs/' + org + '/designer/removeHosts';
      this.ref = ref;
   }

   public httpPost(removeHostsSpec: BaseVsanRemoveHostsSpec, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(removeHostsSpec);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseVsanRemoveHostsResult(responseJSON)); },
         failureHandler,
         'API_VmcVsanApiOrgsOrgDesignerRemovehosts'
      );
   }
}

// URI: /vmc/vsan/api/orgs/{org}/sddcs/{sddc}/clusters/{cluster}/config/constraints/hostAddition
export class API_VmcVsanApiOrgsOrgSddcsSddcClustersClusterConfigConstraintsHostaddition<T> {
   private org: string;
   private sddc: string;
   private cluster: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, cluster: string) {
      this.org = org;
      this.sddc = sddc;
      this.cluster = cluster;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/vsan/api/orgs/' + org + '/sddcs/' + sddc +
      '/clusters/' + cluster + '/config/constraints/hostAddition';
      this.ref = ref;
   }

   public httpGet(provider: string, numHosts: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (provider) {
         uri = uri + '&provider=' + provider;
      }
      if (numHosts) {
         uri = uri + '&numHosts=' + numHosts;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseVsanConfigConstraints(responseJSON)); },
         failureHandler,
         'API_VmcVsanApiOrgsOrgSddcsSddcClustersClusterConfigConstraintsHostaddition'
      );
   }
}

// URI: /vmc/vsan/api/orgs/{org}/sddcs/{sddc}/clusters/{cluster}/config/constraints/hostRemoval
export class API_VmcVsanApiOrgsOrgSddcsSddcClustersClusterConfigConstraintsHostremoval<T> {
   private org: string;
   private sddc: string;
   private cluster: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, cluster: string) {
      this.org = org;
      this.sddc = sddc;
      this.cluster = cluster;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/vmc/vsan/api/orgs/' + org + '/sddcs/' + sddc +
      '/clusters/' + cluster + '/config/constraints/hostRemoval';
      this.ref = ref;
   }

   public httpGet(provider: string, numHosts: number, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (provider) {
         uri = uri + '&provider=' + provider;
      }
      if (numHosts) {
         uri = uri + '&numHosts=' + numHosts;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseVsanConfigConstraints(responseJSON)); },
         failureHandler,
         'API_VmcVsanApiOrgsOrgSddcsSddcClustersClusterConfigConstraintsHostremoval'
      );
   }
}



/* >>> END OF FILE <<< */

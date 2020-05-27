/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * AUTO-GENERATED 2018-07-02 15:34:07 - DO NOT EDIT DIRECTLY
 *
 */

// tslint:disable




import {
    BaseAbstractEntity,
    BaseApplicableScope,
    BaseApplicableScopePatchRequest,
    BaseErrorResponse,
    BaseFeatureEvaluationStatus,
    BaseInternalErrorCode,
    BaseInternalErrorDetails,
    BaseSddc,
    BaseServiceError,
    BaseSksFeature,
    BaseSksFeatureDetails,
    BaseSksFeaturePatchRequest,
    BaseTask,
    BaseTaskErrorDetails,
    BaseTaskProgressPhase,
    BaseTaskSubStatusTransition
} from './vmc-api';


/* ************************************************** BaseAwsEvent ************************************************** */
export class BaseAwsEvent {
    // required: instance_id, account_id, start_time, type
    public  account_id : string;    // description: Customer account id the instance belongs to.
    public  description: string;    // description: Description of the AWS scheduled event.
    public  instance_id: string;    // description: AWS instance id of the host.
    public  start_time : string;    // description: The date & time when the AWS event for the host is scheduled.,
                                   // format: date
    public  type       : string;    // description: Type of the scheduled event (retirement, reboot, ...)
    constructor (json?: any) {
        if (json) {
            this.account_id = json['account_id'];
            this.description = json['description'];
            this.instance_id = json['instance_id'];
            this.start_time = json['start_time'];
            this.type = json['type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.account_id !== undefined
            && this.instance_id !== undefined
            && this.start_time !== undefined
            && this.type !== undefined;
    }
}

/* ************************************************* BaseEdrsPolicy ************************************************* */
export const EDRSPOLICY_POLICY_TYPE_COST = 'cost';
export const EDRSPOLICY_POLICY_TYPE_PERFORMANCE = 'performance';

export enum EDRSPOLICY_policytype {
   Cost = 'cost',
   Performance = 'performance'
}

export class BaseEdrsPolicy {
    // required: enable_edrs
    public  enable_edrs: boolean;    // description: True if EDRS is enabled
    public  max_hosts  : number;    // description: The maximum number of hosts that the cluster can scale out to.
    public  min_hosts  : number;    // description: The minimum number of hosts that the cluster can scale in to.
    public  policy_type: string;    // description: The EDRS policy type. This can either be 'cost' or
                                    // 'performance'., enum: ['cost', 'performance']
    constructor (json?: any) {
        if (json) {
            this.enable_edrs = json['enable_edrs'];
            this.max_hosts = json['max_hosts'];
            this.min_hosts = json['min_hosts'];
            this.policy_type = json['policy_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.enable_edrs !== undefined;
    }
}

/* ********************************************** BaseEdrsClusterInfo *********************************************** */
export const EDRSCLUSTERINFO_STATUS_KEY_SKYSCRAPER_AUTOSCALER_ELASTIC_DRS_MIN_HOSTS = 'skyscraper.autoscaler.elastic.drs.min.hosts';
export const EDRSCLUSTERINFO_STATUS_KEY_SKYSCRAPER_AUTOSCALER_ELASTIC_DRS_MAX_HOSTS = 'skyscraper.autoscaler.elastic.drs.max.hosts';
export const EDRSCLUSTERINFO_STATUS_KEY_SKYSCRAPER_AUTOSCALER_ELASTIC_DRS_FAILED_HOSTS = 'skyscraper.autoscaler.elastic.drs.failed.hosts';

export enum EDRSCLUSTERINFO_statuskey {
   Skyscraperautoscalerelasticdrsfailedhosts = 'skyscraper.autoscaler.elastic.drs.failed.hosts',
   Skyscraperautoscalerelasticdrsmaxhosts = 'skyscraper.autoscaler.elastic.drs.max.hosts',
   Skyscraperautoscalerelasticdrsminhosts = 'skyscraper.autoscaler.elastic.drs.min.hosts'
}

export class BaseEdrsClusterInfo {
    // required: cluster_id, edrs_policy
    public  cluster_id    : string;    // description: The cluster identifier
    public  edrs_policy   : BaseEdrsPolicy;
    public  status_key    : string;    // description: Key identifying the status type, enum:
                                   // ['skyscraper.autoscaler.elastic.drs.min.hosts',
                                   // 'skyscraper.autoscaler.elastic.drs.max.hosts',
                                   // 'skyscraper.autoscaler.elastic.drs.failed.hosts']
    public  status_message: string;    // description: The status description
    constructor (json?: any) {
        if (json) {
            this.cluster_id = json['cluster_id'];
            this.edrs_policy = new BaseEdrsPolicy(json['edrs_policy']);
            Object.assign(this.edrs_policy, json['edrs_policy']);
            this.status_key = json['status_key'];
            this.status_message = json['status_message'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cluster_id !== undefined
            && this.edrs_policy !== undefined;
    }
}

/* ***************************************** BaseEdrsPolicyOptionsOverrides ***************************************** */
export class BaseEdrsPolicyOptionsOverrides {
    public  cpu_ewma_max    : number;    // description: The weight associated with the average cpu usage for scale out.
    public  cpu_ewma_min    : number;    // description: The weight associated with the average cpu usage for scale in.
    public  cpu_max         : number;    // description: The upper bound for CPU usage before a scale out operation.
    public  cpu_min         : number;    // description: The lower bound for CPU usage before a scale in operation.
    public  memory_ewma_max : number;    // description: The weight associated with the average memory usage for
                                        // scale out.
    public  memory_ewma_min : number;    // description: The weight associated with the average memory usage for
                                        // scale in.
    public  memory_max      : number;    // description: The upper bound for memory usage before a scale out operation.
    public  memory_min      : number;    // description: The lower bound for memory usage before a scale in operation.
    public  scale_in        : boolean;    // description: True means that EDRS is allowed to scale in if the conditions are
                                  // met.
    public  scale_out       : boolean;    // description: True means that EDRS is allowed to scale out if the conditions
                                   // are met.
    public  storage_ewma_max: number;    // description: The weight associated with the average disk usage for scale
                                         // out.
    public  storage_ewma_min: number;    // description: The weight associated with the average disk usage for scale
                                         // in.
    public  storage_max     : number;    // description: The upper bound for storage space usage before a scale out
                                    // operation.
    public  storage_min     : number;    // description: The lower bound for storage space usage before a scale in
                                    // operation.
    constructor (json?: any) {
        if (json) {
            this.cpu_ewma_max = json['cpu_ewma_max'];
            this.cpu_ewma_min = json['cpu_ewma_min'];
            this.cpu_max = json['cpu_max'];
            this.cpu_min = json['cpu_min'];
            this.memory_ewma_max = json['memory_ewma_max'];
            this.memory_ewma_min = json['memory_ewma_min'];
            this.memory_max = json['memory_max'];
            this.memory_min = json['memory_min'];
            this.scale_in = json['scale_in'];
            this.scale_out = json['scale_out'];
            this.storage_ewma_max = json['storage_ewma_max'];
            this.storage_ewma_min = json['storage_ewma_min'];
            this.storage_max = json['storage_max'];
            this.storage_min = json['storage_min'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cpu_ewma_max !== undefined
            && this.cpu_ewma_min !== undefined
            && this.cpu_max !== undefined
            && this.cpu_min !== undefined
            && this.memory_ewma_max !== undefined
            && this.memory_ewma_min !== undefined
            && this.memory_max !== undefined
            && this.memory_min !== undefined
            && this.scale_in !== undefined
            && this.scale_out !== undefined
            && this.storage_ewma_max !== undefined
            && this.storage_ewma_min !== undefined
            && this.storage_max !== undefined
            && this.storage_min !== undefined;
    }
}

/* *************************************************** BaseEvent **************************************************** */
export class BaseEvent {
    // required: org_id, sddc_id, cluster_id, esx_id, property, property_value
    public  cluster_id    : string;    // description: vSphere cluster identifier
    public  esx_id        : string;    // description: ESX host identifier
    public  org_id        : string;    // description: VMC identifier for the user org
    public  property      : string;    // description: Component reporting faiure eg. VC, FDM, AWS etc.
    public  property_value: any;    // description: The failure eg. hostDown, networkParitioned, instance-retirement
                                    // etc.
    public  sddc_id       : string;    // description: VMC sddc identifier
    constructor (json?: any) {
        if (json) {
            this.cluster_id = json['cluster_id'];
            this.esx_id = json['esx_id'];
            this.org_id = json['org_id'];
            this.property = json['property'];
            this.property_value = json['property_value'];
            this.sddc_id = json['sddc_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cluster_id !== undefined
            && this.esx_id !== undefined
            && this.org_id !== undefined
            && this.property !== undefined
            && this.property_value !== undefined
            && this.sddc_id !== undefined;
    }
}

/* *************************************************** BasePolicy *************************************************** */
export class BasePolicy {
    // required: enable_ha
    public  enable_ha: boolean;    // description: True if HA is enabled
    constructor (json?: any) {
        if (json) {
            this.enable_ha = json['enable_ha'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.enable_ha !== undefined;
    }
}




/*  ================================================================================================================ */
/*  PATHS                                                                                                            */
/*  ================================================================================================================ */

export const BASE_PATH = '/vmc/autoscaler/api';

// URI: /operator/awsevent
export class API_OperatorAwsevent<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/awsevent';
      this.ref = ref;
   }

   public httpPost(awsEvent: BaseAwsEvent, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(awsEvent);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorAwsevent'
      );
   }
}

// URI: /operator/event
export class API_OperatorEvent<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/event';
      this.ref = ref;
   }

   public httpPost(Event: BaseEvent, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(Event);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorEvent'
      );
   }
}

// URI: /operator/features
export class API_OperatorFeatures<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/features';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSksFeature(responseJSON)); },
         failureHandler,
         'API_OperatorFeatures'
      );
   }
}

// URI: /operator/features/{featureId}
export class API_OperatorFeaturesFeatureid<T> {
   private featureid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, featureid: string) {
      this.featureid = featureid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/features/' + featureid;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSksFeature(responseJSON)); },
         failureHandler,
         'API_OperatorFeaturesFeatureid'
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
         'API_OperatorFeaturesFeatureid'
      );
   }
}

// URI: /operator/sddcs/{sddc}
export class API_AutoOperatorSddcsSddc<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddc(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddc'
      );
   }
}

// URI: /operator/sddcs/{sddc}/clusters/{cluster}/edrs-policy
export class API_OperatorSddcsSddcClustersClusterEdrspolicy<T> {
   private sddc: string;
   private cluster: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, cluster: string) {
      this.sddc = sddc;
      this.cluster = cluster;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/clusters/' + cluster + '/edrs-policy';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseEdrsPolicyOptionsOverrides(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcClustersClusterEdrspolicy'
      );
   }

   public httpPost(
      edrsPolicyOptionsOverrides: BaseEdrsPolicyOptionsOverrides,
      successHandler: Function,
      failureHandler: Function
   ) {
      const uri = this.uri;
      const _body = JSON.stringify(edrsPolicyOptionsOverrides);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcClustersClusterEdrspolicy'
      );
   }
}

// URI: /operator/sddcs/{sddc}/hosts/{host}
export class API_OperatorSddcsSddcHostsHost<T> {
   private sddc: string;
   private host: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, host: string) {
      this.sddc = sddc;
      this.host = host;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/hosts/' + host;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorSddcsSddcHostsHost'
      );
   }
}

// URI: /operator/sddcs/{sddc}/policy
export class API_OperatorSddcsSddcPolicy<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/policy';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BasePolicy(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcPolicy'
      );
   }

   public httpPut(policy: BasePolicy, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(policy);
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BasePolicy(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcPolicy'
      );
   }
}

// URI: /orgs/{org}/features
export class API_OrgsOrgFeatures<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/features';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseFeatureEvaluationStatus(responseJSON)); },
         failureHandler,
         'API_OrgsOrgFeatures'
      );
   }
}

// URI: /orgs/{org}/features/{featureId}
export class API_OrgsOrgFeaturesFeatureid<T> {
   private org: string;
   private featureid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, featureid: string) {
      this.org = org;
      this.featureid = featureid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/features/' + featureid;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseFeatureEvaluationStatus(responseJSON)); },
         failureHandler,
         'API_OrgsOrgFeaturesFeatureid'
      );
   }

   public httpPatch(action: string, successHandler: Function, failureHandler: Function, altBody?: any) {
      let uri = '';
      const _body = altBody ? altBody : '';
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseFeatureEvaluationStatus(responseJSON)); },
         failureHandler,
         'API_OrgsOrgFeaturesFeatureid'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/clusters/{cluster}/edrs-policy
export class API_OrgsOrgSddcsSddcClustersClusterEdrspolicy<T> {
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
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/clusters/' + cluster + '/edrs-policy';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseEdrsPolicy(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcClustersClusterEdrspolicy'
      );
   }

   public httpPost(edrsPolicy: BaseEdrsPolicy, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(edrsPolicy);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcClustersClusterEdrspolicy'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/edrs-policy
export class API_OrgsOrgSddcsSddcEdrspolicy<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/edrs-policy';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseEdrsClusterInfo[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseEdrsClusterInfo(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcEdrspolicy'
      );
   }
}



/* >>> END OF FILE <<< */

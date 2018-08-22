/*
 * Copyright © 2018 VMware, Inc. All rights reserved.
 * AUTO-GENERATED 2018-07-10 10:01:45 - DO NOT EDIT DIRECTLY
 *
 */

// tslint:disable





/* *********************************************** BaseAbstractEntity *********************************************** */
export class BaseAbstractEntity {
    // required: created, id, user_id, user_name, updated, updated_by_user_id, version
    public  created             : string;    // format: date-time
    public  id                  : string;    // description: Unique ID for this entity
    public  updated             : string;    // format: date-time
    public  updated_by_user_id  : string;    // description: User id that last updated this record
    public  updated_by_user_name: string;    // description: User name that last updated this record
    public  user_id             : string;    // description: User id that last updated this record
    public  user_name           : string;    // description: User name that last updated this record
    public  version             : number;    // description: Version of this entity, format: int32
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
            && this.user_id !== undefined
            && this.user_name !== undefined
            && this.version !== undefined;
    }
}

/* ********************************************* BaseAccountLinkConfig ********************************************** */
export class BaseAccountLinkConfig {
    public  delay_account_link: boolean;    // default: False, description: Boolean flag identifying whether account
                                            // linking should be delayed or not for the SDDC.
    constructor (json?: any) {
        if (json) {
            this.delay_account_link = json['delay_account_link'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.delay_account_link !== undefined;
    }
}

/* ******************************************* BaseAccountLinkSddcConfig ******************************************** */
export class BaseAccountLinkSddcConfig {
    public  connected_account_id: string;    // description: The ID of the customer connected account to work with.
    public  customer_subnet_ids : Array<string>;    // description: The ID of the subnet to use.
    constructor (json?: any) {
        if (json) {
            this.connected_account_id = json['connected_account_id'];
            this.customer_subnet_ids = json['customer_subnet_ids'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.connected_account_id !== undefined
            && this.customer_subnet_ids !== undefined;
    }
}

/* *************************************************** BaseAgent **************************************************** */
export class BaseAgent {
    // required: provider
    public  addresses                : Array<string>;    // description: Public IP and DNS names
    public  agent_url                : string;
    public  custom_properties        : any;
    public  healthy                  : boolean;
    public  id                       : string;
    public  internal_ip              : string;
    public  last_health_status_change: number;
    public  network_cidr             : string;
    public  network_gateway          : string;
    public  network_netmask          : string;
    public  provider                 : string;
    public  reserved_ip              : string;
    constructor (json?: any) {
        if (json) {
            this.addresses = json['addresses'];
            this.agent_url = json['agent_url'];
            this.custom_properties = json['custom_properties'];
            this.healthy = json['healthy'];
            this.id = json['id'];
            this.internal_ip = json['internal_ip'];
            this.last_health_status_change = json['last_health_status_change'];
            this.network_cidr = json['network_cidr'];
            this.network_gateway = json['network_gateway'];
            this.network_netmask = json['network_netmask'];
            this.provider = json['provider'];
            this.reserved_ip = json['reserved_ip'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.provider !== undefined;
    }
}

/* *********************************************** BaseAgentAuthInfo ************************************************ */
export class BaseAgentAuthInfo {
    public  agent_auth_token: string;
    public  agent_url       : string;
    constructor (json?: any) {
        if (json) {
            this.agent_auth_token = json['agent_auth_token'];
            this.agent_url = json['agent_url'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.agent_auth_token !== undefined
            && this.agent_url !== undefined;
    }
}

/* ******************************************* BaseAgentSshAccessRequest ******************************************** */
export class BaseAgentSshAccessRequest {
    // required: reason
    public  reason: string;    // description: The reason to request PoP SSH access.
    constructor (json?: any) {
        if (json) {
            this.reason = json['reason'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.reason !== undefined;
    }
}

/* ******************************************* BaseAgentSshAccessResponse ******************************************* */
export class BaseAgentSshAccessResponse {
    // required: user_name, pop_host, start_time, end_time, ssh_private_key
    public  end_time       : string;    // description: End time for the delegated access, format: date-time
    public  pop_host       : string;    // description: PoP host FQDN or IP
    public  ssh_private_key: string;    // description: The private key used for ssh to PoP
    public  start_time     : string;    // description: Start time for the delegated access, format: date-time
    public  user_name      : string;    // description: The user name to ssh to PoP
    constructor (json?: any) {
        if (json) {
            this.end_time = json['end_time'];
            this.pop_host = json['pop_host'];
            this.ssh_private_key = json['ssh_private_key'];
            this.start_time = json['start_time'];
            this.user_name = json['user_name'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.end_time !== undefined
            && this.pop_host !== undefined
            && this.ssh_private_key !== undefined
            && this.start_time !== undefined
            && this.user_name !== undefined;
    }
}

/* ************************************************** BaseAmiInfo *************************************************** */
export class BaseAmiInfo {
    public  id    : string;    // description: the ami id for the esx
    public  name  : string;    // description: the name of the esx ami
    public  region: string;    // description: the region of the esx ami
    constructor (json?: any) {
        if (json) {
            this.id = json['id'];
            this.name = json['name'];
            this.region = json['region'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.id !== undefined
            && this.name !== undefined
            && this.region !== undefined;
    }
}

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

/* ********************************************** BaseAuthIdentityHash ********************************************** */
export class BaseAuthIdentityHash {
    public  intercom: string;
    constructor (json?: any) {
        if (json) {
            this.intercom = json['intercom'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.intercom !== undefined;
    }
}

/* ************************************************** BaseAuthTime ************************************************** */
export class BaseAuthTime {
    public  time: string;
    constructor (json?: any) {
        if (json) {
            this.time = json['time'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.time !== undefined;
    }
}

/* ************************************************* BaseAuthToken ************************************************** */
export class BaseAuthToken {
    public  auth_token: string;    // description: Current Auth Token
    public  id_token  : string;    // description: Openid Token
    constructor (json?: any) {
        if (json) {
            this.auth_token = json['auth_token'];
            this.id_token = json['id_token'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.auth_token !== undefined
            && this.id_token !== undefined;
    }
}

/* ********************************************** BaseAwsAccountConfig ********************************************** */
export class BaseAwsAccountConfig {
    // required: aws_account_number, assume_role_arn
    public  assume_role_arn   : string;
    public  aws_account_number: string;
    public  org_id            : string;
    constructor (json?: any) {
        if (json) {
            this.assume_role_arn = json['assume_role_arn'];
            this.aws_account_number = json['aws_account_number'];
            this.org_id = json['org_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.assume_role_arn !== undefined
            && this.aws_account_number !== undefined;
    }
}

/* ******************************************** BaseAwsAccountLinkStatus ******************************************** */
export class BaseAwsAccountLinkStatus {
    /* No var_list in class AwsAccountLinkStatus */
    constructor (json?: any) {
        if (json) {}
    }

    public hasRequiredProperties(): boolean {
        return true;
    }
}

/* ******************************************** BaseAwsAccountProperties ******************************************** */
export class BaseAwsAccountProperties {
    public  key  : string;
    public  value: string;
    constructor (json?: any) {
        if (json) {
            this.key = json['key'];
            this.value = json['value'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.key !== undefined
            && this.value !== undefined;
    }
}

/* ****************************************** BaseAwsAccountCreationConfig ****************************************** */
export class BaseAwsAccountCreationConfig {
    // required: aws_account_name
    public  account_properties: any;    // description: A Map of properties.
    public  aws_account_name  : string;
    public  aws_email_alias   : string;
    public  existing_account  : boolean;
    public  poolTag           : string;
    constructor (json?: any) {
        if (json) {
            this.account_properties = json['account_properties'];
            this.aws_account_name = json['aws_account_name'];
            this.aws_email_alias = json['aws_email_alias'];
            this.existing_account = json['existing_account'];
            this.poolTag = json['poolTag'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.aws_account_name !== undefined;
    }
}

/* *********************************************** BaseAwsCredentials *********************************************** */
export class BaseAwsCredentials {
    public  aws_access_key: string;
    public  aws_secret_key: string;
    public  session_token : string;
    constructor (json?: any) {
        if (json) {
            this.aws_access_key = json['aws_access_key'];
            this.aws_secret_key = json['aws_secret_key'];
            this.session_token = json['session_token'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.aws_access_key !== undefined
            && this.aws_secret_key !== undefined
            && this.session_token !== undefined;
    }
}

/* **************************************** BaseAwsAccountResponseStructure ***************************************** */
export class BaseAwsAccountResponseStructure {
    // required: id, aws_account_number, org_id
    public  aws_account_number: string;
    public  aws_credentials   : BaseAwsCredentials;    // x-vmw-vmc-exclude: client
    public  id                : string;
    public  org_id            : string;
    constructor (json?: any) {
        if (json) {
            this.aws_account_number = json['aws_account_number'];
            this.aws_credentials = new BaseAwsCredentials(json['aws_credentials']);
            Object.assign(this.aws_credentials, json['aws_credentials']);
            this.id = json['id'];
            this.org_id = json['org_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.aws_account_number !== undefined
            && this.id !== undefined
            && this.org_id !== undefined;
    }
}

/* **************************************** BaseAwsCustomerConnectedAccount ***************************************** */
export class BaseAwsCustomerConnectedAccount extends BaseAbstractEntity {
    // required: account_number, policy_payer_arn, policy_service_arn, policy_external_id, cf_stack_name,
    // region_to_az_to_shadow_mapping, org_id
    public  account_number                : string;
    public  cf_stack_name                 : string;
    public  org_id                        : string;
    public  policy_external_id            : string;
    public  policy_payer_arn              : string;
    public  policy_service_arn            : string;
    public  region_to_az_to_shadow_mapping: any;    // description: Provides a map of regions to availability zones
                                                    // from the shadow account's perspective
    constructor (json?: any) {
        super(json);
        if (json) {
            this.account_number = json['account_number'];
            this.cf_stack_name = json['cf_stack_name'];
            this.org_id = json['org_id'];
            this.policy_external_id = json['policy_external_id'];
            this.policy_payer_arn = json['policy_payer_arn'];
            this.policy_service_arn = json['policy_service_arn'];
            this.region_to_az_to_shadow_mapping = json['region_to_az_to_shadow_mapping'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.account_number !== undefined
            && this.cf_stack_name !== undefined
            && this.org_id !== undefined
            && this.policy_external_id !== undefined
            && this.policy_payer_arn !== undefined
            && this.policy_service_arn !== undefined
            && this.region_to_az_to_shadow_mapping !== undefined;
    }
}

/* ****************************************** BaseAwsCustomerLinkedAccount ****************************************** */
export class BaseAwsCustomerLinkedAccount {
    public  account_number          : string;
    public  cf_stack_name           : string;
    public  cidr_block              : string;
    public  cidr_block_vpc          : string;
    public  customer_eni_infos      : Array<string>;
    public  default_route_table     : string;
    public  eni_group               : string;
    public  enis                    : Array<string>;
    public  policy_arn              : string;
    public  policy_service_arn      : string;
    public  subnet_availability_zone: string;
    public  subnet_id               : string;
    public  vpc_id                  : string;
    constructor (json?: any) {
        if (json) {
            this.account_number = json['account_number'];
            this.cf_stack_name = json['cf_stack_name'];
            this.cidr_block = json['cidr_block'];
            this.cidr_block_vpc = json['cidr_block_vpc'];
            this.customer_eni_infos = json['customer_eni_infos'];
            this.default_route_table = json['default_route_table'];
            this.eni_group = json['eni_group'];
            this.enis = json['enis'];
            this.policy_arn = json['policy_arn'];
            this.policy_service_arn = json['policy_service_arn'];
            this.subnet_availability_zone = json['subnet_availability_zone'];
            this.subnet_id = json['subnet_id'];
            this.vpc_id = json['vpc_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.account_number !== undefined
            && this.cf_stack_name !== undefined
            && this.cidr_block !== undefined
            && this.cidr_block_vpc !== undefined
            && this.customer_eni_infos !== undefined
            && this.default_route_table !== undefined
            && this.eni_group !== undefined
            && this.enis !== undefined
            && this.policy_arn !== undefined
            && this.policy_service_arn !== undefined
            && this.subnet_availability_zone !== undefined
            && this.subnet_id !== undefined
            && this.vpc_id !== undefined;
    }
}

/* ************************************************* BaseAwsKeyPair ************************************************* */
export class BaseAwsKeyPair {
    public  key_fingerprint: string;
    public  key_material   : string;
    public  key_name       : string;
    constructor (json?: any) {
        if (json) {
            this.key_fingerprint = json['key_fingerprint'];
            this.key_material = json['key_material'];
            this.key_name = json['key_name'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.key_fingerprint !== undefined
            && this.key_material !== undefined
            && this.key_name !== undefined;
    }
}

/* ************************************************** BaseAwsAgent ************************************************** */
export class BaseAwsAgent extends BaseAgent {
    public  instance_id: string;
    public  key_pair   : BaseAwsKeyPair;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.instance_id = json['instance_id'];
            this.key_pair = new BaseAwsKeyPair(json['key_pair']);
            Object.assign(this.key_pair, json['key_pair']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.instance_id !== undefined
            && this.key_pair !== undefined;
    }
}

/* ********************************************* BaseAwsSddcConnection ********************************************** */
export class BaseAwsSddcConnection extends BaseAbstractEntity {
    // required: sddc_id, org_id, connected_account_id, vpc_id, subnet_id, subnet_availability_zone, cidr_block_vpc,
    // cidr_block_subnet, default_route_table, customer_eni_infos
    public  cidr_block_subnet       : string;
    public  cidr_block_vpc          : string;
    public  connected_account_id    : string;
    public  customer_eni_infos      : Array<string>;
    public  default_route_table     : string;
    public  eni_group               : string;
    public  is_cgw_present          : boolean;
    public  org_id                  : string;
    public  sddc_id                 : string;
    public  subnet_availability_zone: string;
    public  subnet_id               : string;
    public  vpc_id                  : string;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.cidr_block_subnet = json['cidr_block_subnet'];
            this.cidr_block_vpc = json['cidr_block_vpc'];
            this.connected_account_id = json['connected_account_id'];
            this.customer_eni_infos = json['customer_eni_infos'];
            this.default_route_table = json['default_route_table'];
            this.eni_group = json['eni_group'];
            this.is_cgw_present = json['is_cgw_present'];
            this.org_id = json['org_id'];
            this.sddc_id = json['sddc_id'];
            this.subnet_availability_zone = json['subnet_availability_zone'];
            this.subnet_id = json['subnet_id'];
            this.vpc_id = json['vpc_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cidr_block_subnet !== undefined
            && this.cidr_block_vpc !== undefined
            && this.connected_account_id !== undefined
            && this.customer_eni_infos !== undefined
            && this.default_route_table !== undefined
            && this.org_id !== undefined
            && this.sddc_id !== undefined
            && this.subnet_availability_zone !== undefined
            && this.subnet_id !== undefined
            && this.vpc_id !== undefined;
    }
}

/* ************************************************* BaseAwsSubnet ************************************************** */
export class BaseAwsSubnet {
    public  availability_zone   : string;    // description: The availability zone this subnet is in, which should be
                                          // the region name plus one extra letter (ex. us-west-2a).
    public  connected_account_id: string;    // description: The connected account ID this subnet is accessible
                                             // through. This is an internal ID formatted as a UUID specific to
                                             // Skyscraper.
    public  is_compatible       : boolean;    // description: Flag indicating whether this subnet is compatible. If true,
                                       // this is a valid choice for the customer to deploy a SDDC in.
    public  name                : string;    // description: Optional field (may not be provided by AWS), indicates the found name
                             // tag for the subnet.
    public  region_name         : string;    // description: The region this subnet is in, usually in the form of country
                                    // code, general location, and a number (ex. us-west-2).
    public  subnet_cidr_block   : string;    // description: The CIDR block of the subnet, in the form of '#.#.#.#/#'.
    public  subnet_id           : string;    // description: The subnet ID in AWS, provided in the form 'subnet-######'.
    public  vpc_cidr_block      : string;    // description: The CIDR block of the VPC, in the form of '#.#.#.#/#'.
    public  vpc_id              : string;    // description: The VPC ID the subnet resides in within AWS. Tends to be
                               // 'vpc-#######'.
    constructor (json?: any) {
        if (json) {
            this.availability_zone = json['availability_zone'];
            this.connected_account_id = json['connected_account_id'];
            this.is_compatible = json['is_compatible'];
            this.name = json['name'];
            this.region_name = json['region_name'];
            this.subnet_cidr_block = json['subnet_cidr_block'];
            this.subnet_id = json['subnet_id'];
            this.vpc_cidr_block = json['vpc_cidr_block'];
            this.vpc_id = json['vpc_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.availability_zone !== undefined
            && this.connected_account_id !== undefined
            && this.is_compatible !== undefined
            && this.name !== undefined
            && this.region_name !== undefined
            && this.subnet_cidr_block !== undefined
            && this.subnet_id !== undefined
            && this.vpc_cidr_block !== undefined
            && this.vpc_id !== undefined;
    }
}

/* *********************************************** BaseBillableUsage ************************************************ */
export class BaseBillableUsage {
    public  context    : Array<{key: string,value: string}>;
    public  end        : string;
    public  name       : string;
    public  quantity   : string;
    public  region_code: string;
    public  release    : string;
    public  start      : string;
    constructor (json?: any) {
        if (json) {
            this.context = json['context'];
            this.end = json['end'];
            this.name = json['name'];
            this.quantity = json['quantity'];
            this.region_code = json['region_code'];
            this.release = json['release'];
            this.start = json['start'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.context !== undefined
            && this.end !== undefined
            && this.name !== undefined
            && this.quantity !== undefined
            && this.region_code !== undefined
            && this.release !== undefined
            && this.start !== undefined;
    }
}

/* *********************************************** BaseCloudProvider ************************************************ */
export class BaseCloudProvider {
    // required: provider
    public  provider: string;    // description: Name of the Cloud Provider
    constructor (json?: any) {
        if (json) {
            this.provider = json['provider'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.provider !== undefined;
    }
}

/* ********************************************** BaseAwsCloudProvider ********************************************** */
export class BaseAwsCloudProvider extends BaseCloudProvider {
    public  regions: Array<string>;    // description: Regions supported by the cloud provider for sddc deployment
    constructor (json?: any) {
        super(json);
        if (json) {
            this.regions = json['regions'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.regions !== undefined;
    }
}

/* *********************************************** BaseClusterConfig ************************************************ */
export class BaseClusterConfig {
    // required: num_hosts
    public  num_hosts       : number;    // format: int32
    public  storage_capacity: number;    // description: For EBS-backed instances only, the requested storage
                                         // capacity in GiB., format: int64, x-vmw-vmc-exclude: client
    constructor (json?: any) {
        if (json) {
            this.num_hosts = json['num_hosts'];
            this.storage_capacity = json['storage_capacity'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.num_hosts !== undefined;
    }
}

/* *********************************************** BaseConfigResponse *********************************************** */
export class BaseConfigResponse {
    public  all_roles              : Array<string>;    // description: Available, assignable Operator Roles specific to VMC,
                                         // x-vmw-vmc-exclude: client
    public  service_definition_link: string;    // x-vmw-vmc-exclude: client
    constructor (json?: any) {
        if (json) {
            this.all_roles = json['all_roles'];
            this.service_definition_link = json['service_definition_link'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.all_roles !== undefined
            && this.service_definition_link !== undefined;
    }
}

/* ******************************************* BaseConnectedServiceStatus ******************************************* */
export class BaseConnectedServiceStatus {
    public  active      : boolean;    // description: When true, this connection is active.
    public  attributes  : any;    // description: A list of additional attributes about a service.
    public  service_name: string;    // description: The service's short name, also serves as its id.
    constructor (json?: any) {
        if (json) {
            this.active = json['active'];
            this.attributes = json['attributes'];
            this.service_name = json['service_name'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.active !== undefined
            && this.attributes !== undefined
            && this.service_name !== undefined;
    }
}

/* **************************************** BaseConnectivityAgentValidation ***************************************** */
export const CONNECTIVITYAGENTVALIDATION_TYPE_PING = 'PING';
export const CONNECTIVITYAGENTVALIDATION_TYPE_TRACEROUTE = 'TRACEROUTE';
export const CONNECTIVITYAGENTVALIDATION_TYPE_DNS = 'DNS';
export const CONNECTIVITYAGENTVALIDATION_TYPE_CONNECTIVITY = 'CONNECTIVITY';

export enum CONNECTIVITYAGENTVALIDATION_type {
   Connectivity = 'CONNECTIVITY',
   Dns = 'DNS',
   Ping = 'PING',
   Traceroute = 'TRACEROUTE'
}

export class BaseConnectivityAgentValidation {
    public  ports: Array<string>;    // description: TCP ports ONLY for CONNECTIVITY tests.
    public  type : string;    // description: type of connectivity test, i.e. PING, TRACEROUTE, DNS, CONNECTIVITY.
                             // For CONNECTIVITY test only, please specify the ports to be tested against., enum:
                             // ['PING', 'TRACEROUTE', 'DNS', 'CONNECTIVITY']
    constructor (json?: any) {
        if (json) {
            this.ports = json['ports'];
            this.type = json['type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.ports !== undefined
            && this.type !== undefined;
    }
}

/* **************************************** BaseConnectivityValidationInput ***************************************** */
export const CONNECTIVITYVALIDATIONINPUT_ID_HOSTNAME = 'HOSTNAME';
export const CONNECTIVITYVALIDATIONINPUT_ID_HOST_IP = 'HOST_IP';
export const CONNECTIVITYVALIDATIONINPUT_ID_HOSTNAME_OR_IP = 'HOSTNAME_OR_IP';

export enum CONNECTIVITYVALIDATIONINPUT_id {
   Hostname = 'HOSTNAME',
   Hostname_or_ip = 'HOSTNAME_OR_IP',
   Host_ip = 'HOST_IP'
}

export class BaseConnectivityValidationInput {
    public  id   : string;    // description: input value type, i.e. HOSTNAME_OR_IP, HOST_IP, HOSTNAME. Accept FQDN or
                           // IP address as input value when id = HOSTNAME_OR_IP, accept FQDN ONLY when id =
                           // HOSTNAME, accept IP address ONLY when id = HOST_IP., enum: ['HOSTNAME', 'HOST_IP',
                           // 'HOSTNAME_OR_IP']
    public  label: string;    // description: (Optional, for UI display only) input value label.
    public  value: string;    // description: the FQDN or IP address to run the test against, use \#primary-dns or
                              // \#secondary-dns as the on-prem primary/secondary DNS server IP.
    constructor (json?: any) {
        if (json) {
            this.id = json['id'];
            this.label = json['label'];
            this.value = json['value'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.id !== undefined
            && this.label !== undefined
            && this.value !== undefined;
    }
}

/* **************************************** BaseConnectivityValidationResult **************************************** */
export const CONNECTIVITYVALIDATIONRESULT_STATUS_UNTESTED = 'UNTESTED';
export const CONNECTIVITYVALIDATIONRESULT_STATUS_SUCCESS = 'SUCCESS';
export const CONNECTIVITYVALIDATIONRESULT_STATUS_FAIL = 'FAIL';
export const CONNECTIVITYVALIDATIONRESULT_STATUS_WARNING = 'WARNING';
export const CONNECTIVITYVALIDATIONRESULT_STATUS_WAITING = 'WAITING';
export const CONNECTIVITYVALIDATIONRESULT_STATUS_RUNNING = 'RUNNING';
export const CONNECTIVITYVALIDATIONRESULT_STATUS_TIMEOUT = 'TIMEOUT';
export const CONNECTIVITYVALIDATIONRESULT_TYPE_DNS = 'DNS';
export const CONNECTIVITYVALIDATIONRESULT_TYPE_PING = 'PING';
export const CONNECTIVITYVALIDATIONRESULT_TYPE_TRACEROUTE = 'TRACEROUTE';
export const CONNECTIVITYVALIDATIONRESULT_TYPE_CONNECTIVITY = 'CONNECTIVITY';

export enum CONNECTIVITYVALIDATIONRESULT_status {
   Fail = 'FAIL',
   Running = 'RUNNING',
   Success = 'SUCCESS',
   Timeout = 'TIMEOUT',
   Untested = 'UNTESTED',
   Waiting = 'WAITING',
   Warning = 'WARNING'
}

export enum CONNECTIVITYVALIDATIONRESULT_type {
   Connectivity = 'CONNECTIVITY',
   Dns = 'DNS',
   Ping = 'PING',
   Traceroute = 'TRACEROUTE'
}

export class BaseConnectivityValidationResult {
    public  messages: Array<string>;    // description: messages from backend.
    public  status  : string;    // enum: ['UNTESTED', 'SUCCESS', 'FAIL', 'WARNING', 'WAITING', 'RUNNING', 'TIMEOUT']
    public  type    : string;    // enum: ['DNS', 'PING', 'TRACEROUTE', 'CONNECTIVITY']
    constructor (json?: any) {
        if (json) {
            this.messages = json['messages'];
            this.status = json['status'];
            this.type = json['type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.messages !== undefined
            && this.status !== undefined
            && this.type !== undefined;
    }
}

/* *************************************** BaseConnectivityValidationSubGroup *************************************** */
export const CONNECTIVITYVALIDATIONSUBGROUP_ID_PRIMARY_DNS = 'PRIMARY_DNS';
export const CONNECTIVITYVALIDATIONSUBGROUP_ID_SECONDARY_DNS = 'SECONDARY_DNS';
export const CONNECTIVITYVALIDATIONSUBGROUP_ID_ONPREM_VCENTER = 'ONPREM_VCENTER';
export const CONNECTIVITYVALIDATIONSUBGROUP_ID_ONPREM_PSC = 'ONPREM_PSC';
export const CONNECTIVITYVALIDATIONSUBGROUP_ID_ACTIVE_DIRECTORY = 'ACTIVE_DIRECTORY';
export const CONNECTIVITYVALIDATIONSUBGROUP_ID_ONPREM_ESX = 'ONPREM_ESX';

export enum CONNECTIVITYVALIDATIONSUBGROUP_id {
   Active_directory = 'ACTIVE_DIRECTORY',
   Onprem_esx = 'ONPREM_ESX',
   Onprem_psc = 'ONPREM_PSC',
   Onprem_vcenter = 'ONPREM_VCENTER',
   Primary_dns = 'PRIMARY_DNS',
   Secondary_dns = 'SECONDARY_DNS'
}

export class BaseConnectivityValidationSubGroup {
    public  help  : string;    // description: Help text.
    public  id    : string;    // description: subGroup id, i.e. PRIMARY_DNS, SECONDARY_DNS, ONPREM_VCENTER, ONPREM_PSC,
                           // ACTIVE_DIRECTORY, and ONPREM_ESX., enum: ['PRIMARY_DNS', 'SECONDARY_DNS',
                           // 'ONPREM_VCENTER', 'ONPREM_PSC', 'ACTIVE_DIRECTORY', 'ONPREM_ESX']
    public  inputs: Array<BaseConnectivityValidationInput>;    // description: List of user inputs for the sub
                                                               // group.
    public  label : string;    // description: Name of the sub-group.
    public  tests : Array<BaseConnectivityAgentValidation>;    // description: List of connectivity tests.
    constructor (json?: any) {
        if (json) {
            this.help = json['help'];
            this.id = json['id'];
            
            if (json['inputs']) {
                this.inputs = [];
                for (let item of json['inputs']) {
                    this.inputs.push(Object.assign(new BaseConnectivityValidationInput(item), item));
                }
            }
            this.label = json['label'];
            
            if (json['tests']) {
                this.tests = [];
                for (let item of json['tests']) {
                    this.tests.push(Object.assign(new BaseConnectivityAgentValidation(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.help !== undefined
            && this.id !== undefined
            && this.inputs !== undefined
            && this.label !== undefined
            && this.tests !== undefined;
    }
}

/* **************************************** BaseConnectivityValidationGroup ***************************************** */
export const CONNECTIVITYVALIDATIONGROUP_ID_HLM = 'HLM';

export enum CONNECTIVITYVALIDATIONGROUP_id {
   Hlm = 'HLM'
}

export class BaseConnectivityValidationGroup {
    public  id        : string;    // description: test group id, currently, only HLM., enum: ['HLM']
    public  name      : string;    // description: Name of the test group.
    public  sub_groups: Array<BaseConnectivityValidationSubGroup>;    // description: List of sub groups.
    constructor (json?: any) {
        if (json) {
            this.id = json['id'];
            this.name = json['name'];
            
            if (json['sub_groups']) {
                this.sub_groups = [];
                for (let item of json['sub_groups']) {
                    this.sub_groups.push(Object.assign(new BaseConnectivityValidationSubGroup(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.id !== undefined
            && this.name !== undefined
            && this.sub_groups !== undefined;
    }
}

/* **************************************** BaseConnectivityValidationGroups **************************************** */
export class BaseConnectivityValidationGroups {
    public  groups: Array<BaseConnectivityValidationGroup>;    // description: List of groups.
    constructor (json?: any) {
        if (json) {
            
            if (json['groups']) {
                this.groups = [];
                for (let item of json['groups']) {
                    this.groups.push(Object.assign(new BaseConnectivityValidationGroup(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.groups !== undefined;
    }
}

/* ************************************ BaseConnectivityValidationSubGroupResult ************************************ */
export const CONNECTIVITYVALIDATIONSUBGROUPRESULT_TYPE_PRIMARY_DNS = 'PRIMARY_DNS';
export const CONNECTIVITYVALIDATIONSUBGROUPRESULT_TYPE_SECONDARY_DNS = 'SECONDARY_DNS';
export const CONNECTIVITYVALIDATIONSUBGROUPRESULT_TYPE_ONPREM_VCENTER = 'ONPREM_VCENTER';
export const CONNECTIVITYVALIDATIONSUBGROUPRESULT_TYPE_ONPREM_PSC = 'ONPREM_PSC';
export const CONNECTIVITYVALIDATIONSUBGROUPRESULT_TYPE_ACTIVE_DIRECTORY = 'ACTIVE_DIRECTORY';
export const CONNECTIVITYVALIDATIONSUBGROUPRESULT_TYPE_ONPREM_ESX = 'ONPREM_ESX';

export enum CONNECTIVITYVALIDATIONSUBGROUPRESULT_type {
   Active_directory = 'ACTIVE_DIRECTORY',
   Onprem_esx = 'ONPREM_ESX',
   Onprem_psc = 'ONPREM_PSC',
   Onprem_vcenter = 'ONPREM_VCENTER',
   Primary_dns = 'PRIMARY_DNS',
   Secondary_dns = 'SECONDARY_DNS'
}

export class BaseConnectivityValidationSubGroupResult {
    public  results: Array<BaseConnectivityValidationResult>;
    public  type   : string;    // description: connectivity validation result., enum: ['PRIMARY_DNS', 'SECONDARY_DNS',
                             // 'ONPREM_VCENTER', 'ONPREM_PSC', 'ACTIVE_DIRECTORY', 'ONPREM_ESX']
    constructor (json?: any) {
        if (json) {
            
            if (json['results']) {
                this.results = [];
                for (let item of json['results']) {
                    this.results.push(Object.assign(new BaseConnectivityValidationResult(item), item));
                }
            }
            this.type = json['type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.results !== undefined
            && this.type !== undefined;
    }
}

/* ********************************** BaseConnectivityValidationGroupResultWrapper ********************************** */
export class BaseConnectivityValidationGroupResultWrapper {
    public  results: Array<BaseConnectivityValidationSubGroupResult>;    // description: List of connectivity test
                                                                         // result.
    constructor (json?: any) {
        if (json) {
            
            if (json['results']) {
                this.results = [];
                for (let item of json['results']) {
                    this.results.push(Object.assign(new BaseConnectivityValidationSubGroupResult(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.results !== undefined;
    }
}

/* ************************************************* BaseCredential ************************************************* */
export class BaseCredential {
    public  password: string;
    public  username: string;
    constructor (json?: any) {
        if (json) {
            this.password = json['password'];
            this.username = json['username'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.password !== undefined
            && this.username !== undefined;
    }
}

/* ******************************************** BaseCspSubscriptionInfo ********************************************* */
export const CSPSUBSCRIPTIONINFO_SUBSCRIPTION_STATE_ACTIVE = 'ACTIVE';
export const CSPSUBSCRIPTIONINFO_SUBSCRIPTION_STATE_VMC_AWS_ACCOUNT_NOT_FOUND = 'VMC_AWS_ACCOUNT_NOT_FOUND';
export const CSPSUBSCRIPTIONINFO_SUBSCRIPTION_STATE_VMC_ORGANIZATION_NOT_FOUND = 'VMC_ORGANIZATION_NOT_FOUND';
export const CSPSUBSCRIPTIONINFO_SUBSCRIPTION_STATE_VMC_SUBSCRIPTION_NOT_FOUND = 'VMC_SUBSCRIPTION_NOT_FOUND';
export const CSPSUBSCRIPTIONINFO_SUBSCRIPTION_STATE_VMC_SUBSCRIPTION_LINK_EMPTY = 'VMC_SUBSCRIPTION_LINK_EMPTY';
export const CSPSUBSCRIPTIONINFO_SUBSCRIPTION_STATE_VMC_SID_EMPTY = 'VMC_SID_EMPTY';
export const CSPSUBSCRIPTIONINFO_SUBSCRIPTION_STATE_VMC_SUBSCRIPTION_NOT_STARTED = 'VMC_SUBSCRIPTION_NOT_STARTED';

export enum CSPSUBSCRIPTIONINFO_subscriptionstate {
   Active = 'ACTIVE',
   Vmc_aws_account_not_found = 'VMC_AWS_ACCOUNT_NOT_FOUND',
   Vmc_organization_not_found = 'VMC_ORGANIZATION_NOT_FOUND',
   Vmc_sid_empty = 'VMC_SID_EMPTY',
   Vmc_subscription_link_empty = 'VMC_SUBSCRIPTION_LINK_EMPTY',
   Vmc_subscription_not_found = 'VMC_SUBSCRIPTION_NOT_FOUND',
   Vmc_subscription_not_started = 'VMC_SUBSCRIPTION_NOT_STARTED'
}

export class BaseCspSubscriptionInfo {
    public  ref_link          : string;
    public  sid               : string;
    public  start_date        : string;
    public  subscription_state: string;    // enum: ['ACTIVE', 'VMC_AWS_ACCOUNT_NOT_FOUND',
                                           // 'VMC_ORGANIZATION_NOT_FOUND', 'VMC_SUBSCRIPTION_NOT_FOUND',
                                           // 'VMC_SUBSCRIPTION_LINK_EMPTY', 'VMC_SID_EMPTY',
                                           // 'VMC_SUBSCRIPTION_NOT_STARTED']
    constructor (json?: any) {
        if (json) {
            this.ref_link = json['ref_link'];
            this.sid = json['sid'];
            this.start_date = json['start_date'];
            this.subscription_state = json['subscription_state'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.ref_link !== undefined
            && this.sid !== undefined
            && this.start_date !== undefined
            && this.subscription_state !== undefined;
    }
}

/* ******************************************* BaseCspSubscriptionRequest ******************************************* */
export class BaseCspSubscriptionRequest {
    public  context         : Array<{key: string,value: string}>;
    public  orgLink         : string;
    public  subscriptionLink: string;
    public  timeStamp       : string;    // format: date-time
    public  userLink        : string;
    constructor (json?: any) {
        if (json) {
            this.context = json['context'];
            this.orgLink = json['orgLink'];
            this.subscriptionLink = json['subscriptionLink'];
            this.timeStamp = json['timeStamp'];
            this.userLink = json['userLink'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.context !== undefined
            && this.orgLink !== undefined
            && this.subscriptionLink !== undefined
            && this.timeStamp !== undefined
            && this.userLink !== undefined;
    }
}

/* ***************************************** BaseDelegatedAccessSshRequest ****************************************** */
export class BaseDelegatedAccessSshRequest {
    // required: reason
    public  reason: string;    // description: The reason to request SSH access.
    constructor (json?: any) {
        if (json) {
            this.reason = json['reason'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.reason !== undefined;
    }
}

/* ************************************ BaseDelegatedAccessVCenterUserReportItem ************************************ */
export const DELEGATEDACCESSVCENTERUSERREPORTITEM_STATUS_ACTIVE = 'ACTIVE';
export const DELEGATEDACCESSVCENTERUSERREPORTITEM_STATUS_DELETED = 'DELETED';
export const DELEGATEDACCESSVCENTERUSERREPORTITEM_USER_TYPE_READ_ONLY = 'READ_ONLY';
export const DELEGATEDACCESSVCENTERUSERREPORTITEM_USER_TYPE_CLOUD_ADMIN = 'CLOUD_ADMIN';
export const DELEGATEDACCESSVCENTERUSERREPORTITEM_USER_TYPE_ROOT_ADMIN = 'ROOT_ADMIN';

export enum DELEGATEDACCESSVCENTERUSERREPORTITEM_status {
   Active = 'ACTIVE',
   Deleted = 'DELETED'
}

export enum DELEGATEDACCESSVCENTERUSERREPORTITEM_usertype {
   Cloud_admin = 'CLOUD_ADMIN',
   Read_only = 'READ_ONLY',
   Root_admin = 'ROOT_ADMIN'
}

export class BaseDelegatedAccessVCenterUserReportItem {
    public  end_date  : string;    // description: End time of the delegated access, format: date-time
    public  id        : string;    // description: Id identifying the delegated access vcenter user
    public  location  : string;    // description: SDDC Location
    public  org_id    : string;    // description: Org ID to which the SDDC is part of
    public  sddc_id   : string;    // description: SDDC ID of the delegated access
    public  sddc_name : string;    // description: SDDC Name
    public  start_date: string;    // description: Start of the delegated access, format: date-time
    public  status    : string;    // description: Type identifying the status of the access, enum: ['ACTIVE',
                               // 'DELETED']
    public  user_type : string;    // description: Type of role identifying the type of access, enum: ['READ_ONLY',
                                  // 'CLOUD_ADMIN', 'ROOT_ADMIN']
    constructor (json?: any) {
        if (json) {
            this.end_date = json['end_date'];
            this.id = json['id'];
            this.location = json['location'];
            this.org_id = json['org_id'];
            this.sddc_id = json['sddc_id'];
            this.sddc_name = json['sddc_name'];
            this.start_date = json['start_date'];
            this.status = json['status'];
            this.user_type = json['user_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.end_date !== undefined
            && this.id !== undefined
            && this.location !== undefined
            && this.org_id !== undefined
            && this.sddc_id !== undefined
            && this.sddc_name !== undefined
            && this.start_date !== undefined
            && this.status !== undefined
            && this.user_type !== undefined;
    }
}

/* *********************************** BaseDelegatedAccessVCenterUserRequestInfo ************************************ */
export const DELEGATEDACCESSVCENTERUSERREQUESTINFO_USER_TYPE_READ_ONLY = 'READ_ONLY';
export const DELEGATEDACCESSVCENTERUSERREQUESTINFO_USER_TYPE_CLOUD_ADMIN = 'CLOUD_ADMIN';
export const DELEGATEDACCESSVCENTERUSERREQUESTINFO_USER_TYPE_ROOT_ADMIN = 'ROOT_ADMIN';

export enum DELEGATEDACCESSVCENTERUSERREQUESTINFO_usertype {
   Cloud_admin = 'CLOUD_ADMIN',
   Read_only = 'READ_ONLY',
   Root_admin = 'ROOT_ADMIN'
}

export class BaseDelegatedAccessVCenterUserRequestInfo {
    // required: user_type
    public  reason   : string;    // description: Reason for the request
    public  user_type: string;    // enum: ['READ_ONLY', 'CLOUD_ADMIN', 'ROOT_ADMIN']
    constructor (json?: any) {
        if (json) {
            this.reason = json['reason'];
            this.user_type = json['user_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.user_type !== undefined;
    }
}

/* *********************************** BaseDelegatedAccessVCenterUserResponseInfo *********************************** */
export const DELEGATEDACCESSVCENTERUSERRESPONSEINFO_USER_TYPE_READ_ONLY = 'READ_ONLY';
export const DELEGATEDACCESSVCENTERUSERRESPONSEINFO_USER_TYPE_CLOUD_ADMIN = 'CLOUD_ADMIN';
export const DELEGATEDACCESSVCENTERUSERRESPONSEINFO_USER_TYPE_ROOT_ADMIN = 'ROOT_ADMIN';

export enum DELEGATEDACCESSVCENTERUSERRESPONSEINFO_usertype {
   Cloud_admin = 'CLOUD_ADMIN',
   Read_only = 'READ_ONLY',
   Root_admin = 'ROOT_ADMIN'
}

export class BaseDelegatedAccessVCenterUserResponseInfo {
    // required: user_name, user_type, start_date, end_date
    public  agent_login_token: string;    // description: Login Token for the PoP Agent
    public  agent_sub_domain : string;    // description: Sub-domain for the PoP Agent
    public  end_date         : string;    // description: End time for the delegated access, format: date-time
    public  id               : string;    // description: Id identifying the delegated access vcenter user
    public  password         : string;    // description: Generated password for the delegated vcenter user created
    public  reason           : string;    // description: Reason for delegated access
    public  start_date       : string;    // description: Start time for the delegated access, format: date-time
    public  user_name        : string;    // description: Name of the operator requesting access
    public  user_type        : string;    // enum: ['READ_ONLY', 'CLOUD_ADMIN', 'ROOT_ADMIN']
    public  vcenter_flash_url: string;    // description: Flash vcenter url
    public  vcenter_html_url : string;    // description: HTML5 vcenter url
    constructor (json?: any) {
        if (json) {
            this.agent_login_token = json['agent_login_token'];
            this.agent_sub_domain = json['agent_sub_domain'];
            this.end_date = json['end_date'];
            this.id = json['id'];
            this.password = json['password'];
            this.reason = json['reason'];
            this.start_date = json['start_date'];
            this.user_name = json['user_name'];
            this.user_type = json['user_type'];
            this.vcenter_flash_url = json['vcenter_flash_url'];
            this.vcenter_html_url = json['vcenter_html_url'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.end_date !== undefined
            && this.start_date !== undefined
            && this.user_name !== undefined
            && this.user_type !== undefined;
    }
}

/* ************************************************* BaseDnsServers ************************************************* */
export class BaseDnsServers {
    public  primary_dns  : string;
    public  secondary_dns: string;
    constructor (json?: any) {
        if (json) {
            this.primary_dns = json['primary_dns'];
            this.secondary_dns = json['secondary_dns'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.primary_dns !== undefined
            && this.secondary_dns !== undefined;
    }
}

/* ******************************************** BaseDnsValidationResult ********************************************* */
export class BaseDnsValidationResult extends BaseConnectivityValidationResult {
    public  ip            : string;    // description: IP address of on-prem Vcenter.
    public  message       : string;    // description: HLM DNS Test failure message.
    public  recommendation: string;    // description: HLM DNS Test recommendation message.
    constructor (json?: any) {
        super(json);
        if (json) {
            this.ip = json['ip'];
            this.message = json['message'];
            this.recommendation = json['recommendation'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.ip !== undefined
            && this.message !== undefined
            && this.recommendation !== undefined;
    }
}

/* ************************************************ BaseDvsProperty ************************************************* */
export class BaseDvsProperty {
    public  property: string;    // description: Property Name
    public  value   : string;    // description: Property Value
    constructor (json?: any) {
        if (json) {
            this.property = json['property'];
            this.value = json['value'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.property !== undefined
            && this.value !== undefined;
    }
}

/* *********************************************** BaseEntitySummary ************************************************ */
export class BaseEntitySummary {
    // required: id, version
    public  id     : string;    // description: entity Id
    public  updated: string;    // description: UTC time entity was last updated, format: date-time
    public  version: number;    // description: current version of entity, format: int32
    constructor (json?: any) {
        if (json) {
            this.id = json['id'];
            this.updated = json['updated'];
            this.version = json['version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.id !== undefined
            && this.version !== undefined;
    }
}

/* *********************************************** BaseErrorResponse ************************************************ */
export class BaseErrorResponse {
    // required: error_code, error_messages, status, path, retryable
    public  error_code    : string;    // description: unique error code
    public  error_messages: Array<string>;    // description: localized error messages
    public  path          : string;    // description: Originating request URI
    public  retryable     : boolean;    // default: False, description: If true, client should retry operation
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

/* ************************************************* BaseEsxConfig ************************************************** */
export class BaseEsxConfig {
    // required: num_hosts
    public  availability_zone: string;    // description: Availability zone where the hosts should be provisioned.
                                          // (Can be specified only for privileged host operations).
    public  num_hosts        : number;    // format: int32
    public  storage_capacity : number;    // description: For EBS-backed instances only, the requested storage
                                         // capacity in GiB to add or remove, in GiB., format: int64, x-vmw-vmc-
                                         // exclude: client
    constructor (json?: any) {
        if (json) {
            this.availability_zone = json['availability_zone'];
            this.num_hosts = json['num_hosts'];
            this.storage_capacity = json['storage_capacity'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.num_hosts !== undefined;
    }
}

/* ************************************************** BaseEsxHost *************************************************** */
export const ESXHOST_ESX_STATE_DEPLOYING = 'DEPLOYING';
export const ESXHOST_ESX_STATE_PROVISIONED = 'PROVISIONED';
export const ESXHOST_ESX_STATE_READY = 'READY';
export const ESXHOST_ESX_STATE_DELETING = 'DELETING';
export const ESXHOST_ESX_STATE_DELETED = 'DELETED';
export const ESXHOST_ESX_STATE_FAILED = 'FAILED';

export enum ESXHOST_esxstate {
   Deleted = 'DELETED',
   Deleting = 'DELETING',
   Deploying = 'DEPLOYING',
   Failed = 'FAILED',
   Provisioned = 'PROVISIONED',
   Ready = 'READY'
}

export class BaseEsxHost {
    // required: provider
    public  availability_zone: string;    // description: Availability zone where the host is provisioned.
    public  custom_properties: any;
    public  esx_credential   : BaseCredential;    // x-vmw-vmc-exclude: client
    public  esx_id           : string;
    public  esx_state        : string;    // enum: ['DEPLOYING', 'PROVISIONED', 'READY', 'DELETING', 'DELETED', 'FAILED']
    public  hostname         : string;
    public  mac_address      : string;
    public  name             : string;
    public  provider         : string;
    constructor (json?: any) {
        if (json) {
            this.availability_zone = json['availability_zone'];
            this.custom_properties = json['custom_properties'];
            this.esx_credential = new BaseCredential(json['esx_credential']);
            Object.assign(this.esx_credential, json['esx_credential']);
            this.esx_id = json['esx_id'];
            this.esx_state = json['esx_state'];
            this.hostname = json['hostname'];
            this.mac_address = json['mac_address'];
            this.name = json['name'];
            this.provider = json['provider'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.provider !== undefined;
    }
}

/* ********************************************** BaseEsxSshAccessInfo ********************************************** */
export const ESXSSHACCESSINFO_STATUS_SUCCEEDED = 'SUCCEEDED';
export const ESXSSHACCESSINFO_STATUS_FAILED = 'FAILED';

export enum ESXSSHACCESSINFO_status {
   Failed = 'FAILED',
   Succeeded = 'SUCCEEDED'
}

export class BaseEsxSshAccessInfo {
    public  host_address: string;    // description: IP Address of the ESX Host.
    public  message     : string;    // description: String reason representing reason of failure in case of failures.
    public  status      : string;    // description: Enum representing if the access creation was successfull or failed.,
                               // enum: ['SUCCEEDED', 'FAILED']
    constructor (json?: any) {
        if (json) {
            this.host_address = json['host_address'];
            this.message = json['message'];
            this.status = json['status'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.host_address !== undefined
            && this.message !== undefined
            && this.status !== undefined;
    }
}

/* ***************************************** BaseDelegatedAccessSshResponse ***************************************** */
export class BaseDelegatedAccessSshResponse {
    // required: user_name, pop_host, start_time, end_time, ssh_private_key
    public  end_time       : string;    // description: End time for the delegated access, format: date-time
    public  esx_access     : Array<BaseEsxSshAccessInfo>;
    public  pop_host       : string;    // description: PoP host FQDN or IP
    public  ssh_private_key: string;    // description: The private key used for ssh to PoP
    public  start_time     : string;    // description: Start time for the delegated access, format: date-time
    public  user_name      : string;    // description: The user name to ssh to PoP
    constructor (json?: any) {
        if (json) {
            this.end_time = json['end_time'];
            
            if (json['esx_access']) {
                this.esx_access = [];
                for (let item of json['esx_access']) {
                    this.esx_access.push(Object.assign(new BaseEsxSshAccessInfo(item), item));
                }
            }
            this.pop_host = json['pop_host'];
            this.ssh_private_key = json['ssh_private_key'];
            this.start_time = json['start_time'];
            this.user_name = json['user_name'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.end_time !== undefined
            && this.pop_host !== undefined
            && this.ssh_private_key !== undefined
            && this.start_time !== undefined
            && this.user_name !== undefined;
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

/* ******************************************* BaseFlushAuthTokenRequest ******************************************** */
export class BaseFlushAuthTokenRequest {
    public  auth_token: string;    // description: Authentication token to flush.
    constructor (json?: any) {
        if (json) {
            this.auth_token = json['auth_token'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.auth_token !== undefined;
    }
}

/* *********************************************** BaseConfigRequest ************************************************ */
export class BaseConfigRequest {
    public  flushRequest: BaseFlushAuthTokenRequest;
    constructor (json?: any) {
        if (json) {
            this.flushRequest = new BaseFlushAuthTokenRequest(json['flushRequest']);
            Object.assign(this.flushRequest, json['flushRequest']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.flushRequest !== undefined;
    }
}

/* ************************************************* BaseGlcmBundle ************************************************* */
export class BaseGlcmBundle {
    public  id      : string;    // description: the glcmbundle's id
    public  s3Bucket: string;    // description: the glcmbundle's s3 bucket
    constructor (json?: any) {
        if (json) {
            this.id = json['id'];
            this.s3Bucket = json['s3Bucket'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.id !== undefined
            && this.s3Bucket !== undefined;
    }
}

/* ********************************************* BaseInternalErrorCode ********************************************** */
export class BaseInternalErrorCode {
    // required: error_code
    public  error_code: string;    // description: A code indicating the root cause of the failure.
    constructor (json?: any) {
        if (json) {
            this.error_code = json['error_code'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.error_code !== undefined;
    }
}

/* ******************************************** BaseInternalErrorDetails ******************************************** */
export class BaseInternalErrorDetails {
    // required: error_code
    public  error_code: BaseInternalErrorCode;    // description: Internal Error Code representing the cause of the
                                                  // failure
    constructor (json?: any) {
        if (json) {
            this.error_code = new BaseInternalErrorCode(json['error_code']);
            Object.assign(this.error_code, json['error_code']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.error_code !== undefined;
    }
}

/* ************************************************ BaseJobResponse ************************************************* */
export class BaseJobResponse {
    public  job_name          : string;
    public  next_fire_time    : string;    // format: date-time
    public  previous_fire_time: string;    // format: date-time
    constructor (json?: any) {
        if (json) {
            this.job_name = json['job_name'];
            this.next_fire_time = json['next_fire_time'];
            this.previous_fire_time = json['previous_fire_time'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.job_name !== undefined
            && this.next_fire_time !== undefined
            && this.previous_fire_time !== undefined;
    }
}

/* *********************************************** BaseLogicalNetwork *********************************************** */
export const LOGICALNETWORK_NETWORK_TYPE_HOSTED = 'HOSTED';
export const LOGICALNETWORK_NETWORK_TYPE_ROUTED = 'ROUTED';
export const LOGICALNETWORK_NETWORK_TYPE_EXTENDED = 'EXTENDED';

export enum LOGICALNETWORK_networktype {
   Extended = 'EXTENDED',
   Hosted = 'HOSTED',
   Routed = 'ROUTED'
}

export class BaseLogicalNetwork {
    public  dhcp_enabled : string;    // description: if 'true' - enabled; if 'false' - disabled
    public  dhcp_ip_range: string;    // description: ip range within the subnet mask, range delimiter is '-'
                                      // (example 10.118.10.130-10.118.10.140)
    public  gatewayIp    : string;    // description: gateway ip of the logical network
    public  id           : string;    // readOnly: True
    public  name         : string;    // description: name of the network
    public  network_type : string;    // enum: ['HOSTED', 'ROUTED', 'EXTENDED'], readOnly: True
    public  subnet_cidr  : string;    // description: the subnet cidr
    public  tunnel_id    : number;    // description: tunnel id of extended network, format: int32
    constructor (json?: any) {
        if (json) {
            this.dhcp_enabled = json['dhcp_enabled'];
            this.dhcp_ip_range = json['dhcp_ip_range'];
            this.gatewayIp = json['gatewayIp'];
            this.id = json['id'];
            this.name = json['name'];
            this.network_type = json['network_type'];
            this.subnet_cidr = json['subnet_cidr'];
            this.tunnel_id = json['tunnel_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.dhcp_enabled !== undefined
            && this.dhcp_ip_range !== undefined
            && this.gatewayIp !== undefined
            && this.id !== undefined
            && this.name !== undefined
            && this.network_type !== undefined
            && this.subnet_cidr !== undefined
            && this.tunnel_id !== undefined;
    }
}

/* ********************************************* BaseMaintenanceWindow ********************************************** */
export const MAINTENANCEWINDOW_DAY_OF_WEEK_SUNDAY = 'SUNDAY';
export const MAINTENANCEWINDOW_DAY_OF_WEEK_MONDAY = 'MONDAY';
export const MAINTENANCEWINDOW_DAY_OF_WEEK_TUESDAY = 'TUESDAY';
export const MAINTENANCEWINDOW_DAY_OF_WEEK_WEDNESDAY = 'WEDNESDAY';
export const MAINTENANCEWINDOW_DAY_OF_WEEK_THURSDAY = 'THURSDAY';
export const MAINTENANCEWINDOW_DAY_OF_WEEK_FRIDAY = 'FRIDAY';
export const MAINTENANCEWINDOW_DAY_OF_WEEK_SATURDAY = 'SATURDAY';

export enum MAINTENANCEWINDOW_dayofweek {
   Friday = 'FRIDAY',
   Monday = 'MONDAY',
   Saturday = 'SATURDAY',
   Sunday = 'SUNDAY',
   Thursday = 'THURSDAY',
   Tuesday = 'TUESDAY',
   Wednesday = 'WEDNESDAY'
}

export class BaseMaintenanceWindow {
    public  day_of_week: string;    // enum: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY',
                                    // 'SATURDAY']
    public  hour_of_day: number;    // format: int32
    constructor (json?: any) {
        if (json) {
            this.day_of_week = json['day_of_week'];
            this.hour_of_day = json['hour_of_day'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.day_of_week !== undefined
            && this.hour_of_day !== undefined;
    }
}

/* ******************************************** BaseMaintenanceWindowGet ******************************************** */
export class BaseMaintenanceWindowGet extends BaseMaintenanceWindow {
    public  duration_min: number;    // format: int64
    public  version     : number;    // format: int64
    constructor (json?: any) {
        super(json);
        if (json) {
            this.duration_min = json['duration_min'];
            this.version = json['version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.duration_min !== undefined
            && this.version !== undefined;
    }
}

/* ************************************************ BaseManagementVm ************************************************ */
export class BaseManagementVm {
    public  fqdn              : string;    // description: the fully qualified domain name of the management VM in the DNS record
    public  id                : string;    // description: a globally unique ID provided by the service that manages this VM
    public  management_ip     : string;    // description: the management IP address of this VM
    public  private_dns_record: boolean;    // description: if true, the DNS record will be created in the private
                                            // zone
    public  public_dns_record : boolean;    // description: if true, the DNS record will be created in the public
                                           // zone
    constructor (json?: any) {
        if (json) {
            this.fqdn = json['fqdn'];
            this.id = json['id'];
            this.management_ip = json['management_ip'];
            this.private_dns_record = json['private_dns_record'];
            this.public_dns_record = json['public_dns_record'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.fqdn !== undefined
            && this.id !== undefined
            && this.management_ip !== undefined
            && this.private_dns_record !== undefined
            && this.public_dns_record !== undefined;
    }
}

/* ****************************************** BaseManagementVmCertificate ******************************************* */
export class BaseManagementVmCertificate {
    // required: id
    public  certificateChain: Array<string>;    // description: The certificate chain from leaf to the root.
    public  id              : string;    // description: The management VM ID
    constructor (json?: any) {
        if (json) {
            this.certificateChain = json['certificateChain'];
            this.id = json['id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.id !== undefined;
    }
}

/* ********************************************* BaseManagementVmConfig ********************************************* */
export class BaseManagementVmConfig {
    // required: id
    public  id                 : string;    // description: The management VM ID
    public  privateDnsRecord   : boolean;    // description: If true, the DNS record will be created in the private
                                          // zone
    public  publicDnsEip       : string;    // description: The public ip for the public DNS record in the public zone
    public  publicDnsRecord    : boolean;    // description: If true, the DNS record will be created in the public zone
    public  requestManagementIp: boolean;    // description: If true, request an IP address on the management
                                             // network. When updating the current configuration, set to null to
                                             // keep the current settings.
    constructor (json?: any) {
        if (json) {
            this.id = json['id'];
            this.privateDnsRecord = json['privateDnsRecord'];
            this.publicDnsEip = json['publicDnsEip'];
            this.publicDnsRecord = json['publicDnsRecord'];
            this.requestManagementIp = json['requestManagementIp'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.id !== undefined;
    }
}

/* ******************************************** BaseManagementVmCsrParam ******************************************** */
export class BaseManagementVmCsrParam {
    // required: csr
    public  csr: string;    // description: Certificate signing request
    constructor (json?: any) {
        if (json) {
            this.csr = json['csr'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.csr !== undefined;
    }
}

/* ********************************************** BaseMapZonesRequest *********************************************** */
export class BaseMapZonesRequest {
    public  connected_account_id   : string;    // description: The connected account ID to remap. This is a standard
                                             // UUID.
    public  org_id                 : string;    // description: The org ID to remap in. This is a standard UUID.
    public  petronas_regions_to_map: Array<string>;    // description: A list of Petronas regions to map.
    constructor (json?: any) {
        if (json) {
            this.connected_account_id = json['connected_account_id'];
            this.org_id = json['org_id'];
            this.petronas_regions_to_map = json['petronas_regions_to_map'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.connected_account_id !== undefined
            && this.org_id !== undefined
            && this.petronas_regions_to_map !== undefined;
    }
}

/* *********************************************** BaseMapZonesResult *********************************************** */
export class BaseMapZonesResult {
    public  connected_accounts_changed: Array<BaseAwsCustomerConnectedAccount>;    // description: A list of
                                                                                   // connected accounts impacted by
                                                                                   // this change.
    public  regions_mapped            : Array<string>;    // description: A list of regions that were mapped-out in this
                                              // operation.
    constructor (json?: any) {
        if (json) {
            
            if (json['connected_accounts_changed']) {
                this.connected_accounts_changed = [];
                for (let item of json['connected_accounts_changed']) {
                    this.connected_accounts_changed.push(Object.assign(new BaseAwsCustomerConnectedAccount(item), item));
                }
            }
            this.regions_mapped = json['regions_mapped'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.connected_accounts_changed !== undefined
            && this.regions_mapped !== undefined;
    }
}

/* ************************************************** BaseMetadata ************************************************** */
export class BaseMetadata {
    public  cycle_id : string;    // description: the cycle id
    public  timestamp: string;    // description: the timestamp for the bundle
    constructor (json?: any) {
        if (json) {
            this.cycle_id = json['cycle_id'];
            this.timestamp = json['timestamp'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cycle_id !== undefined
            && this.timestamp !== undefined;
    }
}

/* ************************************************** BaseNatRule *************************************************** */
export const NATRULE_ACTION_DNAT = 'dnat';
export const NATRULE_ACTION_SNAT = 'snat';

export enum NATRULE_action {
   Dnat = 'dnat',
   Snat = 'snat'
}

export class BaseNatRule {
    public  action        : string;    // enum: ['dnat', 'snat']
    public  id            : string;    // readOnly: True
    public  internal_ip   : string;
    public  internal_ports: string;
    public  name          : string;
    public  protocol      : string;
    public  public_ip     : string;
    public  public_ports  : string;
    public  revision      : number;    // description: current revision of the list of nat rules, used to protect against
                                 // concurrent modification (first writer wins), format: int32, readOnly: True
    public  rule_type     : string;
    constructor (json?: any) {
        if (json) {
            this.action = json['action'];
            this.id = json['id'];
            this.internal_ip = json['internal_ip'];
            this.internal_ports = json['internal_ports'];
            this.name = json['name'];
            this.protocol = json['protocol'];
            this.public_ip = json['public_ip'];
            this.public_ports = json['public_ports'];
            this.revision = json['revision'];
            this.rule_type = json['rule_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.action !== undefined
            && this.id !== undefined
            && this.internal_ip !== undefined
            && this.internal_ports !== undefined
            && this.name !== undefined
            && this.protocol !== undefined
            && this.public_ip !== undefined
            && this.public_ports !== undefined
            && this.revision !== undefined
            && this.rule_type !== undefined;
    }
}

/* ****************************************** BaseNitroDatacenterAzMapping ****************************************** */
export class BaseNitroDatacenterAzMapping {
    public  values: any;    // description: A map of string properties to string values. This structure holds the
                            // region to az mappings.
    constructor (json?: any) {
        if (json) {
            this.values = json['values'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.values !== undefined;
    }
}

/* ************************************************* BaseAwsAccount ************************************************* */
export const AWSACCOUNT_PAYER_ACCOUNT_TYPE_INTERNAL = 'INTERNAL';
export const AWSACCOUNT_PAYER_ACCOUNT_TYPE_CUSTOMER = 'CUSTOMER';
export const AWSACCOUNT_STATE_ACTIVE = 'ACTIVE';
export const AWSACCOUNT_STATE_DELETED = 'DELETED';
export const AWSACCOUNT_STATE_INTERNAL = 'INTERNAL';

export enum AWSACCOUNT_payeraccounttype {
   Customer = 'CUSTOMER',
   Internal = 'INTERNAL'
}

export enum AWSACCOUNT_state {
   Active = 'ACTIVE',
   Deleted = 'DELETED',
   Internal = 'INTERNAL'
}

export class BaseAwsAccount extends BaseAbstractEntity {
    // required: aws_account_number, aws_account_state, assume_role_arn
    public  assume_role_arn        : string;
    public  aws_account_number     : string;
    public  aws_account_state      : string;
    public  nitro_region_az_mapping: any;
    public  org_id                 : string;
    public  payer_account_type     : string;    // enum: ['INTERNAL', 'CUSTOMER']
    public  state                  : string;    // enum: ['ACTIVE', 'DELETED', 'INTERNAL']
    constructor (json?: any) {
        super(json);
        if (json) {
            this.assume_role_arn = json['assume_role_arn'];
            this.aws_account_number = json['aws_account_number'];
            this.aws_account_state = json['aws_account_state'];
            this.nitro_region_az_mapping = json['nitro_region_az_mapping'];
            this.org_id = json['org_id'];
            this.payer_account_type = json['payer_account_type'];
            this.state = json['state'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.assume_role_arn !== undefined
            && this.aws_account_number !== undefined
            && this.aws_account_state !== undefined;
    }
}

/* ******************************************** BaseNodeActiveStateInfo ********************************************* */
export class BaseNodeActiveStateInfo {
    // required: type
    public  type: string;
    constructor (json?: any) {
        if (json) {
            this.type = json['type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.type !== undefined;
    }
}

/* ************************************************** BaseNodeInfo ************************************************** */
export class BaseNodeInfo {
    public  active_state: any;
    public  leader      : boolean;
    public  name        : string;
    public  quiesced    : boolean;    // description: Is node quiesced and ready to be shut down
    constructor (json?: any) {
        if (json) {
            this.active_state = json['active_state'];
            this.leader = json['leader'];
            this.name = json['name'];
            this.quiesced = json['quiesced'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.active_state !== undefined
            && this.leader !== undefined
            && this.name !== undefined
            && this.quiesced !== undefined;
    }
}

/* ******************************************* BaseOauthClientCredentials ******************************************* */
export class BaseOauthClientCredentials {
    // required: client_id, client_secret
    public  client_id    : string;
    public  client_secret: string;
    constructor (json?: any) {
        if (json) {
            this.client_id = json['client_id'];
            this.client_secret = json['client_secret'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.client_id !== undefined
            && this.client_secret !== undefined;
    }
}

/* ************************************************ BaseCspCredModel ************************************************ */
export const CSPCREDMODEL_CRED_TYPE_REFRESH_TOKEN = 'REFRESH_TOKEN';
export const CSPCREDMODEL_CRED_TYPE_PASSWORD = 'PASSWORD';
export const CSPCREDMODEL_CRED_TYPE_CLIENT_CREDENTIALS = 'CLIENT_CREDENTIALS';

export enum CSPCREDMODEL_credtype {
   Client_credentials = 'CLIENT_CREDENTIALS',
   Password = 'PASSWORD',
   Refresh_token = 'REFRESH_TOKEN'
}

export class BaseCspCredModel {
    // required: cred_type, csp_url
    public  client_credential: BaseOauthClientCredentials;
    public  cred_type        : string;    // enum: ['REFRESH_TOKEN', 'PASSWORD', 'CLIENT_CREDENTIALS']
    public  csp_url          : string;    // description: CSP endpoint caller is registered with
    public  password         : string;    // description: required if cred_type == PASSWORD
    public  refresh_token    : string;    // description: required if cred_type == REFRESH_TOKEN
    public  username         : string;    // description: required if cred_type == PASSWORD
    constructor (json?: any) {
        if (json) {
            this.client_credential = new BaseOauthClientCredentials(json['client_credential']);
            Object.assign(this.client_credential, json['client_credential']);
            this.cred_type = json['cred_type'];
            this.csp_url = json['csp_url'];
            this.password = json['password'];
            this.refresh_token = json['refresh_token'];
            this.username = json['username'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cred_type !== undefined
            && this.csp_url !== undefined;
    }
}

/* ***************************************** BaseOauthClientDeleteResponse ****************************************** */
export class BaseOauthClientDeleteResponse {
    public  client_id: string;
    constructor (json?: any) {
        if (json) {
            this.client_id = json['client_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.client_id !== undefined;
    }
}

/* ********************************************* BaseOauthClientRequest ********************************************* */
export class BaseOauthClientRequest {
    public  access_token_ttl : number;
    public  client_id        : string;
    public  client_secret    : string;
    public  grant_types      : Array<string>;
    public  redirect_uris    : Array<string>;
    public  refresh_token_ttl: number;
    constructor (json?: any) {
        if (json) {
            this.access_token_ttl = json['access_token_ttl'];
            this.client_id = json['client_id'];
            this.client_secret = json['client_secret'];
            this.grant_types = json['grant_types'];
            this.redirect_uris = json['redirect_uris'];
            this.refresh_token_ttl = json['refresh_token_ttl'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.access_token_ttl !== undefined
            && this.client_id !== undefined
            && this.client_secret !== undefined
            && this.grant_types !== undefined
            && this.redirect_uris !== undefined
            && this.refresh_token_ttl !== undefined;
    }
}

/* ******************************************** BaseOauthClientResponse ********************************************* */
export class BaseOauthClientResponse {
    public  access_token_ttl : number;
    public  allowed_scopes   : Array<string>;
    public  client_id        : string;
    public  grant_types      : Array<string>;
    public  redirect_uris    : Array<string>;
    public  refresh_token_ttl: number;
    constructor (json?: any) {
        if (json) {
            this.access_token_ttl = json['access_token_ttl'];
            this.allowed_scopes = json['allowed_scopes'];
            this.client_id = json['client_id'];
            this.grant_types = json['grant_types'];
            this.redirect_uris = json['redirect_uris'];
            this.refresh_token_ttl = json['refresh_token_ttl'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.access_token_ttl !== undefined
            && this.allowed_scopes !== undefined
            && this.client_id !== undefined
            && this.grant_types !== undefined
            && this.redirect_uris !== undefined
            && this.refresh_token_ttl !== undefined;
    }
}

/* ************************************************* BaseOfferType ************************************************** */
export class BaseOfferType {
    /* No var_list in class OfferType */
    constructor (json?: any) {
        if (json) {}
    }

    public hasRequiredProperties(): boolean {
        return true;
    }
}

/* ******************************************* BaseOnDemandOfferInstance ******************************************** */
export class BaseOnDemandOfferInstance {
    // required: name, version, description, product_type, region, currency, unit_price, monthly_cost
    public  currency    : string;
    public  description : string;
    public  monthly_cost: string;
    public  name        : string;
    public  product_type: string;
    public  region      : string;
    public  unit_price  : string;
    public  version     : string;
    constructor (json?: any) {
        if (json) {
            this.currency = json['currency'];
            this.description = json['description'];
            this.monthly_cost = json['monthly_cost'];
            this.name = json['name'];
            this.product_type = json['product_type'];
            this.region = json['region'];
            this.unit_price = json['unit_price'];
            this.version = json['version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.currency !== undefined
            && this.description !== undefined
            && this.monthly_cost !== undefined
            && this.name !== undefined
            && this.product_type !== undefined
            && this.region !== undefined
            && this.unit_price !== undefined
            && this.version !== undefined;
    }
}

/* *********************************************** BaseOrgProperties ************************************************ */
export class BaseOrgProperties {
    public  values: any;    // description: A map of string properties to values.
    constructor (json?: any) {
        if (json) {
            this.values = json['values'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.values !== undefined;
    }
}

/* ********************************************* BaseOrgPatchStructure ********************************************** */
export class BaseOrgPatchStructure {
    public  org_type  : string;    // description: ORG_TYPE to be associated with the org
    public  properties: BaseOrgProperties;
    constructor (json?: any) {
        if (json) {
            this.org_type = json['org_type'];
            this.properties = new BaseOrgProperties(json['properties']);
            Object.assign(this.properties, json['properties']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.org_type !== undefined
            && this.properties !== undefined;
    }
}

/* ************************************************ BaseOrganization ************************************************ */
export const ORGANIZATION_PROJECT_STATE_CREATED = 'CREATED';
export const ORGANIZATION_PROJECT_STATE_DELETED = 'DELETED';

export enum ORGANIZATION_projectstate {
   Created = 'CREATED',
   Deleted = 'DELETED'
}

export class BaseOrganization extends BaseAbstractEntity {
    // required: display_name, id, name, project_state, version
    public  display_name : string;
    public  name         : string;
    public  org_type     : string;    // description: ORG_TYPE to be associated with the org
    public  project_state: string;    // enum: ['CREATED', 'DELETED']
    public  properties   : BaseOrgProperties;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.display_name = json['display_name'];
            this.name = json['name'];
            this.org_type = json['org_type'];
            this.project_state = json['project_state'];
            this.properties = new BaseOrgProperties(json['properties']);
            Object.assign(this.properties, json['properties']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.display_name !== undefined
            && this.id !== undefined
            && this.name !== undefined
            && this.project_state !== undefined
            && this.version !== undefined;
    }
}

/* ******************************************** BasePingValidationResult ******************************************** */
export class BasePingValidationResult extends BaseConnectivityValidationResult {
    public  pkt_rcvd: string;    // description: RTT received value.
    public  pkt_sent: string;    // description: PKT sent value.
    public  rtt_avg : string;    // description: RTT average value.
    public  rtt_dev : string;    // description: RTT dev value.
    public  rtt_max : string;    // description: RTT max value.
    public  rtt_min : string;    // description: RTT min value.
    constructor (json?: any) {
        super(json);
        if (json) {
            this.pkt_rcvd = json['pkt_rcvd'];
            this.pkt_sent = json['pkt_sent'];
            this.rtt_avg = json['rtt_avg'];
            this.rtt_dev = json['rtt_dev'];
            this.rtt_max = json['rtt_max'];
            this.rtt_min = json['rtt_min'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.pkt_rcvd !== undefined
            && this.pkt_sent !== undefined
            && this.rtt_avg !== undefined
            && this.rtt_dev !== undefined
            && this.rtt_max !== undefined
            && this.rtt_min !== undefined;
    }
}

/* ************************************************* BasePopAmiInfo ************************************************* */
export const POPAMIINFO_TYPE_CENTOS = 'CENTOS';
export const POPAMIINFO_TYPE_POP = 'POP';

export enum POPAMIINFO_type {
   Centos = 'CENTOS',
   Pop = 'POP'
}

export class BasePopAmiInfo extends BaseAmiInfo {
    public  type: string;    // default: POP, description: PoP AMI type. CENTOS: a Centos AMI; POP: a PoP AMI.,
                             // enum: ['CENTOS', 'POP']
    constructor (json?: any) {
        super(json);
        if (json) {
            this.type = json['type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.type !== undefined;
    }
}

/* *********************************************** BasePopServiceInfo *********************************************** */
export const POPSERVICEINFO_SERVICE_OS = 'OS';
export const POPSERVICEINFO_SERVICE_AGENT = 'AGENT';
export const POPSERVICEINFO_SERVICE_GLCM = 'GLCM';
export const POPSERVICEINFO_SERVICE_S3_ADAPTER = 'S3_ADAPTER';
export const POPSERVICEINFO_SERVICE_JRE = 'JRE';
export const POPSERVICEINFO_SERVICE_DOCKER = 'DOCKER';
export const POPSERVICEINFO_SERVICE_AIDE = 'AIDE';
export const POPSERVICEINFO_SERVICE_RTS = 'RTS';
export const POPSERVICEINFO_SERVICE_FM_MANAGEMENT = 'FM_MANAGEMENT';
export const POPSERVICEINFO_SERVICE_FM_LOG_COLLECTOR = 'FM_LOG_COLLECTOR';
export const POPSERVICEINFO_SERVICE_FM_METRICS_COLLECTOR = 'FM_METRICS_COLLECTOR';
export const POPSERVICEINFO_SERVICE_BRE = 'BRE';
export const POPSERVICEINFO_SERVICE_BRF = 'BRF';
export const POPSERVICEINFO_SERVICE_REVERSE_PROXY = 'REVERSE_PROXY';
export const POPSERVICEINFO_SERVICE_FORWARD_PROXY = 'FORWARD_PROXY';
export const POPSERVICEINFO_SERVICE_DNS = 'DNS';
export const POPSERVICEINFO_SERVICE_NTP = 'NTP';
export const POPSERVICEINFO_SERVICE_LOGZ_LOG_COLLECTOR = 'LOGZ_LOG_COLLECTOR';

export enum POPSERVICEINFO_service {
   Agent = 'AGENT',
   Aide = 'AIDE',
   Bre = 'BRE',
   Brf = 'BRF',
   Dns = 'DNS',
   Docker = 'DOCKER',
   Fm_log_collector = 'FM_LOG_COLLECTOR',
   Fm_management = 'FM_MANAGEMENT',
   Fm_metrics_collector = 'FM_METRICS_COLLECTOR',
   Forward_proxy = 'FORWARD_PROXY',
   Glcm = 'GLCM',
   Jre = 'JRE',
   Logz_log_collector = 'LOGZ_LOG_COLLECTOR',
   Ntp = 'NTP',
   Os = 'OS',
   Reverse_proxy = 'REVERSE_PROXY',
   Rts = 'RTS',
   S3_adapter = 'S3_ADAPTER'
}

export class BasePopServiceInfo {
    // required: service
    public  build  : string;    // description: The service build number.
    public  cln    : string;    // description: The service change set number.
    public  service: string;    // description: An enum of PoP related services (including os platform and JRE).,
                                // enum: ['OS', 'AGENT', 'GLCM', 'S3_ADAPTER', 'JRE', 'DOCKER', 'AIDE', 'RTS',
                                // 'FM_MANAGEMENT', 'FM_LOG_COLLECTOR', 'FM_METRICS_COLLECTOR', 'BRE', 'BRF',
                                // 'REVERSE_PROXY', 'FORWARD_PROXY', 'DNS', 'NTP', 'LOGZ_LOG_COLLECTOR']
    public  version: string;    // description: The service API version.
    constructor (json?: any) {
        if (json) {
            this.build = json['build'];
            this.cln = json['cln'];
            this.service = json['service'];
            this.version = json['version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.service !== undefined;
    }
}

/* ************************************************** BasePopInfo *************************************************** */
export class BasePopInfo {
    // required: ami_infos
    public  ami_infos    : any;    // description: A map of [region name of PoP / PoP-AMI]:[PopAmiInfo].
    public  created_at   : string;    // description: The PopInfo (or PoP AMI) created time. Using ISO 8601 date-time
                                   // pattern., format: date-time
    public  id           : string;    // description: UUID of the PopInfo, format: UUID
    public  service_infos: any;    // description: A map of [service type]:[PopServiceInfo]
    constructor (json?: any) {
        if (json) {
            this.ami_infos = json['ami_infos'];
            this.created_at = json['created_at'];
            this.id = json['id'];
            this.service_infos = json['service_infos'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.ami_infos !== undefined;
    }
}

/* ***************************************** BasePopServiceLifeCycleSpecV1 ****************************************** */
export class BasePopServiceLifeCycleSpecV1 {
    public  serviceParams: any;    // description: Pop tenant Service lifecycle spec is a hashmap with key as tenant
                                   // service name and value is param string required for perfoming lifecycle
                                   // action.
    constructor (json?: any) {
        if (json) {
            this.serviceParams = json['serviceParams'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.serviceParams !== undefined;
    }
}

/* ********************************************** BasePopServiceStatus ********************************************** */
export const POPSERVICESTATUS_SDDC_DEPENDENCY_CRITICAL = 'CRITICAL';
export const POPSERVICESTATUS_SDDC_DEPENDENCY_OPTIONAL = 'OPTIONAL';
export const POPSERVICESTATUS_SDDC_DEPENDENCY_INSTALL_ONLY = 'INSTALL_ONLY';
export const POPSERVICESTATUS_SDDC_DEPENDENCY_PROVISION_ONLY = 'PROVISION_ONLY';
export const POPSERVICESTATUS_SERVICE_GLCM = 'GLCM';
export const POPSERVICESTATUS_SERVICE_S3_ADAPTER = 'S3_ADAPTER';
export const POPSERVICESTATUS_SERVICE_DOCKER = 'DOCKER';
export const POPSERVICESTATUS_SERVICE_RTS = 'RTS';
export const POPSERVICESTATUS_SERVICE_FM_MANAGEMENT = 'FM_MANAGEMENT';
export const POPSERVICESTATUS_SERVICE_FM_LOG_COLLECTOR = 'FM_LOG_COLLECTOR';
export const POPSERVICESTATUS_SERVICE_FM_METRICS_COLLECTOR = 'FM_METRICS_COLLECTOR';
export const POPSERVICESTATUS_SERVICE_BRE = 'BRE';
export const POPSERVICESTATUS_SERVICE_BRF = 'BRF';
export const POPSERVICESTATUS_SERVICE_FORWARD_PROXY = 'FORWARD_PROXY';
export const POPSERVICESTATUS_SERVICE_DNS = 'DNS';
export const POPSERVICESTATUS_SERVICE_NTP = 'NTP';
export const POPSERVICESTATUS_SERVICE_LOGZ_LOG_COLLECTOR = 'LOGZ_LOG_COLLECTOR';
export const POPSERVICESTATUS_SERVICE_SCHEDULER = 'SCHEDULER';
export const POPSERVICESTATUS_SERVICE_INSTALL = 'INSTALL';
export const POPSERVICESTATUS_STATUS_UP = 'UP';
export const POPSERVICESTATUS_STATUS_DOWN = 'DOWN';

export enum POPSERVICESTATUS_sddcdependency {
   Critical = 'CRITICAL',
   Install_only = 'INSTALL_ONLY',
   Optional = 'OPTIONAL',
   Provision_only = 'PROVISION_ONLY'
}

export enum POPSERVICESTATUS_service {
   Bre = 'BRE',
   Brf = 'BRF',
   Dns = 'DNS',
   Docker = 'DOCKER',
   Fm_log_collector = 'FM_LOG_COLLECTOR',
   Fm_management = 'FM_MANAGEMENT',
   Fm_metrics_collector = 'FM_METRICS_COLLECTOR',
   Forward_proxy = 'FORWARD_PROXY',
   Glcm = 'GLCM',
   Install = 'INSTALL',
   Logz_log_collector = 'LOGZ_LOG_COLLECTOR',
   Ntp = 'NTP',
   Rts = 'RTS',
   S3_adapter = 'S3_ADAPTER',
   Scheduler = 'SCHEDULER'
}

export enum POPSERVICESTATUS_status {
   Down = 'DOWN',
   Up = 'UP'
}

export class BasePopServiceStatus {
    public  message        : string;    // description: The service status message.
    public  sddc_dependency: string;    // description: The service dependency for the SDDC, enum: ['CRITICAL',
                                        // 'OPTIONAL', 'INSTALL_ONLY', 'PROVISION_ONLY']
    public  service        : string;    // description: Deprecated. An enum of services which are required for status
                                // checking., enum: ['GLCM', 'S3_ADAPTER', 'DOCKER', 'RTS', 'FM_MANAGEMENT',
                                // 'FM_LOG_COLLECTOR', 'FM_METRICS_COLLECTOR', 'BRE', 'BRF', 'FORWARD_PROXY', 'DNS',
                                // 'NTP', 'LOGZ_LOG_COLLECTOR', 'SCHEDULER', 'INSTALL']
    public  service_id     : string;    // description: The name of the service.
    public  status         : string;    // description: The service status. A enum., enum: ['UP', 'DOWN']
    constructor (json?: any) {
        if (json) {
            this.message = json['message'];
            this.sddc_dependency = json['sddc_dependency'];
            this.service = json['service'];
            this.service_id = json['service_id'];
            this.status = json['status'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.message !== undefined
            && this.sddc_dependency !== undefined
            && this.service !== undefined
            && this.service_id !== undefined
            && this.status !== undefined;
    }
}

/* *************************************************** BaseRegion *************************************************** */
export class BaseRegion {
    public  name  : string;
    public  region: string;
    constructor (json?: any) {
        if (json) {
            this.name = json['name'];
            this.region = json['region'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.name !== undefined
            && this.region !== undefined;
    }
}

/* ********************************************* BaseReportUsageRecord ********************************************** */
export class BaseReportUsageRecord {
    public  billable_usages    : Array<BaseBillableUsage>;
    public  service_internal_id: string;    // description: the service internal id
    public  subscription_link  : string;    // description: csp subscription link
    public  timestamp          : string;    // description: timestamp of the record
    constructor (json?: any) {
        if (json) {
            
            if (json['billable_usages']) {
                this.billable_usages = [];
                for (let item of json['billable_usages']) {
                    this.billable_usages.push(Object.assign(new BaseBillableUsage(item), item));
                }
            }
            this.service_internal_id = json['service_internal_id'];
            this.subscription_link = json['subscription_link'];
            this.timestamp = json['timestamp'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.billable_usages !== undefined
            && this.service_internal_id !== undefined
            && this.subscription_link !== undefined
            && this.timestamp !== undefined;
    }
}

/* ************************************************ BaseErrorRecord ************************************************* */
export class BaseErrorRecord {
    public  csp_error_code: string;    // description: csp error code
    public  record_id     : string;    // description: record identifier
    public  record_payload: BaseReportUsageRecord;
    constructor (json?: any) {
        if (json) {
            this.csp_error_code = json['csp_error_code'];
            this.record_id = json['record_id'];
            this.record_payload = new BaseReportUsageRecord(json['record_payload']);
            Object.assign(this.record_payload, json['record_payload']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.csp_error_code !== undefined
            && this.record_id !== undefined
            && this.record_payload !== undefined;
    }
}

/* ************************************************ BaseReservation ************************************************* */
export class BaseReservation {
    public  create_time: string;    // description: Optional
    public  duration   : number;    // description: Duration - required for reservation in maintenance window, format:
                                 // int64
    public  metadata   : any;    // description: Optional
    public  rid        : string;    // description: Reservation ID, format: uuid
    public  start_time : string;    // description: Start time of a reservation, format: date-time
    constructor (json?: any) {
        if (json) {
            this.create_time = json['create_time'];
            this.duration = json['duration'];
            this.metadata = json['metadata'];
            this.rid = json['rid'];
            this.start_time = json['start_time'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.create_time !== undefined
            && this.duration !== undefined
            && this.metadata !== undefined
            && this.rid !== undefined
            && this.start_time !== undefined;
    }
}

/* ********************************************** BaseReservationInMw *********************************************** */
export class BaseReservationInMw {
    public  create_time: string;    // description: Optional, format: date-time
    public  metadata   : any;    // description: Optional
    public  rid        : string;    // description: Reservation ID, format: uuid
    public  week_of    : string;    // description: SUNDAY of the week that maintenance is scheduled, ISO format date
    constructor (json?: any) {
        if (json) {
            this.create_time = json['create_time'];
            this.metadata = json['metadata'];
            this.rid = json['rid'];
            this.week_of = json['week_of'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.create_time !== undefined
            && this.metadata !== undefined
            && this.rid !== undefined
            && this.week_of !== undefined;
    }
}

/* ******************************************** BaseReservationSchedule ********************************************* */
export class BaseReservationSchedule extends BaseMaintenanceWindowGet {
    public  reservations   : Array<BaseReservation>;
    public  reservations_mw: Array<BaseReservationInMw>;
    constructor (json?: any) {
        super(json);
        if (json) {
            
            if (json['reservations']) {
                this.reservations = [];
                for (let item of json['reservations']) {
                    this.reservations.push(Object.assign(new BaseReservation(item), item));
                }
            }
            
            if (json['reservations_mw']) {
                this.reservations_mw = [];
                for (let item of json['reservations_mw']) {
                    this.reservations_mw.push(Object.assign(new BaseReservationInMw(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.reservations !== undefined
            && this.reservations_mw !== undefined;
    }
}

/* ******************************************* BaseMaintenanceWindowEntry ******************************************* */
export class BaseMaintenanceWindowEntry {
    public  in_maintenance_mode  : boolean;    // description: true if the SDDC is currently undergoing maintenance
    public  in_maintenance_window: boolean;    // description: true if the SDDC is in the defined Mainentance Window
    public  reservation_id       : string;    // description: ID for reservation, format: uuid
    public  reservation_schedule : BaseReservationSchedule;
    public  sddc_id              : string;    // description: SDDC ID for this reservation, format: uuid
    constructor (json?: any) {
        if (json) {
            this.in_maintenance_mode = json['in_maintenance_mode'];
            this.in_maintenance_window = json['in_maintenance_window'];
            this.reservation_id = json['reservation_id'];
            this.reservation_schedule = new BaseReservationSchedule(json['reservation_schedule']);
            Object.assign(this.reservation_schedule, json['reservation_schedule']);
            this.sddc_id = json['sddc_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.in_maintenance_mode !== undefined
            && this.in_maintenance_window !== undefined
            && this.reservation_id !== undefined
            && this.reservation_schedule !== undefined
            && this.sddc_id !== undefined;
    }
}

/* ******************************************** BaseReverseProxyEpConfig ******************************************** */
export const REVERSEPROXYEPCONFIG_SERVER_TYPE_SERVER_443 = 'SERVER_443';
export const REVERSEPROXYEPCONFIG_SERVER_TYPE_SERVER_9443 = 'SERVER_9443';

export enum REVERSEPROXYEPCONFIG_servertype {
   Server_443 = 'SERVER_443',
   Server_9443 = 'SERVER_9443'
}

export class BaseReverseProxyEpConfig {
    public  endpoint       : string;    // description: required. the endpoint in PoP URL link. e.g. the full reverse proxy
                                 // endpoint url is https://<pop fqdn><endpoint>
    public  location_config: string;    // description: required in post. the nginx location directive content. It
                                        // must be wrapped with "{.....}".
    public  server_type    : string;    // description: the PoP reverse proxy virtual server type. optional. default is
                                    // SERVER_443, enum: ['SERVER_443', 'SERVER_9443']
    constructor (json?: any) {
        if (json) {
            this.endpoint = json['endpoint'];
            this.location_config = json['location_config'];
            this.server_type = json['server_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.endpoint !== undefined
            && this.location_config !== undefined
            && this.server_type !== undefined;
    }
}

/* ************************************************* BaseSddcAlert ************************************************** */
export class BaseSddcAlert {
    // required: alert_type, sddc_id, timestamp
    public  alert_type: string;    // description: Identifies the specific alert type
    public  sddc_id   : string;
    public  timestamp : string;    // format: date-time
    constructor (json?: any) {
        if (json) {
            this.alert_type = json['alert_type'];
            this.sddc_id = json['sddc_id'];
            this.timestamp = json['timestamp'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.alert_type !== undefined
            && this.sddc_id !== undefined
            && this.timestamp !== undefined;
    }
}

/* ****************************************** BaseSddcAllocatePublicIpSpec ****************************************** */
export class BaseSddcAllocatePublicIpSpec {
    // required: count
    public  count      : number;    // format: int32
    public  names      : Array<string>;    // description: List of names for the workload VM public IP assignment.
    public  private_ips: Array<string>;    // description: List of workload VM private IPs to be assigned the public
                                           // IP just allocated.
    constructor (json?: any) {
        if (json) {
            this.count = json['count'];
            this.names = json['names'];
            this.private_ips = json['private_ips'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.count !== undefined;
    }
}

/* *********************************************** BaseSddcCapability *********************************************** */
export class BaseSddcCapability {
    public  add_cluster        : boolean;
    public  add_hosts          : boolean;
    public  auto_remediation   : boolean;
    public  draas              : boolean;
    public  planned_maintenance: boolean;
    public  remove_cluster     : boolean;
    public  remove_hosts       : boolean;
    public  scale_up           : boolean;
    public  sddc_monitoring    : boolean;
    public  sddc_patching      : boolean;
    public  sddc_type          : string;    // description: describes the type of sddc "1NODE","DEFAULT"
    constructor (json?: any) {
        if (json) {
            this.add_cluster = json['add_cluster'];
            this.add_hosts = json['add_hosts'];
            this.auto_remediation = json['auto_remediation'];
            this.draas = json['draas'];
            this.planned_maintenance = json['planned_maintenance'];
            this.remove_cluster = json['remove_cluster'];
            this.remove_hosts = json['remove_hosts'];
            this.scale_up = json['scale_up'];
            this.sddc_monitoring = json['sddc_monitoring'];
            this.sddc_patching = json['sddc_patching'];
            this.sddc_type = json['sddc_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.add_cluster !== undefined
            && this.add_hosts !== undefined
            && this.auto_remediation !== undefined
            && this.draas !== undefined
            && this.planned_maintenance !== undefined
            && this.remove_cluster !== undefined
            && this.remove_hosts !== undefined
            && this.scale_up !== undefined
            && this.sddc_monitoring !== undefined
            && this.sddc_patching !== undefined
            && this.sddc_type !== undefined;
    }
}

/* ******************************************** BaseSddcCertificateInfo ********************************************* */
export class BaseSddcCertificateInfo {
    public  certificate: string;    // description: PEM encoded certificate
    public  entity     : string;    // description: the entity ID
    public  fingerprint: string;    // description: certificate fingerprint
    public  serial_num : string;    // description: vendor specific serial number
    constructor (json?: any) {
        if (json) {
            this.certificate = json['certificate'];
            this.entity = json['entity'];
            this.fingerprint = json['fingerprint'];
            this.serial_num = json['serial_num'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.certificate !== undefined
            && this.entity !== undefined
            && this.fingerprint !== undefined
            && this.serial_num !== undefined;
    }
}

/* **************************************** BaseSddcConnectionDeleteRequest ***************************************** */
export class BaseSddcConnectionDeleteRequest {
    public  sddc_connection_ids: Array<string>;    // description: The list of sddc connections (by ID) to remove.
    constructor (json?: any) {
        if (json) {
            this.sddc_connection_ids = json['sddc_connection_ids'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.sddc_connection_ids !== undefined;
    }
}

/* *********************************************** BaseSddcLinkConfig *********************************************** */
export class BaseSddcLinkConfig {
    public  connected_account_id: string;    // description: Determines which connected customer account to link to
    public  customer_subnet_ids : Array<string>;    // description: A list of AWS subnet IDs to create links to in
                                                   // the customer's account
    constructor (json?: any) {
        if (json) {
            this.connected_account_id = json['connected_account_id'];
            this.customer_subnet_ids = json['customer_subnet_ids'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.connected_account_id !== undefined
            && this.customer_subnet_ids !== undefined;
    }
}

/* ******************************************* BaseSddcManagerCredentials ******************************************* */
export class BaseSddcManagerCredentials {
    public  rest_api_credential   : BaseCredential;    // description: Restful API credential of the Sddc Node Manager
    public  root_credential       : BaseCredential;    // description: root user credential of the Sddc Node Manager
    public  sddc_manager_pwd      : string;
    public  second_user_credential: BaseCredential;    // description: second user credential of the Sddc Node
                                                       // Manager
    constructor (json?: any) {
        if (json) {
            this.rest_api_credential = new BaseCredential(json['rest_api_credential']);
            Object.assign(this.rest_api_credential, json['rest_api_credential']);
            this.root_credential = new BaseCredential(json['root_credential']);
            Object.assign(this.root_credential, json['root_credential']);
            this.sddc_manager_pwd = json['sddc_manager_pwd'];
            this.second_user_credential = new BaseCredential(json['second_user_credential']);
            Object.assign(this.second_user_credential, json['second_user_credential']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.rest_api_credential !== undefined
            && this.root_credential !== undefined
            && this.sddc_manager_pwd !== undefined
            && this.second_user_credential !== undefined;
    }
}

/* ************************************************ BaseSddcManifest ************************************************ */
export class BaseSddcManifest {
    public  esx_ami             : BaseAmiInfo;
    public  esx_nsxt_ami        : BaseAmiInfo;
    public  glcm_bundle         : BaseGlcmBundle;
    public  metadata            : BaseMetadata;
    public  pop_info            : BasePopInfo;
    public  vmc_internal_version: string;    // description: the vmcInternalVersion of the sddc for internal use
    public  vmc_version         : string;    // description: the vmcVersion of the sddc for display
    constructor (json?: any) {
        if (json) {
            this.esx_ami = new BaseAmiInfo(json['esx_ami']);
            Object.assign(this.esx_ami, json['esx_ami']);
            this.esx_nsxt_ami = new BaseAmiInfo(json['esx_nsxt_ami']);
            Object.assign(this.esx_nsxt_ami, json['esx_nsxt_ami']);
            this.glcm_bundle = new BaseGlcmBundle(json['glcm_bundle']);
            Object.assign(this.glcm_bundle, json['glcm_bundle']);
            this.metadata = new BaseMetadata(json['metadata']);
            Object.assign(this.metadata, json['metadata']);
            this.pop_info = new BasePopInfo(json['pop_info']);
            Object.assign(this.pop_info, json['pop_info']);
            this.vmc_internal_version = json['vmc_internal_version'];
            this.vmc_version = json['vmc_version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.esx_ami !== undefined
            && this.esx_nsxt_ami !== undefined
            && this.glcm_bundle !== undefined
            && this.metadata !== undefined
            && this.pop_info !== undefined
            && this.vmc_internal_version !== undefined
            && this.vmc_version !== undefined;
    }
}

/* ************************************************* BaseSddcConfig ************************************************* */
export const SDDCCONFIG_DEPLOYMENT_TYPE_SINGLEAZ = 'SingleAZ';
export const SDDCCONFIG_DEPLOYMENT_TYPE_MULTIAZ = 'MultiAZ';
export const SDDCCONFIG_PROVIDER_AWS = 'AWS';

export enum SDDCCONFIG_deploymenttype {
   Multiaz = 'MultiAZ',
   Singleaz = 'SingleAZ'
}

export enum SDDCCONFIG_provider {
   Aws = 'AWS'
}

export class BaseSddcConfig {
    // required: provider, name, num_hosts
    public  account_link_config     : BaseAccountLinkConfig;    // description: The account linking configuration, we
                                                           // will keep this one and remove accountLinkSddcConfig
                                                           // finally.
    public  account_link_sddc_config: Array<BaseAccountLinkSddcConfig>;    // description: A list of the SDDC
                                                                           // linking configurations to use.
    public  deployment_type         : string;    // description: Denotes if request is for a SingleAZ or a MultiAZ SDDC.
                                        // Default is SingleAZ., enum: ['SingleAZ', 'MultiAZ']
    public  name                    : string;
    public  num_hosts               : number;    // format: int32
    public  provider                : string;    // description: Determines what additional properties are available based on cloud
                                 // provider., enum: ['AWS']
    public  sddc_manifest           : BaseSddcManifest;    // x-vmw-vmc-exclude: client
    public  sddc_template_id        : string;    // description: If provided, configuration from the template will applied
                                         // to the provisioned SDDC., format: UUID
    public  sddc_type               : string;    // description: Denotes the sddc type , if the value is null or empty, the type is
                                  // considered as default.
    public  sso_domain              : string;    // default: vmc.local, description: The SSO domain name to use for vSphere users.
                                   // If not specified, vmc.local will be used.
    public  vpc_cidr                : string;    // default: 10.0.0.0/16, description: AWS VPC IP range. Only prefix of 16 or 20 is
                                 // currently supported.
    public  vxlan_subnet            : string;    // description: VXLAN IP subnet
    constructor (json?: any) {
        if (json) {
            this.account_link_config = new BaseAccountLinkConfig(json['account_link_config']);
            Object.assign(this.account_link_config, json['account_link_config']);
            
            if (json['account_link_sddc_config']) {
                this.account_link_sddc_config = [];
                for (let item of json['account_link_sddc_config']) {
                    this.account_link_sddc_config.push(Object.assign(new BaseAccountLinkSddcConfig(item), item));
                }
            }
            this.deployment_type = json['deployment_type'];
            this.name = json['name'];
            this.num_hosts = json['num_hosts'];
            this.provider = json['provider'];
            this.sddc_manifest = new BaseSddcManifest(json['sddc_manifest']);
            Object.assign(this.sddc_manifest, json['sddc_manifest']);
            this.sddc_template_id = json['sddc_template_id'];
            this.sddc_type = json['sddc_type'];
            this.sso_domain = json['sso_domain'];
            this.vpc_cidr = json['vpc_cidr'];
            this.vxlan_subnet = json['vxlan_subnet'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.name !== undefined
            && this.num_hosts !== undefined
            && this.provider !== undefined;
    }
}

/* *********************************************** BaseAwsSddcConfig ************************************************ */
export class BaseAwsSddcConfig extends BaseSddcConfig {
    // required: region
    public  agent_build_number: string;    // x-vmw-vmc-exclude: client
    public  esx_ami           : string;    // x-vmw-vmc-exclude: client
    public  glcm_build_number : string;    // x-vmw-vmc-exclude: client
    public  region            : string;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.agent_build_number = json['agent_build_number'];
            this.esx_ami = json['esx_ami'];
            this.glcm_build_number = json['glcm_build_number'];
            this.region = json['region'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.region !== undefined;
    }
}

/* ******************************************** BaseSddcProvisioningSpec ******************************************** */
export class BaseSddcProvisioningSpec {
    public  default_hosts_per_sddc      : number;    // description: The default number of hosts a sddc can have
    public  expire_after_in_days        : number;    // description: Indicates after how many days the sddc should expire
    public  max_clusters_per_sddc       : number;    // description: The maximum number of clusters an sddc can have during
                                              // provisioning
    public  max_hosts_per_sddc          : number;    // description: Maximum number hosts a sddc can have
    public  max_hosts_per_sddc_on_create: number;    // description: Maximum number hosts a sddc should have on
                                                     // initial sddc creation
    public  min_hosts_per_sddc          : number;    // description: Minimum number hosts a sddc in an org can have
    public  sddc_type                   : string;    // description: The type of sddc (not an ENUM because when more types can get
                                  // added it needs code change)
    constructor (json?: any) {
        if (json) {
            this.default_hosts_per_sddc = json['default_hosts_per_sddc'];
            this.expire_after_in_days = json['expire_after_in_days'];
            this.max_clusters_per_sddc = json['max_clusters_per_sddc'];
            this.max_hosts_per_sddc = json['max_hosts_per_sddc'];
            this.max_hosts_per_sddc_on_create = json['max_hosts_per_sddc_on_create'];
            this.min_hosts_per_sddc = json['min_hosts_per_sddc'];
            this.sddc_type = json['sddc_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.default_hosts_per_sddc !== undefined
            && this.expire_after_in_days !== undefined
            && this.max_clusters_per_sddc !== undefined
            && this.max_hosts_per_sddc !== undefined
            && this.max_hosts_per_sddc_on_create !== undefined
            && this.min_hosts_per_sddc !== undefined
            && this.sddc_type !== undefined;
    }
}

/* ************************************************ BaseSddcPublicIp ************************************************ */
export class BaseSddcPublicIp {
    // required: public_ip
    public  allocation_id        : string;
    public  associated_private_ip: string;
    public  dnat_rule_id         : string;
    public  name                 : string;
    public  public_ip            : string;
    public  snat_rule_id         : string;
    constructor (json?: any) {
        if (json) {
            this.allocation_id = json['allocation_id'];
            this.associated_private_ip = json['associated_private_ip'];
            this.dnat_rule_id = json['dnat_rule_id'];
            this.name = json['name'];
            this.public_ip = json['public_ip'];
            this.snat_rule_id = json['snat_rule_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.public_ip !== undefined;
    }
}

/* ************************************************* BaseAwsEsxHost ************************************************* */
export class BaseAwsEsxHost extends BaseEsxHost {
    public  instance_id            : string;    // x-vmw-vmc-exclude: client
    public  internal_public_ip_pool: Array<BaseSddcPublicIp>;
    public  launch_host            : boolean;    // x-vmw-vmc-exclude: client
    constructor (json?: any) {
        super(json);
        if (json) {
            this.instance_id = json['instance_id'];
            
            if (json['internal_public_ip_pool']) {
                this.internal_public_ip_pool = [];
                for (let item of json['internal_public_ip_pool']) {
                    this.internal_public_ip_pool.push(Object.assign(new BaseSddcPublicIp(item), item));
                }
            }
            this.launch_host = json['launch_host'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.instance_id !== undefined
            && this.internal_public_ip_pool !== undefined
            && this.launch_host !== undefined;
    }
}

/* ************************************************** BaseSddcSpec ************************************************** */
export class BaseSddcSpec {
    public  bundle_spec  : any;    // description: Imaging bundle repo
    public  cluster_specs: Array<any>;    // description: VC Cluster definition spec
    public  dnsSpec      : any;    // description: DNS spec
    public  dvsSpecs     : Array<any>;    // description: DVS Spec
    public  esxiHostSpecs: Array<any>;    // description: ESXi Spec
    public  networkSpecs : Array<any>;    // description: a network spec
    public  nsxSpecs     : Array<any>;    // description: a network spec
    public  ntpSpec      : any;    // description: NTP spec
    public  sddcId       : string;    // description: UUID of the sddc, format: UUID
    public  vCenterSpecs : Array<any>;    // description: a VC spec
    public  vsanSpecs    : Array<any>;    // description: a VSAN spec
    constructor (json?: any) {
        if (json) {
            this.bundle_spec = json['bundle_spec'];
            this.cluster_specs = json['cluster_specs'];
            this.dnsSpec = json['dnsSpec'];
            this.dvsSpecs = json['dvsSpecs'];
            this.esxiHostSpecs = json['esxiHostSpecs'];
            this.networkSpecs = json['networkSpecs'];
            this.nsxSpecs = json['nsxSpecs'];
            this.ntpSpec = json['ntpSpec'];
            this.sddcId = json['sddcId'];
            this.vCenterSpecs = json['vCenterSpecs'];
            this.vsanSpecs = json['vsanSpecs'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.bundle_spec !== undefined
            && this.cluster_specs !== undefined
            && this.dnsSpec !== undefined
            && this.dvsSpecs !== undefined
            && this.esxiHostSpecs !== undefined
            && this.networkSpecs !== undefined
            && this.nsxSpecs !== undefined
            && this.ntpSpec !== undefined
            && this.sddcId !== undefined
            && this.vCenterSpecs !== undefined
            && this.vsanSpecs !== undefined;
    }
}

/* ****************************************** BaseSddcUpgradeEventRequest ******************************************* */
export const SDDCUPGRADEEVENTREQUEST_UPGRADE_EVENT_STATUS_IN_PROGRESS = 'IN_PROGRESS';
export const SDDCUPGRADEEVENTREQUEST_UPGRADE_EVENT_STATUS_FAILED = 'FAILED';
export const SDDCUPGRADEEVENTREQUEST_UPGRADE_EVENT_STATUS_SUCCESS = 'SUCCESS';
export const SDDCUPGRADEEVENTREQUEST_UPGRADE_EVENT_TYPE_PRE_UPGRADE = 'PRE_UPGRADE';
export const SDDCUPGRADEEVENTREQUEST_UPGRADE_EVENT_TYPE_PRE_UPGRADE_ROLLBACK = 'PRE_UPGRADE_ROLLBACK';
export const SDDCUPGRADEEVENTREQUEST_UPGRADE_EVENT_TYPE_POST_CONTROL_PLANE_UPGRADE = 'POST_CONTROL_PLANE_UPGRADE';

export enum SDDCUPGRADEEVENTREQUEST_upgradeeventstatus {
   Failed = 'FAILED',
   In_progress = 'IN_PROGRESS',
   Success = 'SUCCESS'
}

export enum SDDCUPGRADEEVENTREQUEST_upgradeeventtype {
   Post_control_plane_upgrade = 'POST_CONTROL_PLANE_UPGRADE',
   Pre_upgrade = 'PRE_UPGRADE',
   Pre_upgrade_rollback = 'PRE_UPGRADE_ROLLBACK'
}

export class BaseSddcUpgradeEventRequest {
    // required: sddc_id, vmc_version_to, fsm_id, upgrade_event_type
    public  fsm_id              : string;
    public  sddc_id             : string;
    public  upgrade_event_status: string;    // enum: ['IN_PROGRESS', 'FAILED', 'SUCCESS']
    public  upgrade_event_type  : string;    // enum: ['PRE_UPGRADE', 'PRE_UPGRADE_ROLLBACK',
                                           // 'POST_CONTROL_PLANE_UPGRADE']
    public  vmc_version_to      : string;
    constructor (json?: any) {
        if (json) {
            this.fsm_id = json['fsm_id'];
            this.sddc_id = json['sddc_id'];
            this.upgrade_event_status = json['upgrade_event_status'];
            this.upgrade_event_type = json['upgrade_event_type'];
            this.vmc_version_to = json['vmc_version_to'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.fsm_id !== undefined
            && this.sddc_id !== undefined
            && this.upgrade_event_type !== undefined
            && this.vmc_version_to !== undefined;
    }
}

/* ********************************************* BaseSddcVpnStateAlert ********************************************** */
export const SDDCVPNSTATEALERT_NEW_STATE_CONNECTED = 'CONNECTED';
export const SDDCVPNSTATEALERT_NEW_STATE_DISCONNECTED = 'DISCONNECTED';
export const SDDCVPNSTATEALERT_NEW_STATE_UNKNOWN = 'UNKNOWN';
export const SDDCVPNSTATEALERT_OLD_STATE_CONNECTED = 'CONNECTED';
export const SDDCVPNSTATEALERT_OLD_STATE_DISCONNECTED = 'DISCONNECTED';
export const SDDCVPNSTATEALERT_OLD_STATE_UNKNOWN = 'UNKNOWN';

export enum SDDCVPNSTATEALERT_newstate {
   Connected = 'CONNECTED',
   Disconnected = 'DISCONNECTED',
   Unknown = 'UNKNOWN'
}

export enum SDDCVPNSTATEALERT_oldstate {
   Connected = 'CONNECTED',
   Disconnected = 'DISCONNECTED',
   Unknown = 'UNKNOWN'
}

export class BaseSddcVpnStateAlert extends BaseSddcAlert {
    public  edge_id     : string;
    public  local_subnet: string;
    public  new_state   : string;    // enum: ['CONNECTED', 'DISCONNECTED', 'UNKNOWN']
    public  old_state   : string;    // enum: ['CONNECTED', 'DISCONNECTED', 'UNKNOWN']
    public  peer_subnet : string;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.edge_id = json['edge_id'];
            this.local_subnet = json['local_subnet'];
            this.new_state = json['new_state'];
            this.old_state = json['old_state'];
            this.peer_subnet = json['peer_subnet'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.edge_id !== undefined
            && this.local_subnet !== undefined
            && this.new_state !== undefined
            && this.old_state !== undefined
            && this.peer_subnet !== undefined;
    }
}

/* ************************************************ BaseServiceError ************************************************ */
export class BaseServiceError {
    // required: error_code, original_service, original_service_error_code
    public  default_message            : string;    // description: Error message in English.
    public  error_code                 : string;    // description: Localizable error code.
    public  localized_message          : string;    // description: The localized message.
    public  original_service           : string;    // description: The original service name of the error.
    public  original_service_error_code: string;    // description: The original error code of the service.
    public  params                     : Array<string>;    // description: The parameters of the service error.
    constructor (json?: any) {
        if (json) {
            this.default_message = json['default_message'];
            this.error_code = json['error_code'];
            this.localized_message = json['localized_message'];
            this.original_service = json['original_service'];
            this.original_service_error_code = json['original_service_error_code'];
            this.params = json['params'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.error_code !== undefined
            && this.original_service !== undefined
            && this.original_service_error_code !== undefined;
    }
}

/* ****************************************** BaseServiceInvitationDetail ******************************************* */
export class BaseServiceInvitationDetail {
    public  context                : any;
    public  expiration_time        : number;
    public  invitation_link        : string;
    public  service_definition_link: string;
    public  status                 : string;
    public  tos_signed_by          : string;
    constructor (json?: any) {
        if (json) {
            this.context = json['context'];
            this.expiration_time = json['expiration_time'];
            this.invitation_link = json['invitation_link'];
            this.service_definition_link = json['service_definition_link'];
            this.status = json['status'];
            this.tos_signed_by = json['tos_signed_by'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.context !== undefined
            && this.expiration_time !== undefined
            && this.invitation_link !== undefined
            && this.service_definition_link !== undefined
            && this.status !== undefined
            && this.tos_signed_by !== undefined;
    }
}

/* ****************************************** BaseServiceInvitationPreset ******************************************* */
export class BaseServiceInvitationPreset {
    public  description          : string;
    public  invitation_properties: any;
    public  preset_name          : string;    // description: A unique name to represent the preset. This should be used as
                                    // input to generate invites.
    constructor (json?: any) {
        if (json) {
            this.description = json['description'];
            this.invitation_properties = json['invitation_properties'];
            this.preset_name = json['preset_name'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.description !== undefined
            && this.invitation_properties !== undefined
            && this.preset_name !== undefined;
    }
}

/* ****************************************** BaseServiceInvitationRequest ****************************************** */
export class BaseServiceInvitationRequest {
    public  funds_required       : boolean;    // description: Override the preset to specify if the customer getting this
                                        // invite requires a fund or not.
    public  invitation_properties: any;    // description: Additional invitation properties. Please note if you
                                           // provide the same key as a preset, this will override that property.
    public  number_of_invitations: number;    // description: No of invitation links to be generated. Arbitrary
                                              // limit of 100.
    public  preset_name          : string;    // description: The name of the preset whose properties need to be attached to
                                    // the invitation. Use value from  ServiceInvitationPresets.preset_name
    constructor (json?: any) {
        if (json) {
            this.funds_required = json['funds_required'];
            this.invitation_properties = json['invitation_properties'];
            this.number_of_invitations = json['number_of_invitations'];
            this.preset_name = json['preset_name'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.funds_required !== undefined
            && this.invitation_properties !== undefined
            && this.number_of_invitations !== undefined
            && this.preset_name !== undefined;
    }
}

/* ****************************************** BaseServicesAvailableResult ******************************************* */
export class BaseServicesAvailableResult {
    public  serviceIds: Array<string>;    // description: A list of service IDs that can be used to further query,
                                          // enable, disable a given service.
    constructor (json?: any) {
        if (json) {
            this.serviceIds = json['serviceIds'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.serviceIds !== undefined;
    }
}

/* **************************************************** BaseSite **************************************************** */
export const SITE_TUNNEL_STATUS_CONNECTED = 'CONNECTED';
export const SITE_TUNNEL_STATUS_DISCONNECTED = 'DISCONNECTED';
export const SITE_TUNNEL_STATUS_UNKNOWN = 'UNKNOWN';

export enum SITE_tunnelstatus {
   Connected = 'CONNECTED',
   Disconnected = 'DISCONNECTED',
   Unknown = 'UNKNOWN'
}

export class BaseSite {
    public  dropped_rx_packets        : string;    // description: Number of received packets dropped., readOnly: True
    public  dropped_tx_packets        : string;    // description: Number of transmitted packets dropped., readOnly: True
    public  established_date          : string;    // description: Date tunnel was established., readOnly: True
    public  failure_message           : string;    // description: failure message., readOnly: True
    public  name                      : string;    // description: Unique name for the site getting configured.
    public  password                  : string;    // description: Site password.
    public  rx_bytes_on_local_subnet  : number;    // description: Bytes received on local network., format: int64,
                                                 // readOnly: True
    public  secure_traffic            : boolean;    // description: Enable/disable encription.
    public  tunnel_status             : string;    // description: Site tunnel status., enum: ['CONNECTED', 'DISCONNECTED',
                                      // 'UNKNOWN'], readOnly: True
    public  tx_bytes_from_local_subnet: number;    // description: Bytes transmitted from local subnet., format:
                                                   // int64, readOnly: True
    public  user_id                   : string;    // description: Site user id.
    constructor (json?: any) {
        if (json) {
            this.dropped_rx_packets = json['dropped_rx_packets'];
            this.dropped_tx_packets = json['dropped_tx_packets'];
            this.established_date = json['established_date'];
            this.failure_message = json['failure_message'];
            this.name = json['name'];
            this.password = json['password'];
            this.rx_bytes_on_local_subnet = json['rx_bytes_on_local_subnet'];
            this.secure_traffic = json['secure_traffic'];
            this.tunnel_status = json['tunnel_status'];
            this.tx_bytes_from_local_subnet = json['tx_bytes_from_local_subnet'];
            this.user_id = json['user_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.dropped_rx_packets !== undefined
            && this.dropped_tx_packets !== undefined
            && this.established_date !== undefined
            && this.failure_message !== undefined
            && this.name !== undefined
            && this.password !== undefined
            && this.rx_bytes_on_local_subnet !== undefined
            && this.secure_traffic !== undefined
            && this.tunnel_status !== undefined
            && this.tx_bytes_from_local_subnet !== undefined
            && this.user_id !== undefined;
    }
}

/* *************************************************** BaseL2Vpn **************************************************** */
export class BaseL2Vpn {
    public  enabled    : boolean;    // description: Enable (true) or disable (false) L2 VPN.
    public  listener_ip: string;    // description: Public uplink ip address. IP of external interface on which
                                    // L2VPN service listens to.
    public  sites      : Array<BaseSite>;    // description: Array of L2 vpn site config.
    constructor (json?: any) {
        if (json) {
            this.enabled = json['enabled'];
            this.listener_ip = json['listener_ip'];
            
            if (json['sites']) {
                this.sites = [];
                for (let item of json['sites']) {
                    this.sites.push(Object.assign(new BaseSite(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.enabled !== undefined
            && this.listener_ip !== undefined
            && this.sites !== undefined;
    }
}

/* ************************************************* BaseSksFeature ************************************************* */
export const SKSFEATURE_CATEGORY_UI = 'UI';
export const SKSFEATURE_CATEGORY_SERVICE = 'SERVICE';
export const SKSFEATURE_CATEGORY_E2E = 'E2E';
export const SKSFEATURE_STATE_ACTIVE = 'ACTIVE';
export const SKSFEATURE_STATE_OBSOLETE = 'OBSOLETE';
export const SKSFEATURE_STATE_NOT_FOUND = 'NOT_FOUND';
export const SKSFEATURE_TOGGLE_TYPE_GLOBAL = 'GLOBAL';
export const SKSFEATURE_TOGGLE_TYPE_TARGET_BY_SCOPE = 'TARGET_BY_SCOPE';
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

export enum SKSFEATURE_toggletype {
   Global = 'GLOBAL',
   Target_by_scope = 'TARGET_BY_SCOPE'
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
    public  toggle_type          : string;    // enum: ['GLOBAL', 'TARGET_BY_SCOPE']
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
            this.toggle_type = json['toggle_type'];
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
    public  applicable_scope: BaseApplicableScopePatchRequest;
    public  description     : string;
    public  enable          : boolean;
    constructor (json?: any) {
        if (json) {
            this.applicable_scope = new BaseApplicableScopePatchRequest(json['applicable_scope']);
            Object.assign(this.applicable_scope, json['applicable_scope']);
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
export const STORAGEVOLUME_PROVIDER_AWS = 'AWS';
export const STORAGEVOLUME_VOLUME_STATE_CREATING = 'CREATING';
export const STORAGEVOLUME_VOLUME_STATE_AVAILABLE = 'AVAILABLE';
export const STORAGEVOLUME_VOLUME_STATE_INUSE = 'INUSE';
export const STORAGEVOLUME_VOLUME_STATE_DELETING = 'DELETING';
export const STORAGEVOLUME_VOLUME_STATE_DELETED = 'DELETED';
export const STORAGEVOLUME_VOLUME_STATE_ERROR = 'ERROR';

export enum STORAGEVOLUME_provider {
   Aws = 'AWS'
}

export enum STORAGEVOLUME_volumestate {
   Available = 'AVAILABLE',
   Creating = 'CREATING',
   Deleted = 'DELETED',
   Deleting = 'DELETING',
   Error = 'ERROR',
   Inuse = 'INUSE'
}

export class BaseStorageVolume {
    // required: id, size, encrypted, creation_time, volume_state, provider
    public  creation_time: string;    // description: When the volume is successfully created, format: date-time
    public  encrypted    : boolean;    // description: Indicates whether the volume is encrypted
    public  id           : string;    // description: The unique identifier for the storage volume, format: uuid
    public  iops         : number;    // description: The IOPS capability of the volume, if known, format: int64
    public  provider     : string;    // description: The cloud provider for this volume, enum: ['AWS']
    public  size         : number;    // description: Size of the volume, in GiB, format: int64
    public  tags         : any;    // description: Tags assigned in the volume, in key-value form
    public  volume_state : string;    // description: The state of the volume, enum: ['CREATING', 'AVAILABLE',
                                     // 'INUSE', 'DELETING', 'DELETED', 'ERROR']
    constructor (json?: any) {
        if (json) {
            this.creation_time = json['creation_time'];
            this.encrypted = json['encrypted'];
            this.id = json['id'];
            this.iops = json['iops'];
            this.provider = json['provider'];
            this.size = json['size'];
            this.tags = json['tags'];
            this.volume_state = json['volume_state'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.creation_time !== undefined
            && this.encrypted !== undefined
            && this.id !== undefined
            && this.provider !== undefined
            && this.size !== undefined
            && this.volume_state !== undefined;
    }
}

/* ************************************************ BaseAwsEbsVolume ************************************************ */
export const AWSEBSVOLUME_VOLUME_TYPE_GP2 = 'gp2';
export const AWSEBSVOLUME_VOLUME_TYPE_IO1 = 'io1';
export const AWSEBSVOLUME_VOLUME_TYPE_ST1 = 'st1';
export const AWSEBSVOLUME_VOLUME_TYPE_SC1 = 'sc1';
export const AWSEBSVOLUME_VOLUME_TYPE_STANDARD = 'standard';

export enum AWSEBSVOLUME_volumetype {
   Gp2 = 'gp2',
   Io1 = 'io1',
   Sc1 = 'sc1',
   St1 = 'st1',
   Standard = 'standard'
}

export class BaseAwsEbsVolume extends BaseStorageVolume {
    // required: vendor_id, volume_type, availability_zone
    public  availability_zone: string;    // description: The availability zone in which the volume is created
    public  kms_key_id       : string;    // description: Identifier (key ID, key alias, ID ARN, or alias ARN) for a user-
                                   // managed CMK under which the EBS volume is encrypted.
    public  snapshot_id      : string;    // description: The snapshot from which the volume was created, if applicable
    public  vendor_id        : string;    // description: AWS-specific ID of the volume
    public  volume_type      : string;    // description: AWS type identifier for the volume, enum: ['gp2', 'io1', 'st1',
                                    // 'sc1', 'standard']
    constructor (json?: any) {
        super(json);
        if (json) {
            this.availability_zone = json['availability_zone'];
            this.kms_key_id = json['kms_key_id'];
            this.snapshot_id = json['snapshot_id'];
            this.vendor_id = json['vendor_id'];
            this.volume_type = json['volume_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.availability_zone !== undefined
            && this.vendor_id !== undefined
            && this.volume_type !== undefined;
    }
}

/* ****************************************** BaseStorageVolumeAttachment ******************************************* */
export const STORAGEVOLUMEATTACHMENT_ATTACH_STATE_ATTACHING = 'ATTACHING';
export const STORAGEVOLUMEATTACHMENT_ATTACH_STATE_ATTACHED = 'ATTACHED';
export const STORAGEVOLUMEATTACHMENT_ATTACH_STATE_DETACHING = 'DETACHING';
export const STORAGEVOLUMEATTACHMENT_ATTACH_STATE_DETACHED = 'DETACHED';
export const STORAGEVOLUMEATTACHMENT_ATTACH_STATE_BUSY = 'BUSY';
export const STORAGEVOLUMEATTACHMENT_PROVIDER_AWS = 'AWS';

export enum STORAGEVOLUMEATTACHMENT_attachstate {
   Attached = 'ATTACHED',
   Attaching = 'ATTACHING',
   Busy = 'BUSY',
   Detached = 'DETACHED',
   Detaching = 'DETACHING'
}

export enum STORAGEVOLUMEATTACHMENT_provider {
   Aws = 'AWS'
}

export class BaseStorageVolumeAttachment {
    // required: attach_time, esx_id, volume_id, attach_state, provider
    public  attach_state: string;    // description: The state of the attachment, enum: ['ATTACHING', 'ATTACHED',
                                     // 'DETACHING', 'DETACHED', 'BUSY']
    public  attach_time : string;    // description: The time when the volume became ATTACHED, format: date-time
    public  esx_id      : string;    // description: The unique ID of the ESX to which the volume is attached., format:
                               // uuid
    public  provider    : string;    // description: The cloud provider for this attachment, enum: ['AWS']
    public  volume_id   : string;    // description: The unique ID for the volume being attached., format: uuid
    constructor (json?: any) {
        if (json) {
            this.attach_state = json['attach_state'];
            this.attach_time = json['attach_time'];
            this.esx_id = json['esx_id'];
            this.provider = json['provider'];
            this.volume_id = json['volume_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.attach_state !== undefined
            && this.attach_time !== undefined
            && this.esx_id !== undefined
            && this.provider !== undefined
            && this.volume_id !== undefined;
    }
}

/* ******************************************* BaseAwsEbsVolumeAttachment ******************************************* */
export class BaseAwsEbsVolumeAttachment extends BaseStorageVolumeAttachment {
    // required: device, ebs_id, instance_id, delete_on_termination
    public  delete_on_termination: boolean;    // description: Volume to be deleted or not upon termination of
                                               // instance.
    public  device               : string;    // description: The name of the device the volume appears as in the instance.
    public  ebs_id               : string;    // description: The ID of the volume in the attachment.
    public  instance_id          : string;    // description: The ID of the instance in the attachment.
    constructor (json?: any) {
        super(json);
        if (json) {
            this.delete_on_termination = json['delete_on_termination'];
            this.device = json['device'];
            this.ebs_id = json['ebs_id'];
            this.instance_id = json['instance_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.delete_on_termination !== undefined
            && this.device !== undefined
            && this.ebs_id !== undefined
            && this.instance_id !== undefined;
    }
}

/* ************************************************* BaseSubnetInfo ************************************************* */
export class BaseSubnetInfo {
    public  availability_zone   : string;    // description: The availability zone (customer-centric) this subnet is
                                          // in.
    public  compatible          : boolean;    // description: Is this customer subnet compatible with the SDDC?
    public  connected_account_id: string;    // description: The ID of the connected account this subnet is from.
    public  name                : string;    // description: The name of the subnet. This is either the tagged name or the default
                             // AWS id it was given.
    public  note                : string;    // description: Why a subnet is marked as not compatible. May be blank if compatible.
    public  region_name         : string;    // description: The region this subnet is from.
    public  subnet_cidr_block   : string;    // description: The CIDR block of the subnet.
    public  subnet_id           : string;    // description: The ID of the subnet.
    public  vpc_cidr_block      : string;    // description: The CIDR block of the VPC containing this subnet.
    public  vpc_id              : string;    // description: The ID of the VPC this subnet resides in.
    constructor (json?: any) {
        if (json) {
            this.availability_zone = json['availability_zone'];
            this.compatible = json['compatible'];
            this.connected_account_id = json['connected_account_id'];
            this.name = json['name'];
            this.note = json['note'];
            this.region_name = json['region_name'];
            this.subnet_cidr_block = json['subnet_cidr_block'];
            this.subnet_id = json['subnet_id'];
            this.vpc_cidr_block = json['vpc_cidr_block'];
            this.vpc_id = json['vpc_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.availability_zone !== undefined
            && this.compatible !== undefined
            && this.connected_account_id !== undefined
            && this.name !== undefined
            && this.note !== undefined
            && this.region_name !== undefined
            && this.subnet_cidr_block !== undefined
            && this.subnet_id !== undefined
            && this.vpc_cidr_block !== undefined
            && this.vpc_id !== undefined;
    }
}

/* ******************************************** BaseSubscriptionDetails ********************************************* */
export const SUBSCRIPTIONDETAILS_STATUS_CREATED = 'CREATED';
export const SUBSCRIPTIONDETAILS_STATUS_ACTIVATED = 'ACTIVATED';
export const SUBSCRIPTIONDETAILS_STATUS_FAILED = 'FAILED';
export const SUBSCRIPTIONDETAILS_STATUS_CANCELLED = 'CANCELLED';
export const SUBSCRIPTIONDETAILS_STATUS_EXPIRED = 'EXPIRED';
export const SUBSCRIPTIONDETAILS_STATUS_PENDING_PROVISIONING = 'PENDING_PROVISIONING';

export enum SUBSCRIPTIONDETAILS_status {
   Activated = 'ACTIVATED',
   Cancelled = 'CANCELLED',
   Created = 'CREATED',
   Expired = 'EXPIRED',
   Failed = 'FAILED',
   Pending_provisioning = 'PENDING_PROVISIONING'
}

export class BaseSubscriptionDetails {
    public  anniversary_billing_date: string;
    public  auto_renewed_allowed    : string;
    public  billing_subscription_id : string;
    public  commitment_term         : string;
    public  commitment_term_uom     : string;    // description: unit of measurment for commitment term
    public  csp_subscription_id     : string;
    public  description             : string;
    public  end_date                : string;
    public  offer_name              : string;
    public  offer_type              : BaseOfferType;
    public  offer_version           : string;
    public  quantity                : string;
    public  region                  : string;
    public  start_date              : string;
    public  status                  : string;    // enum: ['CREATED', 'ACTIVATED', 'FAILED', 'CANCELLED', 'EXPIRED',
                               // 'PENDING_PROVISIONING']
    constructor (json?: any) {
        if (json) {
            this.anniversary_billing_date = json['anniversary_billing_date'];
            this.auto_renewed_allowed = json['auto_renewed_allowed'];
            this.billing_subscription_id = json['billing_subscription_id'];
            this.commitment_term = json['commitment_term'];
            this.commitment_term_uom = json['commitment_term_uom'];
            this.csp_subscription_id = json['csp_subscription_id'];
            this.description = json['description'];
            this.end_date = json['end_date'];
            this.offer_name = json['offer_name'];
            this.offer_type = new BaseOfferType(json['offer_type']);
            Object.assign(this.offer_type, json['offer_type']);
            this.offer_version = json['offer_version'];
            this.quantity = json['quantity'];
            this.region = json['region'];
            this.start_date = json['start_date'];
            this.status = json['status'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.anniversary_billing_date !== undefined
            && this.auto_renewed_allowed !== undefined
            && this.billing_subscription_id !== undefined
            && this.commitment_term !== undefined
            && this.commitment_term_uom !== undefined
            && this.csp_subscription_id !== undefined
            && this.description !== undefined
            && this.end_date !== undefined
            && this.offer_name !== undefined
            && this.offer_type !== undefined
            && this.offer_version !== undefined
            && this.quantity !== undefined
            && this.region !== undefined
            && this.start_date !== undefined
            && this.status !== undefined;
    }
}

/* ********************************************* BaseSubscriptionPeriod ********************************************* */
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_NANOS = 'Nanos';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_MICROS = 'Micros';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_MILLIS = 'Millis';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_SECONDS = 'Seconds';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_MINUTES = 'Minutes';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_HOURS = 'Hours';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_HALFDAYS = 'HalfDays';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_DAYS = 'Days';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_WEEKS = 'Weeks';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_MONTHS = 'Months';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_YEARS = 'Years';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_DECADES = 'Decades';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_CENTURIES = 'Centuries';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_MILLENNIA = 'Millennia';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_ERAS = 'Eras';
export const SUBSCRIPTIONPERIOD_INTERVAL_UNIT_FOREVER = 'Forever';

export enum SUBSCRIPTIONPERIOD_intervalunit {
   Centuries = 'Centuries',
   Days = 'Days',
   Decades = 'Decades',
   Eras = 'Eras',
   Forever = 'Forever',
   Halfdays = 'HalfDays',
   Hours = 'Hours',
   Micros = 'Micros',
   Millennia = 'Millennia',
   Millis = 'Millis',
   Minutes = 'Minutes',
   Months = 'Months',
   Nanos = 'Nanos',
   Seconds = 'Seconds',
   Weeks = 'Weeks',
   Years = 'Years'
}

export class BaseSubscriptionPeriod {
    public  interval     : number;    // format: int32
    public  interval_unit: string;    // enum: ['Nanos', 'Micros', 'Millis', 'Seconds', 'Minutes', 'Hours',
                                      // 'HalfDays', 'Days', 'Weeks', 'Months', 'Years', 'Decades', 'Centuries',
                                      // 'Millennia', 'Eras', 'Forever']
    constructor (json?: any) {
        if (json) {
            this.interval = json['interval'];
            this.interval_unit = json['interval_unit'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.interval !== undefined
            && this.interval_unit !== undefined;
    }
}

/* ******************************************** BaseSubscriptionRequest ********************************************* */
export class BaseSubscriptionRequest {
    // required: offer_name, offer_version, product_type, commitment_term, region, quantity
    public  commitment_term: string;
    public  offer_name     : string;
    public  offer_version  : string;
    public  product_type   : string;
    public  quantity       : number;
    public  region         : string;
    constructor (json?: any) {
        if (json) {
            this.commitment_term = json['commitment_term'];
            this.offer_name = json['offer_name'];
            this.offer_version = json['offer_version'];
            this.product_type = json['product_type'];
            this.quantity = json['quantity'];
            this.region = json['region'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.commitment_term !== undefined
            && this.offer_name !== undefined
            && this.offer_version !== undefined
            && this.product_type !== undefined
            && this.quantity !== undefined
            && this.region !== undefined;
    }
}

/* ******************************************** BaseTaskActiveStateInfo ********************************************* */
export class BaseTaskActiveStateInfo extends BaseNodeActiveStateInfo {
    public  running_listeners: Array<string>;
    public  running_tasks    : Array<string>;    // format: UUID
    constructor (json?: any) {
        super(json);
        if (json) {
            this.running_listeners = json['running_listeners'];
            this.running_tasks = json['running_tasks'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.running_listeners !== undefined
            && this.running_tasks !== undefined;
    }
}

/* ********************************************** BaseTaskErrorDetails ********************************************** */
export class BaseTaskErrorDetails {
    // required: error_details, task_phase, status, sub_status
    public  error_details: BaseInternalErrorDetails;    // description: Internal Error Details containin an error
                                                        // code
    public  status       : string;    // description: The status the task was in before it failed.
    public  sub_status   : string;    // description: The sub_status that task was in before it failed.
    public  task_phase   : string;    // description: The phase the task was in when it failed.
    constructor (json?: any) {
        if (json) {
            this.error_details = new BaseInternalErrorDetails(json['error_details']);
            Object.assign(this.error_details, json['error_details']);
            this.status = json['status'];
            this.sub_status = json['sub_status'];
            this.task_phase = json['task_phase'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.error_details !== undefined
            && this.status !== undefined
            && this.sub_status !== undefined
            && this.task_phase !== undefined;
    }
}

/* ********************************************* BaseTaskProgressPhase ********************************************** */
export class BaseTaskProgressPhase {
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

/* ****************************************** BaseTaskSubStatusTransition ******************************************* */
export class BaseTaskSubStatusTransition {
    // required: new_sub_status, old_sub_status, transition_time
    public  new_sub_status : string;    // description: The new sub status to which the task has transitioned.
    public  old_sub_status : string;    // description: The task's sub status before the transition.
    public  transition_time: string;    // description: The timestamp at which the transition occurred.
    constructor (json?: any) {
        if (json) {
            this.new_sub_status = json['new_sub_status'];
            this.old_sub_status = json['old_sub_status'];
            this.transition_time = json['transition_time'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.new_sub_status !== undefined
            && this.old_sub_status !== undefined
            && this.transition_time !== undefined;
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

export class BaseTask extends BaseAbstractEntity {
    // required: start_time, status, sub_status, task_type
    public  end_time                   : string;    // format: date-time
    public  error_message              : string;
    public  estimated_remaining_minutes: number;    // description: Estimated remaining time in minute of the task
                                                    // execution, < 0 means no estimation for the task., format:
                                                    // int32
    public  localized_error_message    : string;
    public  org_id                     : string;
    public  params                     : any;
    public  phase_in_progress          : string;    // description: The current in progress phase ID in the task execution, if
                                          // none in progress, empty string returned.
    public  progress_percent           : number;    // description: Estimated progress percentage the task executed, format:
                                         // int32
    public  recorded_features          : any;    // x-vmw-vmc-exclude: client
    public  resource_id                : string;    // description: UUID of resources task is acting upon
    public  resource_type              : string;    // description: Type of resource being acted upon
    public  service_errors             : Array<BaseServiceError>;    // description: Service errors returned from SDDC services.
    public  start_time                 : string;    // format: date-time
    public  status                     : string;    // enum: ['STARTED', 'CANCELING', 'FINISHED', 'FAILED', 'CANCELED']
    public  sub_status                 : string;
    public  task_error_details         : Array<BaseTaskErrorDetails>;    // description: A record of errors codes that
                                                                // occurred to cause this task to fail., x-vmw-vmc-
                                                                // exclude: client
    public  task_progress_phases       : Array<BaseTaskProgressPhase>;    // description: Task progress phases involved in
                                                                   // current task execution
    public  task_sub_status_transitions: Array<BaseTaskSubStatusTransition>;    // description: A record of each
                                                                                // time the task changed sub-status
                                                                                // with its associated timestamp.,
                                                                                // x-vmw-vmc-exclude: client
    public  task_type                  : string;
    public  task_version               : string;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.end_time = json['end_time'];
            this.error_message = json['error_message'];
            this.estimated_remaining_minutes = json['estimated_remaining_minutes'];
            this.localized_error_message = json['localized_error_message'];
            this.org_id = json['org_id'];
            this.params = json['params'];
            this.phase_in_progress = json['phase_in_progress'];
            this.progress_percent = json['progress_percent'];
            this.recorded_features = json['recorded_features'];
            this.resource_id = json['resource_id'];
            this.resource_type = json['resource_type'];
            
            if (json['service_errors']) {
                this.service_errors = [];
                for (let item of json['service_errors']) {
                    this.service_errors.push(Object.assign(new BaseServiceError(item), item));
                }
            }
            this.start_time = json['start_time'];
            this.status = json['status'];
            this.sub_status = json['sub_status'];
            
            if (json['task_error_details']) {
                this.task_error_details = [];
                for (let item of json['task_error_details']) {
                    this.task_error_details.push(Object.assign(new BaseTaskErrorDetails(item), item));
                }
            }
            
            if (json['task_progress_phases']) {
                this.task_progress_phases = [];
                for (let item of json['task_progress_phases']) {
                    this.task_progress_phases.push(Object.assign(new BaseTaskProgressPhase(item), item));
                }
            }
            
            if (json['task_sub_status_transitions']) {
                this.task_sub_status_transitions = [];
                for (let item of json['task_sub_status_transitions']) {
                    this.task_sub_status_transitions.push(Object.assign(new BaseTaskSubStatusTransition(item), item));
                }
            }
            this.task_type = json['task_type'];
            this.task_version = json['task_version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.start_time !== undefined
            && this.status !== undefined
            && this.sub_status !== undefined
            && this.task_type !== undefined;
    }
}

/* ************************************ BaseTcpPortConnectivityValidationResult ************************************* */
export const TCPPORTCONNECTIVITYVALIDATIONRESULT_STATUS_UNTESTED = 'UNTESTED';
export const TCPPORTCONNECTIVITYVALIDATIONRESULT_STATUS_SUCCESS = 'SUCCESS';
export const TCPPORTCONNECTIVITYVALIDATIONRESULT_STATUS_FAIL = 'FAIL';
export const TCPPORTCONNECTIVITYVALIDATIONRESULT_STATUS_WARNING = 'WARNING';
export const TCPPORTCONNECTIVITYVALIDATIONRESULT_STATUS_WAITING = 'WAITING';
export const TCPPORTCONNECTIVITYVALIDATIONRESULT_STATUS_RUNNING = 'RUNNING';
export const TCPPORTCONNECTIVITYVALIDATIONRESULT_STATUS_TIMEOUT = 'TIMEOUT';

export enum TCPPORTCONNECTIVITYVALIDATIONRESULT_status {
   Fail = 'FAIL',
   Running = 'RUNNING',
   Success = 'SUCCESS',
   Timeout = 'TIMEOUT',
   Untested = 'UNTESTED',
   Waiting = 'WAITING',
   Warning = 'WARNING'
}

export class BaseTcpPortConnectivityValidationResult {
    public  message: string;    // description: Connectivity test error message.
    public  port   : string;    // description: TCP port number for connectivity test.
    public  status : string;    // description: TCP connectivity status., enum: ['UNTESTED', 'SUCCESS', 'FAIL',
                               // 'WARNING', 'WAITING', 'RUNNING', 'TIMEOUT']
    constructor (json?: any) {
        if (json) {
            this.message = json['message'];
            this.port = json['port'];
            this.status = json['status'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.message !== undefined
            && this.port !== undefined
            && this.status !== undefined;
    }
}

/* ************************************** BaseTcpConnectivityValidationResult *************************************** */
export class BaseTcpConnectivityValidationResult extends BaseConnectivityValidationResult {
    public  results: Array<BaseTcpPortConnectivityValidationResult>;    // description: List of TCP connectivity
                                                                        // test result.
    constructor (json?: any) {
        super(json);
        if (json) {
            
            if (json['results']) {
                this.results = [];
                for (let item of json['results']) {
                    this.results.push(Object.assign(new BaseTcpPortConnectivityValidationResult(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.results !== undefined;
    }
}

/* ********************************************* BaseTermOfferInstance ********************************************** */
export class BaseTermOfferInstance {
    // required: name, version, description, product_type, region, currency, commitment_term, unit_price
    public  commitment_term: number;
    public  currency       : string;
    public  description    : string;
    public  name           : string;
    public  product_type   : string;
    public  region         : string;
    public  unit_price     : string;
    public  version        : string;
    constructor (json?: any) {
        if (json) {
            this.commitment_term = json['commitment_term'];
            this.currency = json['currency'];
            this.description = json['description'];
            this.name = json['name'];
            this.product_type = json['product_type'];
            this.region = json['region'];
            this.unit_price = json['unit_price'];
            this.version = json['version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.commitment_term !== undefined
            && this.currency !== undefined
            && this.description !== undefined
            && this.name !== undefined
            && this.product_type !== undefined
            && this.region !== undefined
            && this.unit_price !== undefined
            && this.version !== undefined;
    }
}

/* ******************************************** BaseOfferInstancesHolder ******************************************** */
export class BaseOfferInstancesHolder {
    // required: on_demand, offers
    public  offers   : Array<BaseTermOfferInstance>;
    public  on_demand: BaseOnDemandOfferInstance;
    constructor (json?: any) {
        if (json) {
            
            if (json['offers']) {
                this.offers = [];
                for (let item of json['offers']) {
                    this.offers.push(Object.assign(new BaseTermOfferInstance(item), item));
                }
            }
            this.on_demand = new BaseOnDemandOfferInstance(json['on_demand']);
            Object.assign(this.on_demand, json['on_demand']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.offers !== undefined
            && this.on_demand !== undefined;
    }
}

/* ***************************************** BaseTraceRouteValidationResult ***************************************** */
export class BaseTraceRouteValidationResult extends BaseConnectivityValidationResult {
    /* No var_list in class TraceRouteValidationResult */
    constructor (json?: any) {
        super(json);
        if (json) {}
    }

    public hasRequiredProperties(): boolean {
        return true;
    }
}

/* ******************************************* BaseUpdateAwsAccountConfig ******************************************* */
export const UPDATEAWSACCOUNTCONFIG_PAYER_ACCOUNT_TYPE_INTERNAL = 'INTERNAL';
export const UPDATEAWSACCOUNTCONFIG_PAYER_ACCOUNT_TYPE_CUSTOMER = 'CUSTOMER';

export enum UPDATEAWSACCOUNTCONFIG_payeraccounttype {
   Customer = 'CUSTOMER',
   Internal = 'INTERNAL'
}

export class BaseUpdateAwsAccountConfig {
    // required: access_key, secret_key
    public  access_key             : string;
    public  assume_role_arn        : string;
    public  nitro_region_az_mapping: any;
    public  payer_account_type     : string;    // enum: ['INTERNAL', 'CUSTOMER']
    public  secret_key             : string;
    constructor (json?: any) {
        if (json) {
            this.access_key = json['access_key'];
            this.assume_role_arn = json['assume_role_arn'];
            this.nitro_region_az_mapping = json['nitro_region_az_mapping'];
            this.payer_account_type = json['payer_account_type'];
            this.secret_key = json['secret_key'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.access_key !== undefined
            && this.secret_key !== undefined;
    }
}

/* ************************************ BaseUpdateAwsAccountNitroRegionAzMapping ************************************ */
export class BaseUpdateAwsAccountNitroRegionAzMapping {
    public  nitro_region_az_mapping: any;
    constructor (json?: any) {
        if (json) {
            this.nitro_region_az_mapping = json['nitro_region_az_mapping'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.nitro_region_az_mapping !== undefined;
    }
}

/* ************************************************** BaseUsageJob ************************************************** */
export const USAGEJOB_JOB_STATE_STARTED = 'STARTED';
export const USAGEJOB_JOB_STATE_FAILED = 'FAILED';
export const USAGEJOB_JOB_STATE_COMPLETED = 'COMPLETED';
export const USAGEJOB_JOB_STATE_COMPLETED_WITH_ERRORS = 'COMPLETED_WITH_ERRORS';

export enum USAGEJOB_jobstate {
   Completed = 'COMPLETED',
   Completed_with_errors = 'COMPLETED_WITH_ERRORS',
   Failed = 'FAILED',
   Started = 'STARTED'
}

export class BaseUsageJob extends BaseAbstractEntity {
    // required: job_state
    public  job_name : string;    // description: name for UsageJob
    public  job_state: string;    // enum: ['STARTED', 'FAILED', 'COMPLETED', 'COMPLETED_WITH_ERRORS']
    constructor (json?: any) {
        super(json);
        if (json) {
            this.job_name = json['job_name'];
            this.job_state = json['job_state'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.job_state !== undefined;
    }
}

/* ********************************************* BaseUsageJobBatchError ********************************************* */
export class BaseUsageJobBatchError extends BaseAbstractEntity {
    public  error_records: Array<BaseErrorRecord>;
    public  usage_job_id : string;    // description: usage job id
    constructor (json?: any) {
        super(json);
        if (json) {
            
            if (json['error_records']) {
                this.error_records = [];
                for (let item of json['error_records']) {
                    this.error_records.push(Object.assign(new BaseErrorRecord(item), item));
                }
            }
            this.usage_job_id = json['usage_job_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.error_records !== undefined
            && this.usage_job_id !== undefined;
    }
}

/* ******************************************** BaseUsageJobBatchOffset ********************************************* */
export class BaseUsageJobBatchOffset {
    public  batch_end_offset  : number;    // format: int32
    public  batch_start_offset: number;    // format: int32
    public  source_file_path  : string;
    constructor (json?: any) {
        if (json) {
            this.batch_end_offset = json['batch_end_offset'];
            this.batch_start_offset = json['batch_start_offset'];
            this.source_file_path = json['source_file_path'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.batch_end_offset !== undefined
            && this.batch_start_offset !== undefined
            && this.source_file_path !== undefined;
    }
}

/* *********************************************** BaseUsageJobBatch ************************************************ */
export const USAGEJOBBATCH_BATCH_STATE_ACCEPTED = 'ACCEPTED';
export const USAGEJOBBATCH_BATCH_STATE_FAILED = 'FAILED';
export const USAGEJOBBATCH_BATCH_STATE_DONE = 'DONE';
export const USAGEJOBBATCH_BATCH_STATE_DONE_WITH_ERROR = 'DONE_WITH_ERROR';
export const USAGEJOBBATCH_BATCH_STATE_TIMEOUT = 'TIMEOUT';

export enum USAGEJOBBATCH_batchstate {
   Accepted = 'ACCEPTED',
   Done = 'DONE',
   Done_with_error = 'DONE_WITH_ERROR',
   Failed = 'FAILED',
   Timeout = 'TIMEOUT'
}

export class BaseUsageJobBatch extends BaseAbstractEntity {
    // required: batch_state
    public  batch_error       : BaseUsageJobBatchError;
    public  batch_state       : string;    // enum: ['ACCEPTED', 'FAILED', 'DONE', 'DONE_WITH_ERROR', 'TIMEOUT']
    public  csp_request_link  : string;    // description: link of csp request
    public  offset            : BaseUsageJobBatchOffset;
    public  total_record_count: number;    // description: total account of usage records in the batch, format:
                                           // int32
    public  usage_job_id      : string;    // description: usage job id
    constructor (json?: any) {
        super(json);
        if (json) {
            this.batch_error = new BaseUsageJobBatchError(json['batch_error']);
            Object.assign(this.batch_error, json['batch_error']);
            this.batch_state = json['batch_state'];
            this.csp_request_link = json['csp_request_link'];
            this.offset = new BaseUsageJobBatchOffset(json['offset']);
            Object.assign(this.offset, json['offset']);
            this.total_record_count = json['total_record_count'];
            this.usage_job_id = json['usage_job_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.batch_state !== undefined;
    }
}

/* ********************************************** BaseUsageJobRequest *********************************************** */
export const USAGEJOBREQUEST_JOB_TYPE_REPORTING = 'REPORTING';
export const USAGEJOBREQUEST_JOB_TYPE_VERIFICATION = 'VERIFICATION';

export enum USAGEJOBREQUEST_jobtype {
   Reporting = 'REPORTING',
   Verification = 'VERIFICATION'
}

export class BaseUsageJobRequest {
    public  job_name        : string;    // description: job name to identify the job
    public  job_type        : string;    // description: defines job configuration. If not specified, defaults to
                                 // REPORTING., enum: ['REPORTING', 'VERIFICATION']
    public  s3_access_key   : string;    // description: access key to aws s3 bucket associated with specified aws s3
                                      // usage file
    public  s3_bucket_name  : string;    // description: aws s3 bucket associated with specified aws s3 usage file
    public  s3_manifest_file: string;    // description: the path of specified aws s3 manifest file for aws usage
                                         // report which usage job can run against
    public  s3_secret_key   : string;    // description: secret key to aws s3 bucket associated with specified aws s3
                                      // usage file
    constructor (json?: any) {
        if (json) {
            this.job_name = json['job_name'];
            this.job_type = json['job_type'];
            this.s3_access_key = json['s3_access_key'];
            this.s3_bucket_name = json['s3_bucket_name'];
            this.s3_manifest_file = json['s3_manifest_file'];
            this.s3_secret_key = json['s3_secret_key'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.job_name !== undefined
            && this.job_type !== undefined
            && this.s3_access_key !== undefined
            && this.s3_bucket_name !== undefined
            && this.s3_manifest_file !== undefined
            && this.s3_secret_key !== undefined;
    }
}

/* ********************************************* BaseUsageSearchRequest ********************************************* */
export class BaseUsageSearchRequest {
    // required: aws_accounts
    public  aws_accounts: Array<string>;    // description: A list of AWS shadow account IDs to find information
                                            // about.
    constructor (json?: any) {
        if (json) {
            this.aws_accounts = json['aws_accounts'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.aws_accounts !== undefined;
    }
}

/* ******************************************** BaseUsageSearchResponse ********************************************* */
export class BaseUsageSearchResponse {
    // required: subscriptions
    public  subscriptions: Array<BaseCspSubscriptionInfo>;
    constructor (json?: any) {
        if (json) {
            
            if (json['subscriptions']) {
                this.subscriptions = [];
                for (let item of json['subscriptions']) {
                    this.subscriptions.push(Object.assign(new BaseCspSubscriptionInfo(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.subscriptions !== undefined;
    }
}

/* ********************************************** BaseVirtualInterface ********************************************** */
export const VIRTUALINTERFACE_BGP_STATUS_UP = 'Up';
export const VIRTUALINTERFACE_BGP_STATUS_DOWN = 'Down';
export const VIRTUALINTERFACE_STATE_CONFIRMING = 'Confirming';
export const VIRTUALINTERFACE_STATE_VERIFYING = 'Verifying';
export const VIRTUALINTERFACE_STATE_PENDING = 'Pending';
export const VIRTUALINTERFACE_STATE_AVAILABLE = 'Available';
export const VIRTUALINTERFACE_STATE_DOWN = 'Down';
export const VIRTUALINTERFACE_STATE_DELETING = 'Deleting';
export const VIRTUALINTERFACE_STATE_DELETED = 'Deleted';
export const VIRTUALINTERFACE_STATE_REJECTED = 'Rejected';
export const VIRTUALINTERFACE_STATE_ATTACHED = 'Attached';
export const VIRTUALINTERFACE_STATE_ATTACHING = 'Attaching';
export const VIRTUALINTERFACE_STATE_ERROR = 'Error';

export enum VIRTUALINTERFACE_bgpstatus {
   Down = 'Down',
   Up = 'Up'
}

export enum VIRTUALINTERFACE_state {
   Attached = 'Attached',
   Attaching = 'Attaching',
   Available = 'Available',
   Confirming = 'Confirming',
   Deleted = 'Deleted',
   Deleting = 'Deleting',
   Down = 'Down',
   Error = 'Error',
   Pending = 'Pending',
   Rejected = 'Rejected',
   Verifying = 'Verifying'
}

export class BaseVirtualInterface {
    public  bgp_status       : string;    // enum: ['Up', 'Down']
    public  customer_address : string;    // description: Customer CIDR
    public  direct_connect_id: string;    // description: Identifier for the Direct connect connection
    public  id               : string;    // description: Identifier for the virtual interface
    public  name             : string;    // description: Name of the virtual interface
    public  state            : string;    // description: State of the virtual interface, enum: ['Confirming', 'Verifying',
                              // 'Pending', 'Available', 'Down', 'Deleting', 'Deleted', 'Rejected', 'Attached',
                              // 'Attaching', 'Error']
    constructor (json?: any) {
        if (json) {
            this.bgp_status = json['bgp_status'];
            this.customer_address = json['customer_address'];
            this.direct_connect_id = json['direct_connect_id'];
            this.id = json['id'];
            this.name = json['name'];
            this.state = json['state'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.bgp_status !== undefined
            && this.customer_address !== undefined
            && this.direct_connect_id !== undefined
            && this.id !== undefined
            && this.name !== undefined
            && this.state !== undefined;
    }
}

/* ************************************************* BaseVmcLocale ************************************************** */
export class BaseVmcLocale {
    public  locale: string;    // description: The locale to be used for translating responses for the session
    constructor (json?: any) {
        if (json) {
            this.locale = json['locale'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.locale !== undefined;
    }
}

/* ************************************************** BaseVpcInfo *************************************************** */
export class BaseVpcInfo {
    public  api_association_id   : string;    // description: Id of the association between subnet and route-table
    public  api_subnet_id        : string;    // description: Id associated with this VPC
    public  association_id       : string;
    public  default_key_pair     : BaseAwsKeyPair;    // x-vmw-vmc-exclude: client
    public  edge_association_id  : string;    // description: Id of the association between edge subnet and route-
                                            // table
    public  edge_subnet_id       : string;    // description: Id of the NSX edge associated with this VPC
    public  esx_security_group_id: string;
    public  id                   : string;
    public  internet_gateway_id  : string;
    public  peering_connection_id: string;
    public  private_subnet_id    : string;
    public  route_table_id       : string;
    public  security_group_id    : string;
    public  subnet_id            : string;
    public  vgw_route_table_id   : string;    // description: Route table which contains the route to VGW
    public  vif_ids              : Array<string>;    // description: set of virtual interfaces attached to the sddc
    public  vm_security_group_id : string;
    public  vpc_cidr             : string;
    constructor (json?: any) {
        if (json) {
            this.api_association_id = json['api_association_id'];
            this.api_subnet_id = json['api_subnet_id'];
            this.association_id = json['association_id'];
            this.default_key_pair = new BaseAwsKeyPair(json['default_key_pair']);
            Object.assign(this.default_key_pair, json['default_key_pair']);
            this.edge_association_id = json['edge_association_id'];
            this.edge_subnet_id = json['edge_subnet_id'];
            this.esx_security_group_id = json['esx_security_group_id'];
            this.id = json['id'];
            this.internet_gateway_id = json['internet_gateway_id'];
            this.peering_connection_id = json['peering_connection_id'];
            this.private_subnet_id = json['private_subnet_id'];
            this.route_table_id = json['route_table_id'];
            this.security_group_id = json['security_group_id'];
            this.subnet_id = json['subnet_id'];
            this.vgw_route_table_id = json['vgw_route_table_id'];
            this.vif_ids = json['vif_ids'];
            this.vm_security_group_id = json['vm_security_group_id'];
            this.vpc_cidr = json['vpc_cidr'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.api_association_id !== undefined
            && this.api_subnet_id !== undefined
            && this.association_id !== undefined
            && this.default_key_pair !== undefined
            && this.edge_association_id !== undefined
            && this.edge_subnet_id !== undefined
            && this.esx_security_group_id !== undefined
            && this.id !== undefined
            && this.internet_gateway_id !== undefined
            && this.peering_connection_id !== undefined
            && this.private_subnet_id !== undefined
            && this.route_table_id !== undefined
            && this.security_group_id !== undefined
            && this.subnet_id !== undefined
            && this.vgw_route_table_id !== undefined
            && this.vif_ids !== undefined
            && this.vm_security_group_id !== undefined
            && this.vpc_cidr !== undefined;
    }
}

/* *********************************************** BaseVpcInfoSubnets *********************************************** */
export class BaseVpcInfoSubnets {
    public  cidr_block : string;    // description: The overall CIDR block of the VPC. This is the AWS primary CIDR
                                   // block.
    public  description: string;    // description: The description of the VPC; usually it's name or id.
    public  subnets    : Array<BaseSubnetInfo>;
    public  vpc_id     : string;    // description: The ID of the VPC these subnets belong to.
    constructor (json?: any) {
        if (json) {
            this.cidr_block = json['cidr_block'];
            this.description = json['description'];
            
            if (json['subnets']) {
                this.subnets = [];
                for (let item of json['subnets']) {
                    this.subnets.push(Object.assign(new BaseSubnetInfo(item), item));
                }
            }
            this.vpc_id = json['vpc_id'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cidr_block !== undefined
            && this.description !== undefined
            && this.subnets !== undefined
            && this.vpc_id !== undefined;
    }
}

/* ******************************************** BaseAwsCompatibleSubnets ******************************************** */
export class BaseAwsCompatibleSubnets {
    public  customer_available_zones: Array<string>;
    public  vpc_map                 : any;
    constructor (json?: any) {
        if (json) {
            this.customer_available_zones = json['customer_available_zones'];
            this.vpc_map = json['vpc_map'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.customer_available_zones !== undefined
            && this.vpc_map !== undefined;
    }
}

/* ********************************************** BaseVpnChannelStatus ********************************************** */
export const VPNCHANNELSTATUS_CHANNEL_STATUS_CONNECTED = 'CONNECTED';
export const VPNCHANNELSTATUS_CHANNEL_STATUS_DISCONNECTED = 'DISCONNECTED';
export const VPNCHANNELSTATUS_CHANNEL_STATUS_UNKNOWN = 'UNKNOWN';

export enum VPNCHANNELSTATUS_channelstatus {
   Connected = 'CONNECTED',
   Disconnected = 'DISCONNECTED',
   Unknown = 'UNKNOWN'
}

export class BaseVpnChannelStatus {
    public  channel_state    : string;    // readOnly: True
    public  channel_status   : string;    // enum: ['CONNECTED', 'DISCONNECTED', 'UNKNOWN'], readOnly: True
    public  failure_message  : string;    // readOnly: True
    public  last_info_message: string;    // readOnly: True
    constructor (json?: any) {
        if (json) {
            this.channel_state = json['channel_state'];
            this.channel_status = json['channel_status'];
            this.failure_message = json['failure_message'];
            this.last_info_message = json['last_info_message'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.channel_state !== undefined
            && this.channel_status !== undefined
            && this.failure_message !== undefined
            && this.last_info_message !== undefined;
    }
}

/* ******************************************* BaseVpnTunnelTrafficStats ******************************************** */
export class BaseVpnTunnelTrafficStats {
    public  decryption_failures             : string;
    public  encryption_failures             : string;
    public  integrity_errors                : string;
    public  packet_received_errors          : string;
    public  packet_sent_errors              : string;
    public  packets_in                      : string;
    public  packets_out                     : string;
    public  replay_errors                   : string;
    public  rx_bytes_on_local_subnet        : string;
    public  sequence_number_over_flow_errors: string;
    public  tx_bytes_from_local_subnet      : string;
    constructor (json?: any) {
        if (json) {
            this.decryption_failures = json['decryption_failures'];
            this.encryption_failures = json['encryption_failures'];
            this.integrity_errors = json['integrity_errors'];
            this.packet_received_errors = json['packet_received_errors'];
            this.packet_sent_errors = json['packet_sent_errors'];
            this.packets_in = json['packets_in'];
            this.packets_out = json['packets_out'];
            this.replay_errors = json['replay_errors'];
            this.rx_bytes_on_local_subnet = json['rx_bytes_on_local_subnet'];
            this.sequence_number_over_flow_errors = json['sequence_number_over_flow_errors'];
            this.tx_bytes_from_local_subnet = json['tx_bytes_from_local_subnet'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.decryption_failures !== undefined
            && this.encryption_failures !== undefined
            && this.integrity_errors !== undefined
            && this.packet_received_errors !== undefined
            && this.packet_sent_errors !== undefined
            && this.packets_in !== undefined
            && this.packets_out !== undefined
            && this.replay_errors !== undefined
            && this.rx_bytes_on_local_subnet !== undefined
            && this.sequence_number_over_flow_errors !== undefined
            && this.tx_bytes_from_local_subnet !== undefined;
    }
}

/* ********************************************** BaseVpnTunnelStatus *********************************************** */
export const VPNTUNNELSTATUS_TUNNEL_STATUS_CONNECTED = 'CONNECTED';
export const VPNTUNNELSTATUS_TUNNEL_STATUS_DISCONNECTED = 'DISCONNECTED';
export const VPNTUNNELSTATUS_TUNNEL_STATUS_UNKNOWN = 'UNKNOWN';

export enum VPNTUNNELSTATUS_tunnelstatus {
   Connected = 'CONNECTED',
   Disconnected = 'DISCONNECTED',
   Unknown = 'UNKNOWN'
}

export class BaseVpnTunnelStatus {
    public  failure_message  : string;    // readOnly: True
    public  last_info_message: string;    // readOnly: True
    public  local_subnet     : string;    // readOnly: True
    public  on_prem_subnet   : string;    // readOnly: True
    public  traffic_stats    : BaseVpnTunnelTrafficStats;
    public  tunnel_state     : string;    // readOnly: True
    public  tunnel_status    : string;    // enum: ['CONNECTED', 'DISCONNECTED', 'UNKNOWN'], readOnly: True
    constructor (json?: any) {
        if (json) {
            this.failure_message = json['failure_message'];
            this.last_info_message = json['last_info_message'];
            this.local_subnet = json['local_subnet'];
            this.on_prem_subnet = json['on_prem_subnet'];
            this.traffic_stats = new BaseVpnTunnelTrafficStats(json['traffic_stats']);
            Object.assign(this.traffic_stats, json['traffic_stats']);
            this.tunnel_state = json['tunnel_state'];
            this.tunnel_status = json['tunnel_status'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.failure_message !== undefined
            && this.last_info_message !== undefined
            && this.local_subnet !== undefined
            && this.on_prem_subnet !== undefined
            && this.traffic_stats !== undefined
            && this.tunnel_state !== undefined
            && this.tunnel_status !== undefined;
    }
}

/* **************************************************** BaseVpn ***************************************************** */
export const VPN_AUTHENTICATION_PSK = 'PSK';
export const VPN_AUTHENTICATION_UNKNOWN = 'UNKNOWN';
export const VPN_DH_GROUP_DH2 = 'DH2';
export const VPN_DH_GROUP_DH5 = 'DH5';
export const VPN_DH_GROUP_DH14 = 'DH14';
export const VPN_DH_GROUP_DH15 = 'DH15';
export const VPN_DH_GROUP_DH16 = 'DH16';
export const VPN_DH_GROUP_UNKNOWN = 'UNKNOWN';
export const VPN_DIGEST_ALGORITHM_SHA1 = 'SHA1';
export const VPN_DIGEST_ALGORITHM_SHA_256 = 'SHA_256';
export const VPN_ENCRYPTION_AES = 'AES';
export const VPN_ENCRYPTION_AES256 = 'AES256';
export const VPN_ENCRYPTION_AES_GCM = 'AES_GCM';
export const VPN_ENCRYPTION_TRIPLE_DES = 'TRIPLE_DES';
export const VPN_ENCRYPTION_UNKNOWN = 'UNKNOWN';
export const VPN_IKE_OPTION_IKEV1 = 'IKEV1';
export const VPN_IKE_OPTION_IKEV2 = 'IKEV2';
export const VPN_STATE_CONNECTED = 'CONNECTED';
export const VPN_STATE_DISCONNECTED = 'DISCONNECTED';
export const VPN_STATE_PARTIALLY_CONNECTED = 'PARTIALLY_CONNECTED';
export const VPN_STATE_UNKNOWN = 'UNKNOWN';

export enum VPN_authentication {
   Psk = 'PSK',
   Unknown = 'UNKNOWN'
}

export enum VPN_dhgroup {
   Dh14 = 'DH14',
   Dh15 = 'DH15',
   Dh16 = 'DH16',
   Dh2 = 'DH2',
   Dh5 = 'DH5',
   Unknown = 'UNKNOWN'
}

export enum VPN_digestalgorithm {
   Sha1 = 'SHA1',
   Sha_256 = 'SHA_256'
}

export enum VPN_encryption {
   Aes = 'AES',
   Aes256 = 'AES256',
   Aes_gcm = 'AES_GCM',
   Triple_des = 'TRIPLE_DES',
   Unknown = 'UNKNOWN'
}

export enum VPN_ikeoption {
   Ikev1 = 'IKEV1',
   Ikev2 = 'IKEV2'
}

export enum VPN_state {
   Connected = 'CONNECTED',
   Disconnected = 'DISCONNECTED',
   Partially_connected = 'PARTIALLY_CONNECTED',
   Unknown = 'UNKNOWN'
}

export class BaseVpn {
    public  authentication      : string;    // enum: ['PSK', 'UNKNOWN']
    public  channel_status      : BaseVpnChannelStatus;
    public  dh_group            : string;    // enum: ['DH2', 'DH5', 'DH14', 'DH15', 'DH16', 'UNKNOWN']
    public  digest_algorithm    : string;    // enum: ['SHA1', 'SHA_256']
    public  enabled             : boolean;
    public  encryption          : string;    // enum: ['AES', 'AES256', 'AES_GCM', 'TRIPLE_DES', 'UNKNOWN']
    public  id                  : string;    // readOnly: True
    public  ike_option          : string;    // enum: ['IKEV1', 'IKEV2']
    public  internal_network_ids: Array<string>;
    public  name                : string;
    public  on_prem_gateway_ip  : string;
    public  on_prem_nat_ip      : string;
    public  on_prem_network_cidr: string;
    public  pfs_enabled         : boolean;
    public  pre_shared_key      : string;
    public  state               : string;    // enum: ['CONNECTED', 'DISCONNECTED', 'PARTIALLY_CONNECTED', 'UNKNOWN'], readOnly:
                              // True
    public  tunnel_statuses     : Array<BaseVpnTunnelStatus>;
    public  version             : string;    // readOnly: True
    constructor (json?: any) {
        if (json) {
            this.authentication = json['authentication'];
            this.channel_status = new BaseVpnChannelStatus(json['channel_status']);
            Object.assign(this.channel_status, json['channel_status']);
            this.dh_group = json['dh_group'];
            this.digest_algorithm = json['digest_algorithm'];
            this.enabled = json['enabled'];
            this.encryption = json['encryption'];
            this.id = json['id'];
            this.ike_option = json['ike_option'];
            this.internal_network_ids = json['internal_network_ids'];
            this.name = json['name'];
            this.on_prem_gateway_ip = json['on_prem_gateway_ip'];
            this.on_prem_nat_ip = json['on_prem_nat_ip'];
            this.on_prem_network_cidr = json['on_prem_network_cidr'];
            this.pfs_enabled = json['pfs_enabled'];
            this.pre_shared_key = json['pre_shared_key'];
            this.state = json['state'];
            
            if (json['tunnel_statuses']) {
                this.tunnel_statuses = [];
                for (let item of json['tunnel_statuses']) {
                    this.tunnel_statuses.push(Object.assign(new BaseVpnTunnelStatus(item), item));
                }
            }
            this.version = json['version'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.authentication !== undefined
            && this.channel_status !== undefined
            && this.dh_group !== undefined
            && this.digest_algorithm !== undefined
            && this.enabled !== undefined
            && this.encryption !== undefined
            && this.id !== undefined
            && this.ike_option !== undefined
            && this.internal_network_ids !== undefined
            && this.name !== undefined
            && this.on_prem_gateway_ip !== undefined
            && this.on_prem_nat_ip !== undefined
            && this.on_prem_network_cidr !== undefined
            && this.pfs_enabled !== undefined
            && this.pre_shared_key !== undefined
            && this.state !== undefined
            && this.tunnel_statuses !== undefined
            && this.version !== undefined;
    }
}

/* ************************************************** BaseGateway *************************************************** */
export class BaseGateway {
    public  eip                     : string;
    public  eip_set                 : boolean;    // description: Boolean flag identifying if eip_set value is set with no errors
                                 // from backend
    public  firewall_rules          : Array<BaseFirewallRule>;
    public  firewall_rules_populated: boolean;    // description: Boolean flag identifying if firewall_rules value
                                                  // is set with no errors from backend
    public  id                      : string;    // readOnly: True
    public  primary_dns             : string;
    public  primary_dns_set         : boolean;    // description: Boolean flag identifying if primary_dns value is set with
                                         // no errors from backend
    public  secondary_dns           : string;
    public  secondary_dns_set       : boolean;    // description: Boolean flag identifying if secondary_dns value is set
                                           // with no errors from backend
    public  vpns                    : Array<BaseVpn>;
    public  vpns_populated          : boolean;    // description: Boolean flag identifying if vpns value is set with no errors
                                        // from backend
    constructor (json?: any) {
        if (json) {
            this.eip = json['eip'];
            this.eip_set = json['eip_set'];
            
            if (json['firewall_rules']) {
                this.firewall_rules = [];
                for (let item of json['firewall_rules']) {
                    this.firewall_rules.push(Object.assign(new BaseFirewallRule(item), item));
                }
            }
            this.firewall_rules_populated = json['firewall_rules_populated'];
            this.id = json['id'];
            this.primary_dns = json['primary_dns'];
            this.primary_dns_set = json['primary_dns_set'];
            this.secondary_dns = json['secondary_dns'];
            this.secondary_dns_set = json['secondary_dns_set'];
            
            if (json['vpns']) {
                this.vpns = [];
                for (let item of json['vpns']) {
                    this.vpns.push(Object.assign(new BaseVpn(item), item));
                }
            }
            this.vpns_populated = json['vpns_populated'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.eip !== undefined
            && this.eip_set !== undefined
            && this.firewall_rules !== undefined
            && this.firewall_rules_populated !== undefined
            && this.id !== undefined
            && this.primary_dns !== undefined
            && this.primary_dns_set !== undefined
            && this.secondary_dns !== undefined
            && this.secondary_dns_set !== undefined
            && this.vpns !== undefined
            && this.vpns_populated !== undefined;
    }
}

/* *********************************************** BaseComputeGateway *********************************************** */
export class BaseComputeGateway extends BaseGateway {
    public  l2_vpn                    : BaseL2Vpn;
    public  logical_networks          : Array<BaseLogicalNetwork>;
    public  logical_networks_populated: boolean;    // description: Boolean flag identifying if logical_networks are
                                                    // populated with no errors from backend
    public  nat_rules                 : Array<BaseNatRule>;
    public  nat_rules_populated       : boolean;    // description: Boolean flag identifying if nat_rules are populated
                                             // with no errors from backend
    public  public_IPs                : Array<string>;    // description: set of public IPs for the gateway
    constructor (json?: any) {
        super(json);
        if (json) {
            this.l2_vpn = new BaseL2Vpn(json['l2_vpn']);
            Object.assign(this.l2_vpn, json['l2_vpn']);
            
            if (json['logical_networks']) {
                this.logical_networks = [];
                for (let item of json['logical_networks']) {
                    this.logical_networks.push(Object.assign(new BaseLogicalNetwork(item), item));
                }
            }
            this.logical_networks_populated = json['logical_networks_populated'];
            
            if (json['nat_rules']) {
                this.nat_rules = [];
                for (let item of json['nat_rules']) {
                    this.nat_rules.push(Object.assign(new BaseNatRule(item), item));
                }
            }
            this.nat_rules_populated = json['nat_rules_populated'];
            this.public_IPs = json['public_IPs'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.l2_vpn !== undefined
            && this.logical_networks !== undefined
            && this.logical_networks_populated !== undefined
            && this.nat_rules !== undefined
            && this.nat_rules_populated !== undefined
            && this.public_IPs !== undefined;
    }
}

/* ********************************************** BaseGatewayTemplate *********************************************** */
export class BaseGatewayTemplate {
    public  firewall_rules: Array<BaseFirewallRule>;
    public  primary_dns   : string;
    public  public_ip     : BaseSddcPublicIp;
    public  secondary_dns : string;
    public  vpns          : Array<BaseVpn>;
    constructor (json?: any) {
        if (json) {
            
            if (json['firewall_rules']) {
                this.firewall_rules = [];
                for (let item of json['firewall_rules']) {
                    this.firewall_rules.push(Object.assign(new BaseFirewallRule(item), item));
                }
            }
            this.primary_dns = json['primary_dns'];
            this.public_ip = new BaseSddcPublicIp(json['public_ip']);
            Object.assign(this.public_ip, json['public_ip']);
            this.secondary_dns = json['secondary_dns'];
            
            if (json['vpns']) {
                this.vpns = [];
                for (let item of json['vpns']) {
                    this.vpns.push(Object.assign(new BaseVpn(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.firewall_rules !== undefined
            && this.primary_dns !== undefined
            && this.public_ip !== undefined
            && this.secondary_dns !== undefined
            && this.vpns !== undefined;
    }
}

/* ******************************************* BaseComputeGatewayTemplate ******************************************* */
export class BaseComputeGatewayTemplate extends BaseGatewayTemplate {
    public  l2_vpn          : BaseL2Vpn;
    public  logical_networks: Array<BaseLogicalNetwork>;
    public  nat_rules       : Array<BaseNatRule>;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.l2_vpn = new BaseL2Vpn(json['l2_vpn']);
            Object.assign(this.l2_vpn, json['l2_vpn']);
            
            if (json['logical_networks']) {
                this.logical_networks = [];
                for (let item of json['logical_networks']) {
                    this.logical_networks.push(Object.assign(new BaseLogicalNetwork(item), item));
                }
            }
            
            if (json['nat_rules']) {
                this.nat_rules = [];
                for (let item of json['nat_rules']) {
                    this.nat_rules.push(Object.assign(new BaseNatRule(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.l2_vpn !== undefined
            && this.logical_networks !== undefined
            && this.nat_rules !== undefined;
    }
}

/* ********************************************* BaseManagementGateway ********************************************** */
export class BaseManagementGateway extends BaseGateway {
    public  subnet_cidr    : string;    // description: mgw network subnet cidr
    public  subnet_cidr_set: boolean;    // description: Boolean flag identifying if subnet_cidr value is set with
                                         // no errors from backend
    constructor (json?: any) {
        super(json);
        if (json) {
            this.subnet_cidr = json['subnet_cidr'];
            this.subnet_cidr_set = json['subnet_cidr_set'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.subnet_cidr !== undefined
            && this.subnet_cidr_set !== undefined;
    }
}

/* ***************************************** BaseManagementGatewayTemplate ****************************************** */
export class BaseManagementGatewayTemplate extends BaseGatewayTemplate {
    public  subnet_cidr: string;    // description: mgw network subnet cidr
    constructor (json?: any) {
        super(json);
        if (json) {
            this.subnet_cidr = json['subnet_cidr'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.subnet_cidr !== undefined;
    }
}

/* ********************************************** BaseNetworkTemplate *********************************************** */
export class BaseNetworkTemplate {
    public  compute_gateway_templates   : Array<BaseComputeGatewayTemplate>;
    public  management_gateway_templates: Array<BaseManagementGatewayTemplate>;
    constructor (json?: any) {
        if (json) {
            
            if (json['compute_gateway_templates']) {
                this.compute_gateway_templates = [];
                for (let item of json['compute_gateway_templates']) {
                    this.compute_gateway_templates.push(Object.assign(new BaseComputeGatewayTemplate(item), item));
                }
            }
            
            if (json['management_gateway_templates']) {
                this.management_gateway_templates = [];
                for (let item of json['management_gateway_templates']) {
                    this.management_gateway_templates.push(Object.assign(new BaseManagementGatewayTemplate(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.compute_gateway_templates !== undefined
            && this.management_gateway_templates !== undefined;
    }
}

/* *********************************************** BaseVsanDiskGroup ************************************************ */
export class BaseVsanDiskGroup {
    // required: cache_volume_id, capacity_volume_ids
    public  cache_volume_id    : string;    // description: The identifier for the cache volume of this disk group.,
                                        // format: uuid
    public  capacity_volume_ids: Array<string>;    // description: The identifiers for the capacity volumes of this
                                                   // disk group., format: uuid
    constructor (json?: any) {
        if (json) {
            this.cache_volume_id = json['cache_volume_id'];
            this.capacity_volume_ids = json['capacity_volume_ids'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cache_volume_id !== undefined
            && this.capacity_volume_ids !== undefined;
    }
}

/* ************************************************** BaseCluster *************************************************** */
export const CLUSTER_CLUSTER_STATE_DEPLOYING = 'DEPLOYING';
export const CLUSTER_CLUSTER_STATE_ADDING_HOSTS = 'ADDING_HOSTS';
export const CLUSTER_CLUSTER_STATE_READY = 'READY';
export const CLUSTER_CLUSTER_STATE_FAILED = 'FAILED';

export enum CLUSTER_clusterstate {
   Adding_hosts = 'ADDING_HOSTS',
   Deploying = 'DEPLOYING',
   Failed = 'FAILED',
   Ready = 'READY'
}

export class BaseCluster {
    // required: cluster_id
    public  cluster_id           : string;
    public  cluster_name         : string;
    public  cluster_state        : string;    // enum: ['DEPLOYING', 'ADDING_HOSTS', 'READY', 'FAILED']
    public  cluster_vcenter_mo_id: string;    // x-vmw-vmc-exclude: client
    public  disk_group_list      : Array<BaseVsanDiskGroup>;    // description: List of VSAN disk groups used in this
                                                          // cluster, x-vmw-vmc-exclude: client
    public  esx_host_list        : Array<BaseEsxHost>;
    public  volume_list          : Array<BaseStorageVolume>;    // description: List of storage volumes used by this cluster,
                                                      // x-vmw-vmc-exclude: client
    constructor (json?: any) {
        if (json) {
            this.cluster_id = json['cluster_id'];
            this.cluster_name = json['cluster_name'];
            this.cluster_state = json['cluster_state'];
            this.cluster_vcenter_mo_id = json['cluster_vcenter_mo_id'];
            
            if (json['disk_group_list']) {
                this.disk_group_list = [];
                for (let item of json['disk_group_list']) {
                    this.disk_group_list.push(Object.assign(new BaseVsanDiskGroup(item), item));
                }
            }
            
            if (json['esx_host_list']) {
                this.esx_host_list = [];
                for (let item of json['esx_host_list']) {
                    this.esx_host_list.push(Object.assign(new BaseEsxHost(item), item));
                }
            }
            
            if (json['volume_list']) {
                this.volume_list = [];
                for (let item of json['volume_list']) {
                    this.volume_list.push(Object.assign(new BaseStorageVolume(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.cluster_id !== undefined;
    }
}

/* ********************************************* BaseSddcResourceConfig ********************************************* */
export const SDDCRESOURCECONFIG_DEPLOYMENT_TYPE_SINGLE_AZ = 'SINGLE_AZ';
export const SDDCRESOURCECONFIG_DEPLOYMENT_TYPE_MULTI_AZ = 'MULTI_AZ';
export const SDDCRESOURCECONFIG_PROVIDER_AWS = 'AWS';

export enum SDDCRESOURCECONFIG_deploymenttype {
   Multi_az = 'MULTI_AZ',
   Single_az = 'SINGLE_AZ'
}

export enum SDDCRESOURCECONFIG_provider {
   Aws = 'AWS'
}

export class BaseSddcResourceConfig {
    // required: provider
    public  admin_password                               : string;    // description: Password for vCenter administrator, x-vmw-vmc-exclude: client
    public  admin_username                               : string;    // description: Username for vCenter administrator, x-vmw-vmc-exclude: client
    public  agent                                        : BaseAgent;    // x-vmw-vmc-exclude: client
    public  availability_zones                           : Array<string>;    // description: Name of the availability zone.
    public  backup_restore_vc_password                   : string;    // description: Password for VC Backup Restore user, x-vmw-vmc-
                                                   // exclude: client
    public  backup_restore_vc_username                   : string;    // description: Username for VC Backup Restore user, x-vmw-vmc-
                                                   // exclude: client
    public  certificates                                 : any;    // description: the certificates installed in the sddc, x-vmw-vmc-exclude: client
    public  cgws                                         : Array<string>;    // description: set of compute gateway ids configured in the sddc
    public  cloud_password                               : string;    // description: Password for vCenter SDDC administrator
    public  cloud_user_group                             : string;    // description: Group name for vCenter SDDC administrator
    public  cloud_username                               : string;    // description: Username for vCenter SDDC administrator
    public  clusters                                     : Array<BaseCluster>;    // description: List of clusters in the SDDC.
    public  custom_properties                            : any;
    public  deployment_type                              : string;    // description: Denotes if this is a SingleAZ SDDC or a MultiAZ SDDC., enum:
                                        // ['SINGLE_AZ', 'MULTI_AZ']
    public  dns_with_management_vm_private_ip            : boolean;    // description: if true, use the private IP addresses to
                                                           // register DNS records for the management VMs
    public  esx_cluster_id                               : string;    // description: Cluster Id to add ESX workflow
    public  esx_host_subnet                              : string;    // description: ESX host subnet
    public  esx_hosts                                    : Array<BaseEsxHost>;
    public  fleet_management_password                    : string;    // description: Password for Fleet Management user, x-vmw-vmc-
                                                  // exclude: client
    public  fleet_management_username                    : string;    // description: Username for Fleet Management user, x-vmw-vmc-
                                                  // exclude: client
    public  is_mgmt_appliance_connectivity_enabled       : boolean;    // description: if true, management appliance
                                                                // connectivity from overlay network is enabled.,
                                                                // x-vmw-vmc-exclude: client
    public  management_ds                                : string;    // description: The ManagedObjectReference of the management Datastore
    public  management_rp                                : string;
    public  management_vms                               : any;    // description: the management VMs in the Sddc, x-vmw-vmc-exclude: client
    public  mgmt_appliance_connectivity_logical_switch_id: string;    // description: ID of Logical switch which
                                                                      // connects MGW to CGW., x-vmw-vmc-exclude:
                                                                      // client
    public  mgmt_appliance_network_name                  : string;    // description: Name for management appliance network.
    public  mgw_id                                       : string;    // description: Management Gateway Id
    public  nsx_manager_audit_password                   : string;    // description: NSX Manager auditor Password, x-vmw-vmc-exclude:
                                                   // client
    public  nsx_manager_audit_username                   : string;    // description: NSX Manager auditor, x-vmw-vmc-exclude: client
    public  nsx_manager_password                         : string;    // description: NSX Manager administrator Password, x-vmw-vmc-exclude:
                                             // client
    public  nsx_manager_username                         : string;    // description: NSX Manager administrator, x-vmw-vmc-exclude: client
    public  nsx_mgr_management_ip                        : string;    // description: NSX Manager internal management IP
    public  nsx_mgr_url                                  : string;    // description: URL of the NSX Manager
    public  nsx_reverse_proxy_url                        : string;    // description: nsx reverse proxy url, x-vmw-vmc-exclude: client
    public  nsxt                                         : boolean;    // description: if true, NSX-T UI is enabled.
    public  provider                                     : string;    // description: Discriminator for additional properties, enum: ['AWS']
    public  psc_management_ip                            : string;    // description: PSC internal management IP
    public  psc_url                                      : string;    // description: URL of the PSC server
    public  root_nsx_controller_password                 : string;    // description: NSX Controller root Password, x-vmw-vmc-
                                                     // exclude: client
    public  root_nsx_edge_password                       : string;    // description: NSX Edge root Password, x-vmw-vmc-exclude: client
    public  sddc_manager_credentials                     : BaseSddcManagerCredentials;    // x-vmw-vmc-exclude: client
    public  sddc_manifest                                : BaseSddcManifest;
    public  sddc_networks                                : Array<string>;    // description: set of network ids configured in the sddc
    public  sso_domain                                   : string;    // description: The SSO domain name to use for vSphere users
    public  sub_domain                                   : string;    // description: the subdomain of the sddc, x-vmw-vmc-exclude: client
    public  vc_instance_id                               : string;    // description: unique id of the vCenter server
    public  vc_management_ip                             : string;    // description: vCenter internal management IP
    public  vc_public_ip                                 : string;    // description: vCenter public IP
    public  vc_ssh_credential                            : BaseCredential;    // x-vmw-vmc-exclude: client
    public  vc_url                                       : string;    // description: URL of the vCenter server
    public  vxlan_subnet                                 : string;    // description: VXLAN IP subnet
    public  witness_availability_zone                    : string;    // description: Availability zone where the witness node is
                                                  // provisioned for a MultiAZ SDDC. This is null for a SingleAZ
                                                  // SDDC.
    constructor (json?: any) {
        if (json) {
            this.admin_password = json['admin_password'];
            this.admin_username = json['admin_username'];
            this.agent = new BaseAgent(json['agent']);
            Object.assign(this.agent, json['agent']);
            this.availability_zones = json['availability_zones'];
            this.backup_restore_vc_password = json['backup_restore_vc_password'];
            this.backup_restore_vc_username = json['backup_restore_vc_username'];
            this.certificates = json['certificates'];
            this.cgws = json['cgws'];
            this.cloud_password = json['cloud_password'];
            this.cloud_user_group = json['cloud_user_group'];
            this.cloud_username = json['cloud_username'];
            
            if (json['clusters']) {
                this.clusters = [];
                for (let item of json['clusters']) {
                    this.clusters.push(Object.assign(new BaseCluster(item), item));
                }
            }
            this.custom_properties = json['custom_properties'];
            this.deployment_type = json['deployment_type'];
            this.dns_with_management_vm_private_ip = json['dns_with_management_vm_private_ip'];
            this.esx_cluster_id = json['esx_cluster_id'];
            this.esx_host_subnet = json['esx_host_subnet'];
            
            if (json['esx_hosts']) {
                this.esx_hosts = [];
                for (let item of json['esx_hosts']) {
                    this.esx_hosts.push(Object.assign(new BaseEsxHost(item), item));
                }
            }
            this.fleet_management_password = json['fleet_management_password'];
            this.fleet_management_username = json['fleet_management_username'];
            this.is_mgmt_appliance_connectivity_enabled = json['is_mgmt_appliance_connectivity_enabled'];
            this.management_ds = json['management_ds'];
            this.management_rp = json['management_rp'];
            this.management_vms = json['management_vms'];
            this.mgmt_appliance_connectivity_logical_switch_id = json['mgmt_appliance_connectivity_logical_switch_id'];
            this.mgmt_appliance_network_name = json['mgmt_appliance_network_name'];
            this.mgw_id = json['mgw_id'];
            this.nsx_manager_audit_password = json['nsx_manager_audit_password'];
            this.nsx_manager_audit_username = json['nsx_manager_audit_username'];
            this.nsx_manager_password = json['nsx_manager_password'];
            this.nsx_manager_username = json['nsx_manager_username'];
            this.nsx_mgr_management_ip = json['nsx_mgr_management_ip'];
            this.nsx_mgr_url = json['nsx_mgr_url'];
            this.nsx_reverse_proxy_url = json['nsx_reverse_proxy_url'];
            this.nsxt = json['nsxt'];
            this.provider = json['provider'];
            this.psc_management_ip = json['psc_management_ip'];
            this.psc_url = json['psc_url'];
            this.root_nsx_controller_password = json['root_nsx_controller_password'];
            this.root_nsx_edge_password = json['root_nsx_edge_password'];
            this.sddc_manager_credentials = new BaseSddcManagerCredentials(json['sddc_manager_credentials']);
            Object.assign(this.sddc_manager_credentials, json['sddc_manager_credentials']);
            this.sddc_manifest = new BaseSddcManifest(json['sddc_manifest']);
            Object.assign(this.sddc_manifest, json['sddc_manifest']);
            this.sddc_networks = json['sddc_networks'];
            this.sso_domain = json['sso_domain'];
            this.sub_domain = json['sub_domain'];
            this.vc_instance_id = json['vc_instance_id'];
            this.vc_management_ip = json['vc_management_ip'];
            this.vc_public_ip = json['vc_public_ip'];
            this.vc_ssh_credential = new BaseCredential(json['vc_ssh_credential']);
            Object.assign(this.vc_ssh_credential, json['vc_ssh_credential']);
            this.vc_url = json['vc_url'];
            this.vxlan_subnet = json['vxlan_subnet'];
            this.witness_availability_zone = json['witness_availability_zone'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.provider !== undefined;
    }
}

/* ******************************************* BaseAwsSddcResourceConfig ******************************************** */
export class BaseAwsSddcResourceConfig extends BaseSddcResourceConfig {
    public  account_link_sddc_config: Array<BaseSddcLinkConfig>;
    public  agent_hostname          : string;    // x-vmw-vmc-exclude: client
    public  aws_region              : BaseRegion;    // x-vmw-vmc-exclude: client
    public  backup_restore_bucket   : string;
    public  dvs_uuid                : string;    // x-vmw-vmc-exclude: client
    public  edge_vmci_auth_token    : string;    // x-vmw-vmc-exclude: client
    public  internal_public_ip_pool : Array<BaseSddcPublicIp>;    // x-vmw-vmc-exclude: client
    public  max_num_public_ip       : number;    // description: maximum number of public IP that user can allocate.
    public  mgw_intermediate_ip     : string;    // x-vmw-vmc-exclude: client
    public  no_nat                  : boolean;    // x-vmw-vmc-exclude: client
    public  public_ip_pool          : Array<BaseSddcPublicIp>;
    public  region                  : string;
    public  vpc_claim_type          : string;    // x-vmw-vmc-exclude: client
    public  vpc_info                : BaseVpcInfo;
    public  vpc_info_peered_agent   : BaseVpcInfo;
    constructor (json?: any) {
        super(json);
        if (json) {
            
            if (json['account_link_sddc_config']) {
                this.account_link_sddc_config = [];
                for (let item of json['account_link_sddc_config']) {
                    this.account_link_sddc_config.push(Object.assign(new BaseSddcLinkConfig(item), item));
                }
            }
            this.agent_hostname = json['agent_hostname'];
            this.aws_region = new BaseRegion(json['aws_region']);
            Object.assign(this.aws_region, json['aws_region']);
            this.backup_restore_bucket = json['backup_restore_bucket'];
            this.dvs_uuid = json['dvs_uuid'];
            this.edge_vmci_auth_token = json['edge_vmci_auth_token'];
            
            if (json['internal_public_ip_pool']) {
                this.internal_public_ip_pool = [];
                for (let item of json['internal_public_ip_pool']) {
                    this.internal_public_ip_pool.push(Object.assign(new BaseSddcPublicIp(item), item));
                }
            }
            this.max_num_public_ip = json['max_num_public_ip'];
            this.mgw_intermediate_ip = json['mgw_intermediate_ip'];
            this.no_nat = json['no_nat'];
            
            if (json['public_ip_pool']) {
                this.public_ip_pool = [];
                for (let item of json['public_ip_pool']) {
                    this.public_ip_pool.push(Object.assign(new BaseSddcPublicIp(item), item));
                }
            }
            this.region = json['region'];
            this.vpc_claim_type = json['vpc_claim_type'];
            this.vpc_info = new BaseVpcInfo(json['vpc_info']);
            Object.assign(this.vpc_info, json['vpc_info']);
            this.vpc_info_peered_agent = new BaseVpcInfo(json['vpc_info_peered_agent']);
            Object.assign(this.vpc_info_peered_agent, json['vpc_info_peered_agent']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.account_link_sddc_config !== undefined
            && this.agent_hostname !== undefined
            && this.aws_region !== undefined
            && this.backup_restore_bucket !== undefined
            && this.dvs_uuid !== undefined
            && this.edge_vmci_auth_token !== undefined
            && this.internal_public_ip_pool !== undefined
            && this.max_num_public_ip !== undefined
            && this.mgw_intermediate_ip !== undefined
            && this.no_nat !== undefined
            && this.public_ip_pool !== undefined
            && this.region !== undefined
            && this.vpc_claim_type !== undefined
            && this.vpc_info !== undefined
            && this.vpc_info_peered_agent !== undefined;
    }
}

/* **************************************************** BaseSddc **************************************************** */
export const SDDC_ACCOUNT_LINK_STATE_DELAYED = 'DELAYED';
export const SDDC_ACCOUNT_LINK_STATE_LINKED = 'LINKED';
export const SDDC_ACCOUNT_LINK_STATE_UNLINKED = 'UNLINKED';
export const SDDC_PROVIDER_AWS = 'AWS';
export const SDDC_SDDC_STATE_DEPLOYING = 'DEPLOYING';
export const SDDC_SDDC_STATE_READY = 'READY';
export const SDDC_SDDC_STATE_DELETING = 'DELETING';
export const SDDC_SDDC_STATE_DELETION_FAILED = 'DELETION_FAILED';
export const SDDC_SDDC_STATE_DELETED = 'DELETED';
export const SDDC_SDDC_STATE_FAILED = 'FAILED';

export enum SDDC_accountlinkstate {
   Delayed = 'DELAYED',
   Linked = 'LINKED',
   Unlinked = 'UNLINKED'
}

export enum SDDC_provider {
   Aws = 'AWS'
}

export enum SDDC_sddcstate {
   Deleted = 'DELETED',
   Deleting = 'DELETING',
   Deletion_failed = 'DELETION_FAILED',
   Deploying = 'DEPLOYING',
   Failed = 'FAILED',
   Ready = 'READY'
}

export class BaseSddc extends BaseAbstractEntity {
    // required: provider, created, name, sddc_state, user_id, user_name
    public  account_link_state: string;    // description: Account linking state of the sddc, enum: ['DELAYED',
                                           // 'LINKED', 'UNLINKED']
    public  expiration_date   : string;    // description: Expiration date of a sddc in UTC (will be set if its
                                        // applicable), format: date-time
    public  name              : string;    // description: name for SDDC
    public  org_id            : string;
    public  provider          : string;    // enum: ['AWS']
    public  resource_config   : BaseSddcResourceConfig;
    public  sddc_state        : string;    // enum: ['DEPLOYING', 'READY', 'DELETING', 'DELETION_FAILED', 'DELETED',
                                   // 'FAILED']
    public  sddc_type         : string;    // description: Type of the sddc
    constructor (json?: any) {
        super(json);
        if (json) {
            this.account_link_state = json['account_link_state'];
            this.expiration_date = json['expiration_date'];
            this.name = json['name'];
            this.org_id = json['org_id'];
            this.provider = json['provider'];
            this.resource_config = new BaseSddcResourceConfig(json['resource_config']);
            Object.assign(this.resource_config, json['resource_config']);
            this.sddc_state = json['sddc_state'];
            this.sddc_type = json['sddc_type'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.created !== undefined
            && this.name !== undefined
            && this.provider !== undefined
            && this.sddc_state !== undefined
            && this.user_id !== undefined
            && this.user_name !== undefined;
    }
}

/* ************************************************ BaseSddcTemplate ************************************************ */
export const SDDCTEMPLATE_STATE_INITIALIZING = 'INITIALIZING';
export const SDDCTEMPLATE_STATE_AVAILABLE = 'AVAILABLE';
export const SDDCTEMPLATE_STATE_INUSE = 'INUSE';
export const SDDCTEMPLATE_STATE_APPLIED = 'APPLIED';
export const SDDCTEMPLATE_STATE_DELETING = 'DELETING';
export const SDDCTEMPLATE_STATE_DELETED = 'DELETED';
export const SDDCTEMPLATE_STATE_FAILED = 'FAILED';

export enum SDDCTEMPLATE_state {
   Applied = 'APPLIED',
   Available = 'AVAILABLE',
   Deleted = 'DELETED',
   Deleting = 'DELETING',
   Failed = 'FAILED',
   Initializing = 'INITIALIZING',
   Inuse = 'INUSE'
}

export class BaseSddcTemplate extends BaseAbstractEntity {
    // required: created, name, state
    public  account_link_sddc_configs: Array<BaseAccountLinkSddcConfig>;    // description: A list of the SDDC
                                                                            // linking configurations to use.
    public  name                     : string;    // description: name for SDDC configuration template
    public  network_template         : BaseNetworkTemplate;
    public  org_id                   : string;
    public  sddc                     : BaseSddc;
    public  source_sddc_id           : string;
    public  state                    : string;    // enum: ['INITIALIZING', 'AVAILABLE', 'INUSE', 'APPLIED', 'DELETING', 'DELETED',
                              // 'FAILED']
    constructor (json?: any) {
        super(json);
        if (json) {
            
            if (json['account_link_sddc_configs']) {
                this.account_link_sddc_configs = [];
                for (let item of json['account_link_sddc_configs']) {
                    this.account_link_sddc_configs.push(Object.assign(new BaseAccountLinkSddcConfig(item), item));
                }
            }
            this.name = json['name'];
            this.network_template = new BaseNetworkTemplate(json['network_template']);
            Object.assign(this.network_template, json['network_template']);
            this.org_id = json['org_id'];
            this.sddc = new BaseSddc(json['sddc']);
            Object.assign(this.sddc, json['sddc']);
            this.source_sddc_id = json['source_sddc_id'];
            this.state = json['state'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.created !== undefined
            && this.name !== undefined
            && this.state !== undefined;
    }
}

/* ************************************************ BaseWebHookInfo ************************************************* */
export class BaseWebHookInfo {
    // required: callback_uri, event_types
    public  callback_uri: string;    // description: Call back URI
    public  event_types : Array<string>;    // description: Event names (service specific)
    constructor (json?: any) {
        if (json) {
            this.callback_uri = json['callback_uri'];
            this.event_types = json['event_types'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.callback_uri !== undefined
            && this.event_types !== undefined;
    }
}

/* ********************************************* BaseWebHookRequestInfo ********************************************* */
export class BaseWebHookRequestInfo {
    // required: callback_uri, event_types
    public  callback_headers     : any;    // description: Map of Rest Headers and values to be used in the callback
    public  callback_uri         : string;    // description: Call back URI
    public  csp_cred_model       : BaseCspCredModel;
    public  event_types          : Array<string>;    // description: Event names (service specific)
    public  notify_on_event_types: any;
    constructor (json?: any) {
        if (json) {
            this.callback_headers = json['callback_headers'];
            this.callback_uri = json['callback_uri'];
            this.csp_cred_model = new BaseCspCredModel(json['csp_cred_model']);
            Object.assign(this.csp_cred_model, json['csp_cred_model']);
            this.event_types = json['event_types'];
            this.notify_on_event_types = json['notify_on_event_types'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.callback_uri !== undefined
            && this.event_types !== undefined;
    }
}

/* *********************************************** BaseWebSocketInfo ************************************************ */
export class BaseWebSocketInfo {
    // required: event_types
    public  event_types: Array<string>;    // description: Event names (service specific)
    constructor (json?: any) {
        if (json) {
            this.event_types = json['event_types'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.event_types !== undefined;
    }
}

/* **************************************************** BaseN10n **************************************************** */
export const N10N_STATUS_ACTIVE = 'ACTIVE';
export const N10N_STATUS_DISABLED = 'DISABLED';

export enum N10N_status {
   Active = 'ACTIVE',
   Disabled = 'DISABLED'
}

export class BaseN10n extends BaseAbstractEntity {
    // required: client_id, status
    public  client_id      : string;    // description: Unique identifier (client supplied). This must be unique across
                                  // ALL services.
    public  status         : string;    // enum: ['ACTIVE', 'DISABLED']
    public  web_hook_info  : BaseWebHookInfo;
    public  web_socket_info: BaseWebSocketInfo;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.client_id = json['client_id'];
            this.status = json['status'];
            this.web_hook_info = new BaseWebHookInfo(json['web_hook_info']);
            Object.assign(this.web_hook_info, json['web_hook_info']);
            this.web_socket_info = new BaseWebSocketInfo(json['web_socket_info']);
            Object.assign(this.web_socket_info, json['web_socket_info']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.client_id !== undefined
            && this.status !== undefined;
    }
}

/* ******************************************** BaseWebSocketRequestInfo ******************************************** */
export class BaseWebSocketRequestInfo {
    // required: client_verifier, event_types
    public  client_verifier      : string;    // description: Unique id used to authorize websocket requests
    public  event_types          : Array<string>;    // description: Event names (service specific)
    public  notify_on_event_types: any;
    constructor (json?: any) {
        if (json) {
            this.client_verifier = json['client_verifier'];
            this.event_types = json['event_types'];
            this.notify_on_event_types = json['notify_on_event_types'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.client_verifier !== undefined
            && this.event_types !== undefined;
    }
}

/* ************************************************ BaseN10nRequest ************************************************* */
export class BaseN10nRequest {
    public  web_hook_info  : BaseWebHookRequestInfo;
    public  web_socket_info: BaseWebSocketRequestInfo;
    constructor (json?: any) {
        if (json) {
            this.web_hook_info = new BaseWebHookRequestInfo(json['web_hook_info']);
            Object.assign(this.web_hook_info, json['web_hook_info']);
            this.web_socket_info = new BaseWebSocketRequestInfo(json['web_socket_info']);
            Object.assign(this.web_socket_info, json['web_socket_info']);
        }
    }

    public hasRequiredProperties(): boolean {
        return this.web_hook_info !== undefined
            && this.web_socket_info !== undefined;
    }
}

/* ******************************************* BaseZeroSddcResourceConfig ******************************************* */
export class BaseZeroSddcResourceConfig extends BaseSddcResourceConfig {
    public  max_num_public_ip: number;    // description: maximum number of public IP that user can allocate.
    public  public_ip_pool   : Array<BaseSddcPublicIp>;
    public  region           : string;
    constructor (json?: any) {
        super(json);
        if (json) {
            this.max_num_public_ip = json['max_num_public_ip'];
            
            if (json['public_ip_pool']) {
                this.public_ip_pool = [];
                for (let item of json['public_ip_pool']) {
                    this.public_ip_pool.push(Object.assign(new BaseSddcPublicIp(item), item));
                }
            }
            this.region = json['region'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.max_num_public_ip !== undefined
            && this.public_ip_pool !== undefined
            && this.region !== undefined;
    }
}

/* ********************************************* BaseZoneChangeRequest ********************************************** */
export class BaseZoneChangeRequest {
    public  current_subnet: string;    // description: The current zone expressed as a customer subnet in which the
                                       // CGW is currently occupying.
    constructor (json?: any) {
        if (json) {
            this.current_subnet = json['current_subnet'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.current_subnet !== undefined;
    }
}




/*  ================================================================================================================ */
/*  PATHS                                                                                                            */
/*  ================================================================================================================ */

export const BASE_PATH = '/vmc/api';

// URI: /auth/identity-hash
export class API_AuthIdentityhash<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/auth/identity-hash';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAuthIdentityHash(responseJSON)); },
         failureHandler,
         'API_AuthIdentityhash'
      );
   }
}

// URI: /auth/time
export class API_AuthTime<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/auth/time';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAuthTime(responseJSON)); },
         failureHandler,
         'API_AuthTime'
      );
   }
}

// URI: /auth/token
export class API_AuthToken<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/auth/token';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAuthToken(responseJSON)); },
         failureHandler,
         'API_AuthToken'
      );
   }
}

// URI: /callbacks/csp/subscription/fulfill
export class API_CallbacksCspSubscriptionFulfill<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/callbacks/csp/subscription/fulfill';
      this.ref = ref;
   }

   public httpPost(
      subscriptionRequest: BaseCspSubscriptionRequest,
      successHandler: Function,
      failureHandler: Function
   ) {
      const uri = this.uri;
      const _body = JSON.stringify(subscriptionRequest);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_CallbacksCspSubscriptionFulfill'
      );
   }
}

// URI: /callbacks/publics/account-link/status-update/{org}
export class API_CallbacksPublicsAccountlinkStatusupdateOrg<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/callbacks/publics/account-link/status-update/' + org;
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_CallbacksPublicsAccountlinkStatusupdateOrg'
      );
   }
}

// URI: /callbacks/publics/account-link/template/{org}/{tokenId}/{tokenContent}
export class API_CallbacksPublicsAccountlinkTemplateOrgTokenidTokencontent<T> {
   private org: string;
   private tokenid: string;
   private tokencontent: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, tokenid: string, tokencontent: string) {
      this.org = org;
      this.tokenid = tokenid;
      this.tokencontent = tokencontent;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/callbacks/publics/account-link/template/' + org + '/' + tokenid + '/' + tokencontent;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_CallbacksPublicsAccountlinkTemplateOrgTokenidTokencontent'
      );
   }
}

// URI: /locale
export class API_Locale<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/locale';
      this.ref = ref;
   }

   public httpPost(vmcLocale: BaseVmcLocale, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(vmcLocale);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseVmcLocale(responseJSON)); },
         failureHandler,
         'API_Locale'
      );
   }
}

// URI: /operator/aws
export class API_OperatorAws<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/aws';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsAccount[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsAccount(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorAws'
      );
   }

   public httpPost(awsAccountConfig: BaseAwsAccountConfig, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(awsAccountConfig);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccount(responseJSON)); },
         failureHandler,
         'API_OperatorAws'
      );
   }
}

// URI: /operator/aws/create
export class API_OperatorAwsCreate<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/aws/create';
      this.ref = ref;
   }

   public httpPost(
      awsAccountCreationConfig: BaseAwsAccountCreationConfig,
      successHandler: Function,
      failureHandler: Function
   ) {
      const uri = this.uri;
      const _body = JSON.stringify(awsAccountCreationConfig);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorAwsCreate'
      );
   }
}

// URI: /operator/aws/credentials
export class API_OperatorAwsCredentials<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/aws/credentials';
      this.ref = ref;
   }

   public httpPost(orgId: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (orgId) {
         uri = uri + '&orgId=' + orgId;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccountResponseStructure(responseJSON)); },
         failureHandler,
         'API_OperatorAwsCredentials'
      );
   }
}

// URI: /operator/aws/whitelist
export class API_OperatorAwsWhitelist<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/aws/whitelist';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorAwsWhitelist'
      );
   }
}

// URI: /operator/aws/{awsAccountId}
export class API_OperatorAwsAwsaccountid<T> {
   private awsaccountid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, awsaccountid: string) {
      this.awsaccountid = awsaccountid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/aws/' + awsaccountid;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccount(responseJSON)); },
         failureHandler,
         'API_OperatorAwsAwsaccountid'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccount(responseJSON)); },
         failureHandler,
         'API_OperatorAwsAwsaccountid'
      );
   }

   public httpPatch(
      updateAwsAccountConfig: BaseUpdateAwsAccountConfig,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(updateAwsAccountConfig);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccount(responseJSON)); },
         failureHandler,
         'API_OperatorAwsAwsaccountid'
      );
   }

   public httpPost(action: string, orgId: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (action) {
         uri = uri + '&action=' + action;
      }
      if (orgId) {
         uri = uri + '&orgId=' + orgId;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccount(responseJSON)); },
         failureHandler,
         'API_OperatorAwsAwsaccountid'
      );
   }
}

// URI: /operator/aws/{awsAccountId}/regionazmapping
export class API_OperatorAwsAwsaccountidRegionazmapping<T> {
   private awsaccountid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, awsaccountid: string) {
      this.awsaccountid = awsaccountid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/aws/' + awsaccountid + '/regionazmapping';
      this.ref = ref;
   }

   public httpPatch(
      UpdateAwsAccountNitroRegionAzMapping: BaseUpdateAwsAccountNitroRegionAzMapping,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(UpdateAwsAccountNitroRegionAzMapping);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccount(responseJSON)); },
         failureHandler,
         'API_OperatorAwsAwsaccountidRegionazmapping'
      );
   }
}

// URI: /operator/aws/{awsAccountId}/resume
export class API_OperatorAwsAwsaccountidResume<T> {
   private awsaccountid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, awsaccountid: string) {
      this.awsaccountid = awsaccountid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/aws/' + awsaccountid + '/resume';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorAwsAwsaccountidResume'
      );
   }
}

// URI: /operator/aws/{awsAccountId}/state
export class API_OperatorAwsAwsaccountidState<T> {
   private awsaccountid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, awsaccountid: string) {
      this.awsaccountid = awsaccountid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/aws/' + awsaccountid + '/state';
      this.ref = ref;
   }

   public httpPost(state: string, reason: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (state) {
         uri = uri + '&state=' + state;
      }
      if (reason) {
         uri = uri + '&reason=' + reason;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccount(responseJSON)); },
         failureHandler,
         'API_OperatorAwsAwsaccountidState'
      );
   }
}

// URI: /operator/billing/search
export class API_OperatorBillingSearch<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/billing/search';
      this.ref = ref;
   }

   public httpPost(usageSearchRequest: BaseUsageSearchRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(usageSearchRequest);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseUsageSearchResponse(responseJSON)); },
         failureHandler,
         'API_OperatorBillingSearch'
      );
   }
}

// URI: /operator/config
export class API_OperatorConfig<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/config';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseConfigResponse(responseJSON)); },
         failureHandler,
         'API_OperatorConfig'
      );
   }

   public httpPut(
      action: string,
      ConfigRequest: BaseConfigRequest,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = JSON.stringify(ConfigRequest);
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorConfig'
      );
   }
}

// URI: /operator/connected-accounts/{linkedAccountPathId}
export class API_OperatorConnectedaccountsLinkedaccountpathid<T> {
   private linkedaccountpathid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, linkedaccountpathid: string) {
      this.linkedaccountpathid = linkedaccountpathid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/connected-accounts/' + linkedaccountpathid;
      this.ref = ref;
   }

   public httpDelete(org: string, force: boolean, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (org) {
         uri = uri + '&org=' + org;
      }
      if (force) {
         uri = uri + '&force=' + force;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsCustomerConnectedAccount(responseJSON)); },
         failureHandler,
         'API_OperatorConnectedaccountsLinkedaccountpathid'
      );
   }
}

// URI: /operator/delegated-access/pop/sddcs/{sddc}
export class API_OperatorDelegatedaccessPopSddcsSddc<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/delegated-access/pop/sddcs/' + sddc;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessPopSddcsSddc'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAgentSshAccessResponse(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessPopSddcsSddc'
      );
   }

   public httpPost(request_info: BaseAgentSshAccessRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(request_info);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessPopSddcsSddc'
      );
   }
}

// URI: /operator/delegated-access/ssh/sddcs/{sddc}
export class API_OperatorDelegatedaccessSshSddcsSddc<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/delegated-access/ssh/sddcs/' + sddc;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessSshSddcsSddc'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseDelegatedAccessSshResponse(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessSshSddcsSddc'
      );
   }

   public httpPatch(
      request_info: BaseDelegatedAccessSshRequest,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(request_info);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessSshSddcsSddc'
      );
   }

   public httpPost(request_info: BaseDelegatedAccessSshRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(request_info);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessSshSddcsSddc'
      );
   }
}

// URI: /operator/delegated-access/vcenter/report/orgs/{org}
export class API_OperatorDelegatedaccessVcenterReportOrgsOrg<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/delegated-access/vcenter/report/orgs/' + org;
      this.ref = ref;
   }

   public httpGet(start_date: string, end_date: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (start_date) {
         uri = uri + '&start_date=' + start_date;
      }
      if (end_date) {
         uri = uri + '&end_date=' + end_date;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseDelegatedAccessVCenterUserReportItem[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseDelegatedAccessVCenterUserReportItem(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorDelegatedaccessVcenterReportOrgsOrg'
      );
   }
}

// URI: /operator/delegated-access/vcenter/sddcs/{sddc}
export class API_OperatorDelegatedaccessVcenterSddcsSddc<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/delegated-access/vcenter/sddcs/' + sddc;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessVcenterSddcsSddc'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseDelegatedAccessVCenterUserResponseInfo(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessVcenterSddcsSddc'
      );
   }

   public httpPatch(successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : '';
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessVcenterSddcsSddc'
      );
   }

   public httpPost(
      request_info: BaseDelegatedAccessVCenterUserRequestInfo,
      successHandler: Function,
      failureHandler: Function
   ) {
      const uri = this.uri;
      const _body = JSON.stringify(request_info);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorDelegatedaccessVcenterSddcsSddc'
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

// URI: /operator/invitations/service-invitations
export class API_OperatorInvitationsServiceinvitations<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/invitations/service-invitations';
      this.ref = ref;
   }

   public httpGet(invitationLink: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (invitationLink) {
         uri = uri + '&invitationLink=' + invitationLink;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseServiceInvitationDetail(responseJSON)); },
         failureHandler,
         'API_OperatorInvitationsServiceinvitations'
      );
   }

   public httpPost(
      ServiceInvitationRequest: BaseServiceInvitationRequest,
      successHandler: Function,
      failureHandler: Function
   ) {
      const uri = this.uri;
      const _body = JSON.stringify(ServiceInvitationRequest);
      this.httpFn(this.ref, 'POST', uri, _body,
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
         'API_OperatorInvitationsServiceinvitations'
      );
   }
}

// URI: /operator/invitations/service-invitations/presets
export class API_OperatorInvitationsServiceinvitationsPresets<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/invitations/service-invitations/presets';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseServiceInvitationPreset[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseServiceInvitationPreset(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorInvitationsServiceinvitationsPresets'
      );
   }
}

// URI: /operator/jobs
export class API_OperatorJobs<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/jobs';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseJobResponse[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseJobResponse(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorJobs'
      );
   }
}

// URI: /operator/jobs/{jobName}
export class API_OperatorJobsJobname<T> {
   private jobname: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, jobname: string) {
      this.jobname = jobname;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/jobs/' + jobname;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorJobsJobname'
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
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseJobResponse(responseJSON)); },
         failureHandler,
         'API_OperatorJobsJobname'
      );
   }
}

// URI: /operator/map-customer-zones/
export class API_OperatorMapcustomerzones<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/map-customer-zones/';
      this.ref = ref;
   }

   public httpPost(mapZonesRequest: BaseMapZonesRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(mapZonesRequest);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseMapZonesResult(responseJSON)); },
         failureHandler,
         'API_OperatorMapcustomerzones'
      );
   }
}

// URI: /operator/nodes/local
export class API_OperatorNodesLocal<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/nodes/local';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseNodeInfo(responseJSON)); },
         failureHandler,
         'API_OperatorNodesLocal'
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
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorNodesLocal'
      );
   }
}

// URI: /operator/notifications
export class API_OperatorNotifications<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/notifications';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseN10n[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseN10n(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorNotifications'
      );
   }
}

// URI: /operator/notifications/event/types
export class API_OperatorNotificationsEventTypes<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/notifications/event/types';
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
         'API_OperatorNotificationsEventTypes'
      );
   }
}

// URI: /operator/notifications/{clientId}
export class API_OperatorNotificationsClientid<T> {
   private clientid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, clientid: string) {
      this.clientid = clientid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/notifications/' + clientid;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorNotificationsClientid'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseN10n(responseJSON)); },
         failureHandler,
         'API_OperatorNotificationsClientid'
      );
   }

   public httpPut(NotificationRequest: BaseN10nRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(NotificationRequest);
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseN10n(responseJSON)); },
         failureHandler,
         'API_OperatorNotificationsClientid'
      );
   }
}

// URI: /operator/oauth-client
export class API_OperatorOauthclient<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/oauth-client';
      this.ref = ref;
   }

   public httpPost(request_info: BaseOauthClientRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(request_info);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseOauthClientResponse(responseJSON)); },
         failureHandler,
         'API_OperatorOauthclient'
      );
   }
}

// URI: /operator/oauth-client/{client_id}
export class API_OperatorOauthclientClient_id<T> {
   private client_id: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, client_id: string) {
      this.client_id = client_id;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/oauth-client/' + client_id;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseOauthClientDeleteResponse(responseJSON)); },
         failureHandler,
         'API_OperatorOauthclientClient_id'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseOauthClientResponse(responseJSON)); },
         failureHandler,
         'API_OperatorOauthclientClient_id'
      );
   }
}

// URI: /operator/orgs
export class API_OperatorOrgs<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs';
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
         'API_OperatorOrgs'
      );
   }
}

// URI: /operator/orgs/orgtype-options
export class API_OperatorOrgsOrgtypeoptions<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/orgtype-options';
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
         'API_OperatorOrgsOrgtypeoptions'
      );
   }
}

// URI: /operator/orgs/orgtype-property
export class API_OperatorOrgsOrgtypeproperty<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/orgtype-property';
      this.ref = ref;
   }

   public httpGet(orgtype: string, property: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (orgtype) {
         uri = uri + '&orgtype=' + orgtype;
      }
      if (property) {
         uri = uri + '&property=' + property;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {{ successHandler(ref, responseJSON); }},
         failureHandler,
         'API_OperatorOrgsOrgtypeproperty'
      );
   }
}

// URI: /operator/orgs/properties
export class API_OperatorOrgsProperties<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/properties';
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
         'API_OperatorOrgsProperties'
      );
   }
}

// URI: /operator/orgs/sddc-connections
export class API_OperatorOrgsSddcconnections<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/sddc-connections';
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
            const rsp: BaseAwsSddcConnection[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsSddcConnection(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorOrgsSddcconnections'
      );
   }
}

// URI: /operator/orgs/{org}
export class API_OperatorOrgsOrg<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorOrgsOrg'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseOrganization(responseJSON)); },
         failureHandler,
         'API_OperatorOrgsOrg'
      );
   }

   public httpPatch(
      project: BaseOrgPatchStructure,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(project);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorOrgsOrg'
      );
   }

   public httpPut(action: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorOrgsOrg'
      );
   }
}

// URI: /operator/orgs/{org}/account-link/customer-aws-account
export class API_OperatorOrgsOrgAccountlinkCustomerawsaccount<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/account-link/customer-aws-account';
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsCustomerLinkedAccount[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsCustomerLinkedAccount(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorOrgsOrgAccountlinkCustomerawsaccount'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsCustomerLinkedAccount[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsCustomerLinkedAccount(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorOrgsOrgAccountlinkCustomerawsaccount'
      );
   }
}

// URI: /operator/orgs/{org}/features
export class API_OperatorOrgsOrgFeatures<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/features';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSksFeatureDetails(responseJSON)); },
         failureHandler,
         'API_OperatorOrgsOrgFeatures'
      );
   }
}

// URI: /operator/orgs/{org}/features/{featureId}
export class API_OperatorOrgsOrgFeaturesFeatureid<T> {
   private org: string;
   private featureid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, featureid: string) {
      this.org = org;
      this.featureid = featureid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/features/' + featureid;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSksFeatureDetails(responseJSON)); },
         failureHandler,
         'API_OperatorOrgsOrgFeaturesFeatureid'
      );
   }
}

// URI: /operator/orgs/{org}/properties/versions
export class API_OperatorOrgsOrgPropertiesVersions<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/properties/versions';
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
            const rsp: BaseOrgProperties[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseOrgProperties(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorOrgsOrgPropertiesVersions'
      );
   }
}

// URI: /operator/orgs/{org}/properties/{propertyName}
export class API_OperatorOrgsOrgPropertiesPropertyname<T> {
   private org: string;
   private propertyname: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, propertyname: string) {
      this.org = org;
      this.propertyname = propertyname;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/properties/' + propertyname;
      this.ref = ref;
   }

   public httpDelete(force: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (force) {
         uri = uri + '&force=' + force;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorOrgsOrgPropertiesPropertyname'
      );
   }
}

// URI: /operator/orgs/{org}/sddc-connections
export class API_OperatorOrgsOrgSddcconnections<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/sddc-connections';
      this.ref = ref;
   }

   public httpDelete(
      connection_request: BaseSddcConnectionDeleteRequest,
      successHandler: Function,
      failureHandler: Function
   ) {
      const uri = this.uri;
      const _body = JSON.stringify(connection_request);
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsSddcConnection[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsSddcConnection(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorOrgsOrgSddcconnections'
      );
   }

   public httpGet(findorphans: boolean, $filter: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (findorphans) {
         uri = uri + '&findorphans=' + findorphans;
      }
      if ($filter) {
         uri = uri + '&$filter=' + $filter;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsSddcConnection[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsSddcConnection(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorOrgsOrgSddcconnections'
      );
   }
}

// URI: /operator/orgs/{org}/sddc-connections/orphans
export class API_OperatorOrgsOrgSddcconnectionsOrphans<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/sddc-connections/orphans';
      this.ref = ref;
   }

   public httpGet(findorphans: boolean, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (findorphans) {
         uri = uri + '&findorphans=' + findorphans;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsSddcConnection[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsSddcConnection(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorOrgsOrgSddcconnectionsOrphans'
      );
   }
}

// URI: /operator/orgs/{org}/sddcs/{sddc}/xvpc-zone
export class API_OperatorOrgsOrgSddcsSddcXvpczone<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/sddcs/' + sddc + '/xvpc-zone';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsSddcConnection(responseJSON)); },
         failureHandler,
         'API_OperatorOrgsOrgSddcsSddcXvpczone'
      );
   }

   public httpPost(zoneChangeRequest: BaseZoneChangeRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(zoneChangeRequest);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsSddcConnection(responseJSON)); },
         failureHandler,
         'API_OperatorOrgsOrgSddcsSddcXvpczone'
      );
   }
}

// URI: /operator/orgs/{org}/subscriptions
export class API_OperatorOrgsOrgSubscriptions<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/subscriptions';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSubscriptionDetails[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSubscriptionDetails(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorOrgsOrgSubscriptions'
      );
   }
}

// URI: /operator/orgs/{org}/subscriptions/on-demand
export class API_OperatorOrgsOrgSubscriptionsOndemand<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/subscriptions/on-demand';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorOrgsOrgSubscriptionsOndemand'
      );
   }
}

// URI: /operator/orgs/{org}/versions
export class API_OperatorOrgsOrgVersions<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/orgs/' + org + '/versions';
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
            const rsp: BaseOrganization[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseOrganization(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorOrgsOrgVersions'
      );
   }
}

// URI: /operator/sddc-connections/{sddcConnectionId}
export class API_OperatorSddcconnectionsSddcconnectionid<T> {
   private sddcconnectionid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddcconnectionid: string) {
      this.sddcconnectionid = sddcconnectionid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddc-connections/' + sddcconnectionid;
      this.ref = ref;
   }

   public httpPatch(successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : '';
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsSddcConnection(responseJSON)); },
         failureHandler,
         'API_OperatorSddcconnectionsSddcconnectionid'
      );
   }
}

// URI: /operator/sddc-templates
export class API_OperatorSddctemplates<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddc-templates';
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
            const rsp: BaseSddcTemplate[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcTemplate(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddctemplates'
      );
   }
}

// URI: /operator/sddcs
export class API_OperatorSddcs<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs';
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
            const rsp: BaseSddc[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddc(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcs'
      );
   }
}

// URI: /operator/sddcs/{sddc}
export class API_OperatorSddcsSddc<T> {
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

   public httpDelete(force: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (force) {
         uri = uri + '&force=' + force;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddc'
      );
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

// URI: /operator/sddcs/{sddc}/account-link/xvpc-links
export class API_OperatorSddcsSddcAccountlinkXvpclinks<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/account-link/xvpc-links';
      this.ref = ref;
   }

   public httpPost(sddcConfig: BaseSddcConfig, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(sddcConfig);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcAccountlinkXvpclinks'
      );
   }
}

// URI: /operator/sddcs/{sddc}/agent
export class API_OperatorSddcsSddcAgent<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/agent';
      this.ref = ref;
   }

   public httpPatch(action: string, successHandler: Function, failureHandler: Function, altBody?: any) {
      let uri = '';
      const _body = altBody ? altBody : '';
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcAgent'
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
         'API_OperatorSddcsSddcAgent'
      );
   }
}

// URI: /operator/sddcs/{sddc}/agent/auth-token
export class API_OperatorSddcsSddcAgentAuthtoken<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/agent/auth-token';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAgentAuthInfo(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcAgentAuthtoken'
      );
   }
}

// URI: /operator/sddcs/{sddc}/agent/login-token
export class API_OperatorSddcsSddcAgentLogintoken<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/agent/login-token';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {{ successHandler(ref, responseJSON); }},
         failureHandler,
         'API_OperatorSddcsSddcAgentLogintoken'
      );
   }
}

// URI: /operator/sddcs/{sddc}/agent/services
export class API_OperatorSddcsSddcAgentServices<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/agent/services';
      this.ref = ref;
   }

   public httpPost(
      PopServiceLifeCycleSpecV1: BasePopServiceLifeCycleSpecV1,
      action: string,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = JSON.stringify(PopServiceLifeCycleSpecV1);
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcAgentServices'
      );
   }
}

// URI: /operator/sddcs/{sddc}/certificate/{entity}
export class API_OperatorSddcsSddcCertificateEntity<T> {
   private sddc: string;
   private entity: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, entity: string) {
      this.sddc = sddc;
      this.entity = entity;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/certificate/' + entity;
      this.ref = ref;
   }

   public httpPost(validDays: number, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (validDays) {
         uri = uri + '&validDays=' + validDays;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCertificateEntity'
      );
   }
}

// URI: /operator/sddcs/{sddc}/cgws
export class API_OperatorSddcsSddcCgws<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/cgws';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseComputeGateway[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseComputeGateway(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcCgws'
      );
   }

   public httpPost(cgw_name: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (cgw_name) {
         uri = uri + '&cgw_name=' + cgw_name;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgws'
      );
   }
}

// URI: /operator/sddcs/{sddc}/cgws/{gateway}
export class API_OperatorSddcsSddcCgwsGateway<T> {
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gateway: string) {
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/cgws/' + gateway;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseComputeGateway(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGateway'
      );
   }
}

// URI: /operator/sddcs/{sddc}/cgws/{gateway}/l2vpn
export class API_OperatorSddcsSddcCgwsGatewayL2vpn<T> {
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gateway: string) {
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/cgws/' + gateway + '/l2vpn';
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayL2vpn'
      );
   }

   public httpGet(showsensitivedata: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (showsensitivedata) {
         uri = uri + '&showsensitivedata=' + showsensitivedata;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseL2Vpn[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseL2Vpn(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayL2vpn'
      );
   }

   public httpPatch(l2Vpn: BaseL2Vpn, successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(l2Vpn);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayL2vpn'
      );
   }

   public httpPost(l2Vpn: BaseL2Vpn, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(l2Vpn);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayL2vpn'
      );
   }
}

// URI: /operator/sddcs/{sddc}/cgws/{gateway}/nat-rules
export class API_OperatorSddcsSddcCgwsGatewayNatrules<T> {
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gateway: string) {
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/cgws/' + gateway + '/nat-rules';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseNatRule[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseNatRule(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayNatrules'
      );
   }

   public httpPatch(
      rule_id: string,
      above_rule_id: string,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      let uri = '';
      const _body = altBody ? altBody : '';
      if (rule_id) {
         uri = uri + '&rule_id=' + rule_id;
      }
      if (above_rule_id) {
         uri = uri + '&above_rule_id=' + above_rule_id;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayNatrules'
      );
   }

   public httpPost(above_rule_id: string, rule: BaseNatRule, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = JSON.stringify(rule);
      if (above_rule_id) {
         uri = uri + '&above_rule_id=' + above_rule_id;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayNatrules'
      );
   }
}

// URI: /operator/sddcs/{sddc}/cgws/{gateway}/nat-rules/{rule}
export class API_OperatorSddcsSddcCgwsGatewayNatrulesRule<T> {
   private sddc: string;
   private gateway: string;
   private rule: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gateway: string, rule: string) {
      this.sddc = sddc;
      this.gateway = gateway;
      this.rule = rule;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/cgws/' + gateway + '/nat-rules/' + rule;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayNatrulesRule'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseNatRule(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayNatrulesRule'
      );
   }

   public httpPatch(successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : '';
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayNatrulesRule'
      );
   }
}

// URI: /operator/sddcs/{sddc}/cgws/{gateway}/networks
export class API_OperatorSddcsSddcCgwsGatewayNetworks<T> {
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gateway: string) {
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/cgws/' + gateway + '/networks';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseLogicalNetwork[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseLogicalNetwork(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayNetworks'
      );
   }

   public httpPost(logicalNetwork: BaseLogicalNetwork, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(logicalNetwork);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayNetworks'
      );
   }
}

// URI: /operator/sddcs/{sddc}/cgws/{gateway}/networks/{networkId}
export class API_OperatorSddcsSddcCgwsGatewayNetworksNetworkid<T> {
   private sddc: string;
   private gateway: string;
   private networkid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gateway: string, networkid: string) {
      this.sddc = sddc;
      this.gateway = gateway;
      this.networkid = networkid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/cgws/' + gateway + '/networks/' + networkid;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcCgwsGatewayNetworksNetworkid'
      );
   }
}

// URI: /operator/sddcs/{sddc}/esxs/{esx}
export class API_OperatorSddcsSddcEsxsEsx<T> {
   private sddc: string;
   private esx: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, esx: string) {
      this.sddc = sddc;
      this.esx = esx;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/esxs/' + esx;
      this.ref = ref;
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
         'API_OperatorSddcsSddcEsxsEsx'
      );
   }
}

// URI: /operator/sddcs/{sddc}/expiration-date/{noOfDaysToExtend}
export class API_OperatorSddcsSddcExpirationdateNoofdaystoextend<T> {
   private sddc: string;
   private noofdaystoextend: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, noofdaystoextend: string) {
      this.sddc = sddc;
      this.noofdaystoextend = noofdaystoextend;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/expiration-date/' + noofdaystoextend;
      this.ref = ref;
   }

   public httpPut(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddc(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcExpirationdateNoofdaystoextend'
      );
   }
}

// URI: /operator/sddcs/{sddc}/mgw
export class API_OperatorSddcsSddcMgw<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/mgw';
      this.ref = ref;
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
         'API_OperatorSddcsSddcMgw'
      );
   }
}

// URI: /operator/sddcs/{sddc}/mgw/publicips
export class API_OperatorSddcsSddcMgwPublicips<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/mgw/publicips';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddcPublicIp[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcPublicIp(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcMgwPublicips'
      );
   }

   public httpPost(spec: BaseSddcAllocatePublicIpSpec, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(spec);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcMgwPublicips'
      );
   }
}

// URI: /operator/sddcs/{sddc}/mgw/publicips/{id}
export class API_OperatorSddcsSddcMgwPublicipsId<T> {
   private sddc: string;
   private id: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, id: string) {
      this.sddc = sddc;
      this.id = id;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/mgw/publicips/' + id;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcMgwPublicipsId'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddcPublicIp(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcMgwPublicipsId'
      );
   }
}

// URI: /operator/sddcs/{sddc}/mgws
export class API_OperatorSddcsSddcMgws<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/mgws';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseManagementGateway[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseManagementGateway(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcMgws'
      );
   }
}

// URI: /operator/sddcs/{sddc}/mgws/{gateway}
export class API_OperatorSddcsSddcMgwsGateway<T> {
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gateway: string) {
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/mgws/' + gateway;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseManagementGateway(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcMgwsGateway'
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
         'API_OperatorSddcsSddcMgwsGateway'
      );
   }
}

// URI: /operator/sddcs/{sddc}/password/{entity}
export class API_OperatorSddcsSddcPasswordEntity<T> {
   private sddc: string;
   private entity: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, entity: string) {
      this.sddc = sddc;
      this.entity = entity;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/password/' + entity;
      this.ref = ref;
   }

   public httpPut(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcPasswordEntity'
      );
   }
}

// URI: /operator/sddcs/{sddc}/publicips
export class API_OperatorSddcsSddcPublicips<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/publicips';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddcPublicIp[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcPublicIp(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcPublicips'
      );
   }

   public httpPost(spec: BaseSddcAllocatePublicIpSpec, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(spec);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcPublicips'
      );
   }
}

// URI: /operator/sddcs/{sddc}/publicips/{id}
export class API_OperatorSddcsSddcPublicipsId<T> {
   private sddc: string;
   private id: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, id: string) {
      this.sddc = sddc;
      this.id = id;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/publicips/' + id;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcPublicipsId'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddcPublicIp(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcPublicipsId'
      );
   }

   public httpPatch(
      action: string,
      SddcPublicIp_object: BaseSddcPublicIp,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      let uri = '';
      const _body = altBody ? altBody : JSON.stringify(SddcPublicIp_object);
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcPublicipsId'
      );
   }
}

// URI: /operator/sddcs/{sddc}/resource-config
export class API_OperatorSddcsSddcResourceconfig<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/resource-config';
      this.ref = ref;
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
         'API_OperatorSddcsSddcResourceconfig'
      );
   }
}

// URI: /operator/sddcs/{sddc}/sddc-manifest
export class API_OperatorSddcsSddcSddcmanifest<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/sddc-manifest';
      this.ref = ref;
   }

   public httpPatch(
      sddcManifest: BaseSddcManifest,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(sddcManifest);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddcManifest(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcSddcmanifest'
      );
   }
}

// URI: /operator/sddcs/{sddc}/sddc-manifest-latest
export class API_OperatorSddcsSddcSddcmanifestlatest<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/sddc-manifest-latest';
      this.ref = ref;
   }

   public httpPatch(configName: string, successHandler: Function, failureHandler: Function, altBody?: any) {
      let uri = '';
      const _body = altBody ? altBody : '';
      if (configName) {
         uri = uri + '&configName=' + configName;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddcManifest(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcSddcmanifestlatest'
      );
   }
}

// URI: /operator/sddcs/{sddc}/sddc-spec
export class API_OperatorSddcsSddcSddcspec<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/sddc-spec';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddcSpec[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcSpec(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcSddcspec'
      );
   }
}

// URI: /operator/sddcs/{sddc}/versions
export class API_OperatorSddcsSddcVersions<T> {
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string) {
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/versions';
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
            const rsp: BaseSddc[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddc(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcVersions'
      );
   }
}

// URI: /operator/sddcs/{sddc}/{gatewayType}/{gateway}/dns-servers
export class API_OperatorSddcsSddcGatewaytypeGatewayDnsservers<T> {
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gatewaytype: string, gateway: string) {
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/' + gatewaytype + '/' + gateway + '/dns-servers';
      this.ref = ref;
   }

   public httpPut(dns_servers: BaseDnsServers, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(dns_servers);
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayDnsservers'
      );
   }
}

// URI: /operator/sddcs/{sddc}/{gatewayType}/{gateway}/firewall-rules
export class API_OperatorSddcsSddcGatewaytypeGatewayFirewallrules<T> {
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gatewaytype: string, gateway: string) {
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/' + gatewaytype + '/' + gateway + '/firewall-rules';
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
         'API_OperatorSddcsSddcGatewaytypeGatewayFirewallrules'
      );
   }

   public httpPatch(
      rule_id: string,
      above_rule_id: string,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      let uri = '';
      const _body = altBody ? altBody : '';
      if (rule_id) {
         uri = uri + '&rule_id=' + rule_id;
      }
      if (above_rule_id) {
         uri = uri + '&above_rule_id=' + above_rule_id;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayFirewallrules'
      );
   }

   public httpPost(
      above_rule_id: string,
      rule: BaseFirewallRule,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = JSON.stringify(rule);
      if (above_rule_id) {
         uri = uri + '&above_rule_id=' + above_rule_id;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayFirewallrules'
      );
   }
}

// URI: /operator/sddcs/{sddc}/{gatewayType}/{gateway}/firewall-rules/{rule}
export class API_OperatorSddcsSddcGatewaytypeGatewayFirewallrulesRule<T> {
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private rule: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gatewaytype: string, gateway: string, rule: string) {
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.rule = rule;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/' + gatewaytype + '/' + gateway + '/firewall-rules/' + rule;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayFirewallrulesRule'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseFirewallRule(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayFirewallrulesRule'
      );
   }

   public httpPatch(successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : '';
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayFirewallrulesRule'
      );
   }
}

// URI: /operator/sddcs/{sddc}/{gatewayType}/{gateway}/vpns
export class API_OperatorSddcsSddcGatewaytypeGatewayVpns<T> {
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gatewaytype: string, gateway: string) {
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/' + gatewaytype + '/' + gateway + '/vpns';
      this.ref = ref;
   }

   public httpGet(showsensitivedata: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (showsensitivedata) {
         uri = uri + '&showsensitivedata=' + showsensitivedata;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseVpn[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseVpn(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayVpns'
      );
   }

   public httpPost(vpn: BaseVpn, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(vpn);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayVpns'
      );
   }
}

// URI: /operator/sddcs/{sddc}/{gatewayType}/{gateway}/vpns/genericvendorconfig/{vpnId}
export class API_OperatorSddcsSddcGatewaytypeGatewayVpnsGenericvendorconfigVpnid<T> {
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private vpnid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gatewaytype: string, gateway: string, vpnid: string) {
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.vpnid = vpnid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/' + gatewaytype
      + '/' + gateway + '/vpns/genericvendorconfig/' + vpnid;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {{ successHandler(ref, responseJSON); }},
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayVpnsGenericvendorconfigVpnid'
      );
   }
}

// URI: /operator/sddcs/{sddc}/{gatewayType}/{gateway}/vpns/vendorconfig/{vendor}
export class API_OperatorSddcsSddcGatewaytypeGatewayVpnsVendorconfigVendor<T> {
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private vendor: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gatewaytype: string, gateway: string, vendor: string) {
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.vendor = vendor;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/' +
      gatewaytype + '/' + gateway + '/vpns/vendorconfig/' + vendor;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {{ successHandler(ref, responseJSON); }},
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayVpnsVendorconfigVendor'
      );
   }
}

// URI: /operator/sddcs/{sddc}/{gatewayType}/{gateway}/vpns/{vpnId}
export class API_OperatorSddcsSddcGatewaytypeGatewayVpnsVpnid<T> {
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private vpnid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, sddc: string, gatewaytype: string, gateway: string, vpnid: string) {
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.vpnid = vpnid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/sddcs/' + sddc + '/' + gatewaytype + '/' + gateway + '/vpns/' + vpnid;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayVpnsVpnid'
      );
   }

   public httpGet(showsensitivedata: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (showsensitivedata) {
         uri = uri + '&showsensitivedata=' + showsensitivedata;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseVpn(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayVpnsVpnid'
      );
   }

   public httpPatch(vpn: BaseVpn, successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(vpn);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorSddcsSddcGatewaytypeGatewayVpnsVpnid'
      );
   }
}

// URI: /operator/tasks
export class API_OperatorTasks<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/tasks';
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
         'API_OperatorTasks'
      );
   }
}

// URI: /operator/tasks/summary
export class API_OperatorTasksSummary<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/tasks/summary';
      this.ref = ref;
   }

   public httpGet($filter: string, limit: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if ($filter) {
         uri = uri + '&$filter=' + $filter;
      }
      if (limit) {
         uri = uri + '&limit=' + limit;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseEntitySummary[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseEntitySummary(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorTasksSummary'
      );
   }
}

// URI: /operator/tasks/types/{taskType}/features
export class API_OperatorTasksTypesTasktypeFeatures<T> {
   private tasktype: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, tasktype: string) {
      this.tasktype = tasktype;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/tasks/types/' + tasktype + '/features';
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
         'API_OperatorTasksTypesTasktypeFeatures'
      );
   }
}

// URI: /operator/tasks/{task}
export class API_OperatorTasksTask<T> {
   private task: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, task: string) {
      this.task = task;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/tasks/' + task;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorTasksTask'
      );
   }

   public httpPost(
      action: string,
      sub_status: string,
      reason: string,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = '';
      if (action) {
         uri = uri + '&action=' + action;
      }
      if (sub_status) {
         uri = uri + '&sub_status=' + sub_status;
      }
      if (reason) {
         uri = uri + '&reason=' + reason;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorTasksTask'
      );
   }
}

// URI: /operator/tasks/{task}/versions
export class API_OperatorTasksTaskVersions<T> {
   private task: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, task: string) {
      this.task = task;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/tasks/' + task + '/versions';
      this.ref = ref;
   }

   public httpDelete(version: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (version) {
         uri = uri + '&version=' + version;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'DELETE', uri, _body,
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
         'API_OperatorTasksTaskVersions'
      );
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
         'API_OperatorTasksTaskVersions'
      );
   }
}

// URI: /operator/usage/jobs
export class API_OperatorUsageJobs<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/usage/jobs';
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
            const rsp: BaseUsageJob[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseUsageJob(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorUsageJobs'
      );
   }

   public httpPost(usageJobRequest: BaseUsageJobRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(usageJobRequest);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OperatorUsageJobs'
      );
   }
}

// URI: /operator/usage/jobs/{job}
export class API_OperatorUsageJobsJob<T> {
   private job: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, job: string) {
      this.job = job;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/usage/jobs/' + job;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseUsageJob(responseJSON)); },
         failureHandler,
         'API_OperatorUsageJobsJob'
      );
   }
}

// URI: /operator/usage/jobs/{job}/batches
export class API_OperatorUsageJobsJobBatches<T> {
   private job: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, job: string) {
      this.job = job;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/usage/jobs/' + job + '/batches';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseUsageJobBatch[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseUsageJobBatch(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OperatorUsageJobsJobBatches'
      );
   }
}

// URI: /operator/usage/jobs/{job}/batches/{batch}
export class API_OperatorUsageJobsJobBatchesBatch<T> {
   private job: string;
   private batch: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, job: string, batch: string) {
      this.job = job;
      this.batch = batch;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/usage/jobs/' + job + '/batches/' + batch;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseUsageJobBatch(responseJSON)); },
         failureHandler,
         'API_OperatorUsageJobsJobBatchesBatch'
      );
   }
}

// URI: /operator/usage/jobs/{job}/report
export class API_OperatorUsageJobsJobReport<T> {
   private job: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, job: string) {
      this.job = job;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/operator/usage/jobs/' + job + '/report';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OperatorUsageJobsJobReport'
      );
   }
}

// URI: /orgs
export class API_Orgs<T> {
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T) {
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs';
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
         'API_Orgs'
      );
   }
}

// URI: /orgs/{org}
export class API_OrgsOrg<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseOrganization(responseJSON)); },
         failureHandler,
         'API_OrgsOrg'
      );
   }
}

// URI: /orgs/{org}/account-link
export class API_OrgsOrgAccountlink<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OrgsOrgAccountlink'
      );
   }
}

// URI: /orgs/{org}/account-link/compatible-subnets
export class API_OrgsOrgAccountlinkCompatiblesubnets<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/compatible-subnets';
      this.ref = ref;
   }

   public httpGet(
      linkedaccountid: string,
      region: string,
      sddc: string,
      forcerefresh: boolean,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = '';
      if (linkedaccountid) {
         uri = uri + '&linkedaccountid=' + linkedaccountid;
      }
      if (region) {
         uri = uri + '&region=' + region;
      }
      if (sddc) {
         uri = uri + '&sddc=' + sddc;
      }
      if (forcerefresh) {
         uri = uri + '&forcerefresh=' + forcerefresh;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsCompatibleSubnets(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkCompatiblesubnets'
      );
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsSubnet(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkCompatiblesubnets'
      );
   }
}

// URI: /orgs/{org}/account-link/compatible-subnets-async
export class API_OrgsOrgAccountlinkCompatiblesubnetsasync<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/compatible-subnets-async';
      this.ref = ref;
   }

   public httpGet(
      linkedaccountid: string,
      region: string,
      sddc: string,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = '';
      if (linkedaccountid) {
         uri = uri + '&linkedaccountid=' + linkedaccountid;
      }
      if (region) {
         uri = uri + '&region=' + region;
      }
      if (sddc) {
         uri = uri + '&sddc=' + sddc;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkCompatiblesubnetsasync'
      );
   }

   public httpPost(aws_subnet: BaseAwsSubnet, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(aws_subnet);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkCompatiblesubnetsasync'
      );
   }
}

// URI: /orgs/{org}/account-link/connected-accounts
export class API_OrgsOrgAccountlinkConnectedaccounts<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/connected-accounts';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsCustomerConnectedAccount[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsCustomerConnectedAccount(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgAccountlinkConnectedaccounts'
      );
   }
}

// URI: /orgs/{org}/account-link/connected-accounts/{linkedAccountPathId}
export class API_OrgsOrgAccountlinkConnectedaccountsLinkedaccountpathid<T> {
   private org: string;
   private linkedaccountpathid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, linkedaccountpathid: string) {
      this.org = org;
      this.linkedaccountpathid = linkedaccountpathid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/connected-accounts/' + linkedaccountpathid;
      this.ref = ref;
   }

   public httpDelete(forceevenwhensddcpresent: boolean, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (forceevenwhensddcpresent) {
         uri = uri + '&forceevenwhensddcpresent=' + forceevenwhensddcpresent;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsCustomerConnectedAccount(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkConnectedaccountsLinkedaccountpathid'
      );
   }
}

// URI: /orgs/{org}/account-link/connected-services/available
export class API_OrgsOrgAccountlinkConnectedservicesAvailable<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/connected-services/available';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseServicesAvailableResult(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkConnectedservicesAvailable'
      );
   }
}

// URI: /orgs/{org}/account-link/connected-services/sddcs/{sddc}/{serviceId}
export class API_OrgsOrgAccountlinkConnectedservicesSddcsSddcServiceid<T> {
   private org: string;
   private sddc: string;
   private serviceid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, serviceid: string) {
      this.org = org;
      this.sddc = sddc;
      this.serviceid = serviceid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/connected-services/sddcs/' + sddc + '/' + serviceid;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseConnectedServiceStatus(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkConnectedservicesSddcsSddcServiceid'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseConnectedServiceStatus(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkConnectedservicesSddcsSddcServiceid'
      );
   }

   public httpPatch(successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : '';
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseConnectedServiceStatus(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkConnectedservicesSddcsSddcServiceid'
      );
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseConnectedServiceStatus(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkConnectedservicesSddcsSddcServiceid'
      );
   }
}

// URI: /orgs/{org}/account-link/customer-aws-account
export class API_OrgsOrgAccountlinkCustomerawsaccount<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/customer-aws-account';
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsCustomerLinkedAccount[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsCustomerLinkedAccount(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgAccountlinkCustomerawsaccount'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsCustomerLinkedAccount[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsCustomerLinkedAccount(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgAccountlinkCustomerawsaccount'
      );
   }
}

// URI: /orgs/{org}/account-link/map-customer-zones
export class API_OrgsOrgAccountlinkMapcustomerzones<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/map-customer-zones';
      this.ref = ref;
   }

   public httpPost(mapZonesRequest: BaseMapZonesRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(mapZonesRequest);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkMapcustomerzones'
      );
   }
}

// URI: /orgs/{org}/account-link/network-link-ready
export class API_OrgsOrgAccountlinkNetworklinkready<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/network-link-ready';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccountLinkStatus(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAccountlinkNetworklinkready'
      );
   }
}

// URI: /orgs/{org}/account-link/sddc-connections
export class API_OrgsOrgAccountlinkSddcconnections<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/account-link/sddc-connections';
      this.ref = ref;
   }

   public httpGet(sddc: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (sddc) {
         uri = uri + '&sddc=' + sddc;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseAwsSddcConnection[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseAwsSddcConnection(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgAccountlinkSddcconnections'
      );
   }
}

// URI: /orgs/{org}/aws
export class API_OrgsOrgAws<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/aws';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsAccountResponseStructure(responseJSON)); },
         failureHandler,
         'API_OrgsOrgAws'
      );
   }
}

// URI: /orgs/{org}/config
export class API_OrgsOrgConfig<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/config';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseConfigResponse(responseJSON)); },
         failureHandler,
         'API_OrgsOrgConfig'
      );
   }
}

// URI: /orgs/{org}/delegated-access/pop/sddcs/{sddc}
export class API_OrgsOrgDelegatedaccessPopSddcsSddc<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/delegated-access/pop/sddcs/' + sddc;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgDelegatedaccessPopSddcsSddc'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAgentSshAccessResponse(responseJSON)); },
         failureHandler,
         'API_OrgsOrgDelegatedaccessPopSddcsSddc'
      );
   }

   public httpPatch(
      request_info: BaseAgentSshAccessRequest,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(request_info);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgDelegatedaccessPopSddcsSddc'
      );
   }

   public httpPost(request_info: BaseAgentSshAccessRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(request_info);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgDelegatedaccessPopSddcsSddc'
      );
   }
}

// URI: /orgs/{org}/delegated-access/ssh/sddcs/{sddc}
export class API_OrgsOrgDelegatedaccessSshSddcsSddc<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/delegated-access/ssh/sddcs/' + sddc;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgDelegatedaccessSshSddcsSddc'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseDelegatedAccessSshResponse(responseJSON)); },
         failureHandler,
         'API_OrgsOrgDelegatedaccessSshSddcsSddc'
      );
   }

   public httpPatch(
      request_info: BaseDelegatedAccessSshRequest,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(request_info);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgDelegatedaccessSshSddcsSddc'
      );
   }

   public httpPost(request_info: BaseDelegatedAccessSshRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(request_info);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgDelegatedaccessSshSddcsSddc'
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

// URI: /orgs/{org}/offer-instances
export class API_OrgsOrgOfferinstances<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/offer-instances';
      this.ref = ref;
   }

   public httpGet(region: string, product_type: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (region) {
         uri = uri + '&region=' + region;
      }
      if (product_type) {
         uri = uri + '&product_type=' + product_type;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseOfferInstancesHolder(responseJSON)); },
         failureHandler,
         'API_OrgsOrgOfferinstances'
      );
   }
}

// URI: /orgs/{org}/providers
export class API_OrgsOrgProviders<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/providers';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            if (responseJSON) {
               const base_class = new BaseCloudProvider(responseJSON);
               const disc = base_class.provider;
               switch(disc) {
                  case 'AWS': {
                     const rsp: BaseAwsCloudProvider[] = [];
                     for(let item of responseJSON) {
                        rsp.push(new BaseAwsCloudProvider(item));
                     }
                     successHandler(ref, rsp);
                     break;
                  }
                  default: {
                     throw new TypeError('Unknown discriminator value: ' + disc);
                  }
               }
            }
         },
         failureHandler,
         'API_OrgsOrgProviders'
      );
   }
}

// URI: /orgs/{org}/reservations
export class API_OrgsOrgReservations<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/reservations';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseMaintenanceWindowEntry[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseMaintenanceWindowEntry(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgReservations'
      );
   }
}

// URI: /orgs/{org}/reservations/{reservation}/mw
export class API_OrgsOrgReservationsReservationMw<T> {
   private org: string;
   private reservation: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, reservation: string) {
      this.org = org;
      this.reservation = reservation;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/reservations/' + reservation + '/mw';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseMaintenanceWindowGet(responseJSON)); },
         failureHandler,
         'API_OrgsOrgReservationsReservationMw'
      );
   }

   public httpPut(window: BaseMaintenanceWindow, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(window);
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseMaintenanceWindow(responseJSON)); },
         failureHandler,
         'API_OrgsOrgReservationsReservationMw'
      );
   }
}

// URI: /orgs/{org}/sddc-templates
export class API_OrgsOrgSddctemplates<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddc-templates';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddcTemplate[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcTemplate(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddctemplates'
      );
   }
}

// URI: /orgs/{org}/sddc-templates/{templateId}
export class API_OrgsOrgSddctemplatesTemplateid<T> {
   private org: string;
   private templateid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, templateid: string) {
      this.org = org;
      this.templateid = templateid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddc-templates/' + templateid;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddctemplatesTemplateid'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddcTemplate(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddctemplatesTemplateid'
      );
   }
}

// URI: /orgs/{org}/sddcs
export class API_OrgsOrgSddcs<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddc[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddc(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcs'
      );
   }

   public httpPost(sddcConfig: BaseSddcConfig, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(sddcConfig);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcs'
      );
   }
}

// URI: /orgs/{org}/sddcs/provisioning-specs
export class API_OrgsOrgSddcsProvisioningspecs<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/provisioning-specs';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddcProvisioningSpec[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcProvisioningSpec(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsProvisioningspecs'
      );
   }
}

// URI: /orgs/{org}/sddcs/sddc-capabilities
export class API_OrgsOrgSddcsSddccapabilities<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/sddc-capabilities';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddcCapability[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcCapability(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddccapabilities'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}
export class API_OrgsOrgSddcsSddc<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc;
      this.ref = ref;
   }

   public httpDelete(
      retain_configuration: boolean,
      template_name: string,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = '';
      if (retain_configuration) {
         uri = uri + '&retain_configuration=' + retain_configuration;
      }
      if (template_name) {
         uri = uri + '&template_name=' + template_name;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddc'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddc(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddc'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/account-link/xvpc-links
export class API_OrgsOrgSddcsSddcAccountlinkXvpclinks<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/account-link/xvpc-links';
      this.ref = ref;
   }

   public httpPost(sddcConfig: BaseSddcConfig, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(sddcConfig);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcAccountlinkXvpclinks'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/agent
export class API_OrgsOrgSddcsSddcAgent<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/agent';
      this.ref = ref;
   }

   public httpPatch(action: string, successHandler: Function, failureHandler: Function, altBody?: any) {
      let uri = '';
      const _body = altBody ? altBody : '';
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcAgent'
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
         'API_OrgsOrgSddcsSddcAgent'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/bgproutes
export class API_OrgsOrgSddcsSddcBgproutes<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/bgproutes';
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
         'API_OrgsOrgSddcsSddcBgproutes'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/cgws
export class API_OrgsOrgSddcsSddcCgws<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/cgws';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseComputeGateway[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseComputeGateway(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgws'
      );
   }

   public httpPost(cgw_name: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (cgw_name) {
         uri = uri + '&cgw_name=' + cgw_name;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgws'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/cgws/{gateway}
export class API_OrgsOrgSddcsSddcCgwsGateway<T> {
   private org: string;
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/cgws/' + gateway;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseComputeGateway(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGateway'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/cgws/{gateway}/l2vpn
export class API_OrgsOrgSddcsSddcCgwsGatewayL2vpn<T> {
   private org: string;
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/cgws/' + gateway + '/l2vpn';
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayL2vpn'
      );
   }

   public httpGet(showsensitivedata: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (showsensitivedata) {
         uri = uri + '&showsensitivedata=' + showsensitivedata;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseL2Vpn[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseL2Vpn(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayL2vpn'
      );
   }

   public httpPatch(l2Vpn: BaseL2Vpn, successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(l2Vpn);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayL2vpn'
      );
   }

   public httpPost(l2Vpn: BaseL2Vpn, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(l2Vpn);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayL2vpn'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/cgws/{gateway}/nat-rules
export class API_OrgsOrgSddcsSddcCgwsGatewayNatrules<T> {
   private org: string;
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/cgws/' + gateway + '/nat-rules';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseNatRule[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseNatRule(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayNatrules'
      );
   }

   public httpPatch(
      rule_id: string,
      above_rule_id: string,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      let uri = '';
      const _body = altBody ? altBody : '';
      if (rule_id) {
         uri = uri + '&rule_id=' + rule_id;
      }
      if (above_rule_id) {
         uri = uri + '&above_rule_id=' + above_rule_id;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayNatrules'
      );
   }

   public httpPost(above_rule_id: string, rule: BaseNatRule, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = JSON.stringify(rule);
      if (above_rule_id) {
         uri = uri + '&above_rule_id=' + above_rule_id;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayNatrules'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/cgws/{gateway}/nat-rules/{rule}
export class API_OrgsOrgSddcsSddcCgwsGatewayNatrulesRule<T> {
   private org: string;
   private sddc: string;
   private gateway: string;
   private rule: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gateway: string, rule: string) {
      this.org = org;
      this.sddc = sddc;
      this.gateway = gateway;
      this.rule = rule;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/cgws/' + gateway + '/nat-rules/' + rule;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayNatrulesRule'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseNatRule(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayNatrulesRule'
      );
   }

   public httpPatch(successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : '';
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayNatrulesRule'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/cgws/{gateway}/networks
export class API_OrgsOrgSddcsSddcCgwsGatewayNetworks<T> {
   private org: string;
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/cgws/' + gateway + '/networks';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseLogicalNetwork[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseLogicalNetwork(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayNetworks'
      );
   }

   public httpPost(logicalNetwork: BaseLogicalNetwork, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(logicalNetwork);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayNetworks'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/cgws/{gateway}/networks/{networkId}
export class API_OrgsOrgSddcsSddcCgwsGatewayNetworksNetworkid<T> {
   private org: string;
   private sddc: string;
   private gateway: string;
   private networkid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gateway: string, networkid: string) {
      this.org = org;
      this.sddc = sddc;
      this.gateway = gateway;
      this.networkid = networkid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/cgws/' + gateway + '/networks/' + networkid;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcCgwsGatewayNetworksNetworkid'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/clusters
export class API_OrgsOrgSddcsSddcClusters<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/clusters';
      this.ref = ref;
   }

   public httpPost(clusterConfig: BaseClusterConfig, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(clusterConfig);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcClusters'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/clusters/{cluster}
export class API_OrgsOrgSddcsSddcClustersCluster<T> {
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
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/clusters/' + cluster;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcClustersCluster'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/clusters/{cluster}/replace-witness
export class API_OrgsOrgSddcsSddcClustersClusterReplacewitness<T> {
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
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/clusters/' + cluster + '/replace-witness';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcClustersClusterReplacewitness'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/convert
export class API_OrgsOrgSddcsSddcConvert<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/convert';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcConvert'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/dns/private
export class API_OrgsOrgSddcsSddcDnsPrivate<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/dns/private';
      this.ref = ref;
   }

   public httpPut(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcDnsPrivate'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/dns/public
export class API_OrgsOrgSddcsSddcDnsPublic<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/dns/public';
      this.ref = ref;
   }

   public httpPut(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcDnsPublic'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/esxs
export class API_OrgsOrgSddcsSddcEsxs<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/esxs';
      this.ref = ref;
   }

   public httpPost(action: string, esxConfig: BaseEsxConfig, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = JSON.stringify(esxConfig);
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcEsxs'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/management-vms
export class API_OrgsOrgSddcsSddcManagementvms<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/management-vms';
      this.ref = ref;
   }

   public httpPost(managementVmConfig: BaseManagementVmConfig, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(managementVmConfig);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcManagementvms'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/management-vms/{managementVmId}
export class API_OrgsOrgSddcsSddcManagementvmsManagementvmid<T> {
   private org: string;
   private sddc: string;
   private managementvmid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, managementvmid: string) {
      this.org = org;
      this.sddc = sddc;
      this.managementvmid = managementvmid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/management-vms/' + managementvmid;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcManagementvmsManagementvmid'
      );
   }

   public httpPatch(
      managementVmConfig: BaseManagementVmConfig,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(managementVmConfig);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcManagementvmsManagementvmid'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/management-vms/{managementVmId}/certificate
export class API_OrgsOrgSddcsSddcManagementvmsManagementvmidCertificate<T> {
   private org: string;
   private sddc: string;
   private managementvmid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, managementvmid: string) {
      this.org = org;
      this.sddc = sddc;
      this.managementvmid = managementvmid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/management-vms/' + managementvmid + '/certificate';
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcManagementvmsManagementvmidCertificate'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseManagementVmCertificate(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcManagementvmsManagementvmidCertificate'
      );
   }

   public httpPost(
      validDays: number,
      csr: BaseManagementVmCsrParam,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = JSON.stringify(csr);
      if (validDays) {
         uri = uri + '&validDays=' + validDays;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcManagementvmsManagementvmidCertificate'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/mgw/publicips
export class API_OrgsOrgSddcsSddcMgwPublicips<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/mgw/publicips';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddcPublicIp[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcPublicIp(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcMgwPublicips'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/mgw/publicips/{id}
export class API_OrgsOrgSddcsSddcMgwPublicipsId<T> {
   private org: string;
   private sddc: string;
   private id: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, id: string) {
      this.org = org;
      this.sddc = sddc;
      this.id = id;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/mgw/publicips/' + id;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddcPublicIp(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcMgwPublicipsId'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/mgws
export class API_OrgsOrgSddcsSddcMgws<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/mgws';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseManagementGateway[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseManagementGateway(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcMgws'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/mgws/{gateway}
export class API_OrgsOrgSddcsSddcMgwsGateway<T> {
   private org: string;
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/mgws/' + gateway;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseManagementGateway(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcMgwsGateway'
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
         'API_OrgsOrgSddcsSddcMgwsGateway'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/mgws/{gateway}/default-firewall-rules
export class API_OrgsOrgSddcsSddcMgwsGatewayDefaultfirewallrules<T> {
   private org: string;
   private sddc: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/mgws/' + gateway + '/default-firewall-rules';
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
         'API_OrgsOrgSddcsSddcMgwsGatewayDefaultfirewallrules'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/networking/connectivity-tests
export class API_OrgsOrgSddcsSddcNetworkingConnectivitytests<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/networking/connectivity-tests';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseConnectivityValidationGroups(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcNetworkingConnectivitytests'
      );
   }

   public httpPost(
      request_info: BaseConnectivityValidationGroup,
      action: string,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = JSON.stringify(request_info);
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcNetworkingConnectivitytests'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/publicips
export class API_OrgsOrgSddcsSddcPublicips<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/publicips';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddcPublicIp[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcPublicIp(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcPublicips'
      );
   }

   public httpPost(spec: BaseSddcAllocatePublicIpSpec, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(spec);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcPublicips'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/publicips/{id}
export class API_OrgsOrgSddcsSddcPublicipsId<T> {
   private org: string;
   private sddc: string;
   private id: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, id: string) {
      this.org = org;
      this.sddc = sddc;
      this.id = id;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/publicips/' + id;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcPublicipsId'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddcPublicIp(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcPublicipsId'
      );
   }

   public httpPatch(
      action: string,
      SddcPublicIp_object: BaseSddcPublicIp,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      let uri = '';
      const _body = altBody ? altBody : JSON.stringify(SddcPublicIp_object);
      if (action) {
         uri = uri + '&action=' + action;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcPublicipsId'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/push-dvs-property
export class API_OrgsOrgSddcsSddcPushdvsproperty<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/push-dvs-property';
      this.ref = ref;
   }

   public httpPost(dvsProperty: BaseDvsProperty, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(dvsProperty);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcPushdvsproperty'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/reconfigure-mgmt-cluster-reservation
export class API_OrgsOrgSddcsSddcReconfiguremgmtclusterreservation<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/reconfigure-mgmt-cluster-reservation';
      this.ref = ref;
   }

   public httpPost(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcReconfiguremgmtclusterreservation'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/reverse-proxy
export class API_OrgsOrgSddcsSddcReverseproxy<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/reverse-proxy';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseReverseProxyEpConfig[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseReverseProxyEpConfig(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcReverseproxy'
      );
   }

   public httpPost(
      reverseProxyEpConfig: BaseReverseProxyEpConfig,
      successHandler: Function,
      failureHandler: Function
   ) {
      const uri = this.uri;
      const _body = JSON.stringify(reverseProxyEpConfig);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcReverseproxy'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/reverse-proxy/{serverType}/{endpoint}
export class API_OrgsOrgSddcsSddcReverseproxyServertypeEndpoint<T> {
   private org: string;
   private sddc: string;
   private servertype: string;
   private endpoint: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, servertype: string, endpoint: string) {
      this.org = org;
      this.sddc = sddc;
      this.servertype = servertype;
      this.endpoint = endpoint;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/reverse-proxy/' + servertype + '/' + endpoint;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcReverseproxyServertypeEndpoint'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/sddc-manifest
export class API_OrgsOrgSddcsSddcSddcmanifest<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/sddc-manifest';
      this.ref = ref;
   }

   public httpPatch(
      sddcManifest: BaseSddcManifest,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(sddcManifest);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, response: any) => { successHandler(ref, response); },
         failureHandler,
         'API_OrgsOrgSddcsSddcSddcmanifest'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/sddc-manifest-latest
export class API_OrgsOrgSddcsSddcSddcmanifestlatest<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/sddc-manifest-latest';
      this.ref = ref;
   }

   public httpPatch(configName: string, successHandler: Function, failureHandler: Function, altBody?: any) {
      let uri = '';
      const _body = altBody ? altBody : '';
      if (configName) {
         uri = uri + '&configName=' + configName;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddcManifest(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcSddcmanifestlatest'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/sddc-spec
export class API_OrgsOrgSddcsSddcSddcspec<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/sddc-spec';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSddcSpec[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSddcSpec(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcSddcspec'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/sddc-template
export class API_OrgsOrgSddcsSddcSddctemplate<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/sddc-template';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSddcTemplate(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcSddctemplate'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/vifs
export class API_OrgsOrgSddcsSddcVifs<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/vifs';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseVirtualInterface[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseVirtualInterface(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcVifs'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/vifs/{vif}
export class API_OrgsOrgSddcsSddcVifsVif<T> {
   private org: string;
   private sddc: string;
   private vif: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, vif: string) {
      this.org = org;
      this.sddc = sddc;
      this.vif = vif;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/vifs/' + vif;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcVifsVif'
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
         'API_OrgsOrgSddcsSddcVifsVif'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/xvpc-zone
export class API_OrgsOrgSddcsSddcXvpczone<T> {
   private org: string;
   private sddc: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string) {
      this.org = org;
      this.sddc = sddc;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/xvpc-zone';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsSddcConnection(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcXvpczone'
      );
   }

   public httpPost(zoneChangeRequest: BaseZoneChangeRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(zoneChangeRequest);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseAwsSddcConnection(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcXvpczone'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/{gatewayType}/{gateway}/dns-servers
export class API_OrgsOrgSddcsSddcGatewaytypeGatewayDnsservers<T> {
   private org: string;
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gatewaytype: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/' + gatewaytype + '/' + gateway + '/dns-servers';
      this.ref = ref;
   }

   public httpPut(dns_servers: BaseDnsServers, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(dns_servers);
      this.httpFn(this.ref, 'PUT', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayDnsservers'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/{gatewayType}/{gateway}/firewall-rules
export class API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrules<T> {
   private org: string;
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gatewaytype: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/' + gatewaytype + '/' + gateway + '/firewall-rules';
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
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrules'
      );
   }

   public httpPatch(
      rule_id: string,
      above_rule_id: string,
      successHandler: Function,
      failureHandler: Function,
      altBody?: any
   ) {
      let uri = '';
      const _body = altBody ? altBody : '';
      if (rule_id) {
         uri = uri + '&rule_id=' + rule_id;
      }
      if (above_rule_id) {
         uri = uri + '&above_rule_id=' + above_rule_id;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrules'
      );
   }

   public httpPost(
      above_rule_id: string,
      rule: BaseFirewallRule,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = JSON.stringify(rule);
      if (above_rule_id) {
         uri = uri + '&above_rule_id=' + above_rule_id;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrules'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/{gatewayType}/{gateway}/firewall-rules-collection
export class API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrulescollection<T> {
   private org: string;
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gatewaytype: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/' +
      gatewaytype + '/' + gateway + '/firewall-rules-collection';
      this.ref = ref;
   }

   public httpPost(rule: any, above_rule_id: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = rule.toString();
      if (above_rule_id) {
         uri = uri + '&above_rule_id=' + above_rule_id;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrulescollection'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/{gatewayType}/{gateway}/firewall-rules/{rule}
export class API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrulesRule<T> {
   private org: string;
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private rule: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gatewaytype: string, gateway: string, rule: string) {
      this.org = org;
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.rule = rule;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/' +
      gatewaytype + '/' + gateway + '/firewall-rules/' + rule;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrulesRule'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseFirewallRule(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrulesRule'
      );
   }

   public httpPatch(successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : '';
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayFirewallrulesRule'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/{gatewayType}/{gateway}/vpns
export class API_OrgsOrgSddcsSddcGatewaytypeGatewayVpns<T> {
   private org: string;
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gatewaytype: string, gateway: string) {
      this.org = org;
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/' + gatewaytype + '/' + gateway + '/vpns';
      this.ref = ref;
   }

   public httpGet(showsensitivedata: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (showsensitivedata) {
         uri = uri + '&showsensitivedata=' + showsensitivedata;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseVpn[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseVpn(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayVpns'
      );
   }

   public httpPost(vpn: BaseVpn, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(vpn);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayVpns'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/{gatewayType}/{gateway}/vpns/genericvendorconfig/{vpnId}
export class API_OrgsOrgSddcsSddcGatewaytypeGatewayVpnsGenericvendorconfigVpnid<T> {
   private org: string;
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private vpnid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gatewaytype: string, gateway: string, vpnid: string) {
      this.org = org;
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.vpnid = vpnid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/' +
      gatewaytype + '/' + gateway + '/vpns/genericvendorconfig/' + vpnid;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {{ successHandler(ref, responseJSON); }},
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayVpnsGenericvendorconfigVpnid'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/{gatewayType}/{gateway}/vpns/vendorconfig/{vendor}
export class API_OrgsOrgSddcsSddcGatewaytypeGatewayVpnsVendorconfigVendor<T> {
   private org: string;
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private vendor: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gatewaytype: string, gateway: string, vendor: string) {
      this.org = org;
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.vendor = vendor;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/' +
      gatewaytype + '/' + gateway + '/vpns/vendorconfig/' + vendor;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {{ successHandler(ref, responseJSON); }},
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayVpnsVendorconfigVendor'
      );
   }
}

// URI: /orgs/{org}/sddcs/{sddc}/{gatewayType}/{gateway}/vpns/{vpnId}
export class API_OrgsOrgSddcsSddcGatewaytypeGatewayVpnsVpnid<T> {
   private org: string;
   private sddc: string;
   private gatewaytype: string;
   private gateway: string;
   private vpnid: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, sddc: string, gatewaytype: string, gateway: string, vpnid: string) {
      this.org = org;
      this.sddc = sddc;
      this.gatewaytype = gatewaytype;
      this.gateway = gateway;
      this.vpnid = vpnid;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/sddcs/' + sddc + '/' + gatewaytype + '/' + gateway + '/vpns/' + vpnid;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayVpnsVpnid'
      );
   }

   public httpGet(showsensitivedata: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (showsensitivedata) {
         uri = uri + '&showsensitivedata=' + showsensitivedata;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseVpn(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayVpnsVpnid'
      );
   }

   public httpPatch(vpn: BaseVpn, successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(vpn);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSddcsSddcGatewaytypeGatewayVpnsVpnid'
      );
   }
}

// URI: /orgs/{org}/subscriptions
export class API_OrgsOrgSubscriptions<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/subscriptions';
      this.ref = ref;
   }

   public httpGet(offer_type: string, successHandler: Function, failureHandler: Function) {
      let uri = '';
      const _body = '';
      if (offer_type) {
         uri = uri + '&offer_type=' + offer_type;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => {
            const rsp: BaseSubscriptionDetails[] = [];
            if (responseJSON) {
                for(let item of responseJSON) {
                   rsp.push(new BaseSubscriptionDetails(item));
                }
            }
            successHandler(ref, rsp);
         },
         failureHandler,
         'API_OrgsOrgSubscriptions'
      );
   }

   public httpPost(subscriptionRequest: BaseSubscriptionRequest, successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = JSON.stringify(subscriptionRequest);
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSubscriptions'
      );
   }
}

// URI: /orgs/{org}/subscriptions/{subscription}
export class API_OrgsOrgSubscriptionsSubscription<T> {
   private org: string;
   private subscription: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, subscription: string) {
      this.org = org;
      this.subscription = subscription;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/subscriptions/' + subscription;
      this.ref = ref;
   }

   public httpDelete(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'DELETE', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSubscriptionsSubscription'
      );
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseSubscriptionDetails(responseJSON)); },
         failureHandler,
         'API_OrgsOrgSubscriptionsSubscription'
      );
   }
}

// URI: /orgs/{org}/tasks
export class API_OrgsOrgTasks<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/tasks';
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
         'API_OrgsOrgTasks'
      );
   }
}

// URI: /orgs/{org}/tasks/types
export class API_OrgsOrgTasksTypes<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/tasks/types';
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
         'API_OrgsOrgTasksTypes'
      );
   }
}

// URI: /orgs/{org}/tasks/{task}
export class API_OrgsOrgTasksTask<T> {
   private org: string;
   private task: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string, task: string) {
      this.org = org;
      this.task = task;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/tasks/' + task;
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgTasksTask'
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
         'API_OrgsOrgTasksTask'
      );
   }
}

// URI: /orgs/{org}/upgradesddc
export class API_OrgsOrgUpgradesddc<T> {
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, org: string) {
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/orgs/' + org + '/upgradesddc';
      this.ref = ref;
   }

   public httpPost(
      sddcUpgradeEventRequestParam: BaseSddcUpgradeEventRequest,
      notify: boolean,
      successHandler: Function,
      failureHandler: Function
   ) {
      let uri = '';
      const _body = JSON.stringify(sddcUpgradeEventRequestParam);
      if (notify) {
         uri = uri + '&notify=' + notify;
      }
      uri = this.uri + uri.replace('&', '?');
      this.httpFn(this.ref, 'POST', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseTask(responseJSON)); },
         failureHandler,
         'API_OrgsOrgUpgradesddc'
      );
   }
}



/* >>> END OF FILE <<< */

/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * AUTO-GENERATED 2018-05-15 16:08:13 - DO NOT EDIT DIRECTLY
 *
 */

// tslint:disable





/* ********************************************** BaseRolesPatchParams ********************************************** */
export class BaseRolesPatchParams {
    public  roleNamesToAdd       : Array<string>;    // description: Array of role names to add
    public  roleNamesToRemove    : Array<string>;    // description: Array of role names to remove
    public  serviceDefinitionLink: string;    // description: Service Definition Link
    constructor (json?: any) {
        if (json) {
            this.roleNamesToAdd = json['roleNamesToAdd'];
            this.roleNamesToRemove = json['roleNamesToRemove'];
            this.serviceDefinitionLink = json['serviceDefinitionLink'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.roleNamesToAdd !== undefined
            && this.roleNamesToRemove !== undefined
            && this.serviceDefinitionLink !== undefined;
    }
}

/* ********************************************* BaseRolesPatchResponse ********************************************* */
export class BaseRolesPatchResponse {
    public  roleNamesToAdd       : Array<string>;    // description: Array of role names to add
    public  roleNamesToRemove    : Array<string>;    // description: Array of role names to remove
    public  serviceDefinitionLink: string;    // description: Service Definition Link
    constructor (json?: any) {
        if (json) {
            this.roleNamesToAdd = json['roleNamesToAdd'];
            this.roleNamesToRemove = json['roleNamesToRemove'];
            this.serviceDefinitionLink = json['serviceDefinitionLink'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.roleNamesToAdd !== undefined
            && this.roleNamesToRemove !== undefined
            && this.serviceDefinitionLink !== undefined;
    }
}

/* *********************************************** BaseRolesResponse ************************************************ */
export class BaseRolesResponse {
    public  serviceRoles: Array<BaseServiceRole>;
    constructor (json?: any) {
        if (json) {

            if (json['serviceRoles']) {
                this.serviceRoles = [];
                for (let item of json['serviceRoles']) {
                    this.serviceRoles.push(Object.assign(new BaseServiceRole(item), item));
                }
            }
        }
    }

    public hasRequiredProperties(): boolean {
        return this.serviceRoles !== undefined;
    }
}

/* ************************************************ BaseServiceRole ************************************************* */
export class BaseServiceRole {
    public  serviceDefinitionLink: string;    // description: Service Definition Link
    public  serviceRoleNames     : Array<string>;    // description: List of role names for this user
    constructor (json?: any) {
        if (json) {
            this.serviceDefinitionLink = json['serviceDefinitionLink'];
            this.serviceRoleNames = json['serviceRoleNames'];
        }
    }

    public hasRequiredProperties(): boolean {
        return this.serviceDefinitionLink !== undefined
            && this.serviceRoleNames !== undefined;
    }
}




/*  ================================================================================================================ */
/*  PATHS                                                                                                            */
/*  ================================================================================================================ */

export const BASE_PATH = '/api/csp';

// URI: /am/api/users/{userId}/orgs/{org}/service-roles
export class API_AmApiUsersUseridOrgsOrgServiceroles<T> {
   private userid: string;
   private org: string;
   private httpFn: Function;
   private uri: string;
   private ref: T;

   constructor(httpFn: Function, ref: T, userid: string, org: string) {
      this.userid = userid;
      this.org = org;
      this.httpFn = httpFn;
      this.uri = BASE_PATH + '/am/api/users/' + userid + '/orgs/' + org + '/service-roles';
      this.ref = ref;
   }

   public httpGet(successHandler: Function, failureHandler: Function) {
      const uri = this.uri;
      const _body = '';
      this.httpFn(this.ref, 'GET', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseRolesResponse(responseJSON)); },
         failureHandler,
         'API_AmApiUsersUseridOrgsOrgServiceroles'
      );
   }

   public httpPatch(body: BaseRolesPatchParams, successHandler: Function, failureHandler: Function, altBody?: any) {
      const uri = this.uri;
      const _body = altBody ? altBody : JSON.stringify(body);
      this.httpFn(this.ref, 'PATCH', uri, _body,
         (ref: T, responseJSON: any) => { successHandler(ref, new BaseRolesPatchResponse(responseJSON)); },
         failureHandler,
         'API_AmApiUsersUseridOrgsOrgServiceroles'
      );
   }
}



/* >>> END OF FILE <<< */

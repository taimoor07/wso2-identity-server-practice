import { IdentityClient } from "@wso2/identity-oidc-js";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../../../store";
import { SearchRoleInterface } from "../models";

/**
 * Initialize an axios Http client.
 */
const httpClient = IdentityClient.getInstance()
    .httpRequest.bind(IdentityClient.getInstance())
    .bind(IdentityClient.getInstance());

// get current user
export const getCurrentUser = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.me
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

// get assigned and unassigned roles for user
export const getRolesForUser = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.groups + "?filter=displayName+sw+APP_&attributes=displayName"
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};
// self assignment -- subscribe current user for role
export const subscribeUserForRole = (roleId, roleData): Promise<any> => {
    const requestConfig = {
        data: roleData,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.updateCustomGroups + "/" + roleId
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
    });
};

export const searchRoleList = (searchData: SearchRoleInterface): Promise<any> => {
    const requestConfig = {
        data: searchData,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.roles + "/.search"
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

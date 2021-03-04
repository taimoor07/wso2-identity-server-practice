/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IdentityClient } from "@wso2/identity-oidc-js";
import { HttpMethods } from "@wso2is/core/models";
// import { store } from "../../core";
import { store } from "../../../store";

/**
 * Initialize an axios Http client.
 */
const httpClient = IdentityClient.getInstance()
    .httpRequest.bind(IdentityClient.getInstance())
    .bind(IdentityClient.getInstance());


/**
 * Retrieve the list of groups in the system.
 *
 * @param domain user store
 */
export const getGroupList = (domain: string): Promise<any | any> => {

    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            domain
        },
        url: store.getState().config.endpoints.groups
    };

    return httpClient(requestConfig)
        .then((response: any) => {
            if (response.status == 200) {
                return Promise.resolve(response);
            }
        })
        .catch((error: any) => {
            return Promise.reject(error);
        });
};

/**
 * Update Data of the matched ID or the group
 *
 * @param groupId group id to update group details
 * @param groupData Data that needs to be updated.
 */
export const updateGroupDetails = (groupId: string, groupData: any): Promise<any> => {
    const requestConfig = {
        data: groupData,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.groups + "/" + groupId
    };

    return httpClient(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
};


/**
 * Update bulks of resources
 *
 * @param data request payload
 * @returns {Promise<any>} a promise containing the response.
 */
export const updateResources = (data: object): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.bulk
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};


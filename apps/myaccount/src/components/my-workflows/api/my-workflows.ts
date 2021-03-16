import { IdentityClient } from "@wso2/identity-oidc-js";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../../../store";
// import { CreateRoleInterface, PatchRoleDataInterface, SearchRoleInterface } from "../models";

/**
 * Initialize an axios Http client.
 */
const httpClient = IdentityClient.getInstance()
    .httpRequest.bind(IdentityClient.getInstance())
    .bind(IdentityClient.getInstance());

export const getWorkflowTasks = (): Promise<any> => {
console.log("🚀 ~ file: my-workflows.ts ~ line 30 ~ getWorkflowTasks")
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: "https://localhost:9443/telenorpkstn/rest/v1/me/workflow-tasks"
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};


// export const searchRoleList = (searchData: SearchRoleInterface): Promise<any> => {
//     const requestConfig = {
//         data: searchData,
//         headers: {
//             "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
//             "Content-Type": "application/json"
//         },
//         method: HttpMethods.POST,
//         url: store.getState().config.endpoints.roles + "/.search"
//     };

//     return httpClient(requestConfig)
//         .then((response) => {
//             return Promise.resolve(response);
//         }).catch((error) => {
//             return Promise.reject(error);
//         });
// };


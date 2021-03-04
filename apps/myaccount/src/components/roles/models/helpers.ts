
import { RolesMemberInterface } from "@wso2is/core/models";

export interface PatchGroupDataInterface {
    schemas: string[];
    Operations: GroupSCIMOperationsInterface[];
}

export interface GroupSCIMOperationsInterface {
    op: string;
    value: any;
    path?: string;
}

export interface GroupsInterface {
    displayName: string;
    id: string;
    meta: GroupsMetaInterface;
    members?: GroupsMemberInterface[];
    roles?: RolesMemberInterface[];
}

export interface GroupsMetaInterface {
    created: string;
    location: string;
    lastModified: string;
}
export interface GroupsMemberInterface {
    display: string;
    value: string;
    $ref: string;
}


export interface UserStoreProperty {
    name: string;
    value: string;
}

export interface UserStoreProperty {
    name: string;
    value: string;
}

export interface UserStoreDetails {
    typeName: string;
    typeId: string;
    name: string;
    className: string;
    properties: UserStoreProperty[];
}

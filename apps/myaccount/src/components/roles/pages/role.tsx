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

import { AlertInterface, AlertLevels, RoleListInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout } from "@wso2is/react-components";
import _ from "lodash";
import React, { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, PaginationProps } from "semantic-ui-react";
import { AppState } from "../../../store";
import { deleteRoleById, getCurrentUser, getRolesForUser, searchRoleList, subscribeUserForRole } from "../api";
import { CreateRoleWizard, RoleList } from "../components";
import { AdvancedSearchWithBasicFilters } from "../components/helpers/advanced-search-with-basic-filters";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN } from "../constants";
import { SearchRoleInterface } from "../models";

const ROLES_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: "Name",
        value: "name"
    },
    {
        key: 3,
        text: "Created date",
        value: "createdDate"
    },
    {
        key: 4,
        text: "Last updated",
        value: "lastUpdated"
    }
];

// const filterOptions: DropdownItemProps[] = [
//     {
//         key: "all",
//         text: "Show All",
//         value: "all"
//     },
//     {
//         key: APPLICATION_DOMAIN,
//         text: "Application Domain",
//         value: APPLICATION_DOMAIN
//     },
//     {
//         key: INTERNAL_DOMAIN,
//         text: "Internal Domain",
//         value: INTERNAL_DOMAIN
//     }
// ];

/**
 * React component to list User Roles.
 *
 * @return {ReactElement}
 */
const RolesPage = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const currentUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo);
    const [ listItemLimit, setListItemLimit ] = useState<number>(10);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);
    // TODO: Check the usage and delete if not required.
    // const [ userStoreOptions, setUserStoresList ] = useState([]);
    // const [ userStore, setUserStore ] = useState(undefined);
    const [ filterBy, setFilterBy ] = useState<string>("all");
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    // TODO: Check the usage and delete if not required.
    const [ isEmptyResults, setIsEmptyResults ] = useState<boolean>(false);
    const [ isRoleListFetchRequestLoading, setRoleListFetchRequestLoading ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ initialRolList, setInitialRoleList ] = useState<RoleListInterface>();
    const [ paginatedRoles, setPaginatedRoles ] = useState<RoleListInterface>();
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(ROLES_SORTING_OPTIONS[ 0 ]);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    useEffect(() => {
        if (searchQuery == "") {
            getRoles();
        }
    },[ initialRolList?.Resources?.length != 0 ]);

    useEffect(() => {
        getRoles();
        setListUpdated(false);
    }, [ isListUpdated ]);

    useEffect(() => {
        if(currentUser.id) getRoles();
    }, [ currentUser ]);

    const getRoles = () => {
        setRoleListFetchRequestLoading(true);

        const currentUser = getCurrentUser();
        const userRoles = getRolesForUser();
        Promise.all([currentUser, userRoles])
            .then((values) => {
                console.log("🚀 ~ file: role.tsx ~ line 129 ~ .then ~ values", values)
                 const roleResources = formateData(values[0].data, values[1].data.Resources);
                 let response = values[1];   

                if (roleResources && roleResources instanceof Array) {
                    const updatedResources = roleResources.filter((role: RolesInterface) => {
                        if (filterBy === "all") {
                            return role.displayName;
                        } else if (APPLICATION_DOMAIN === filterBy) {
                            return role.displayName.includes(APPLICATION_DOMAIN);
                        } else if (INTERNAL_DOMAIN === filterBy) {
                            return !role.displayName.includes(APPLICATION_DOMAIN);
                        }
                    });
                    response.data.Resources = updatedResources;
                    setInitialRoleList(response.data);
                    setRolesPage(0, listItemLimit, response.data);
                }
            }).catch(error=>{
                console.log("🚀 Error while fetching current user and his roles", error)
            }).finally(() => {
                setRoleListFetchRequestLoading(false);
            });
    };

    const formateData = (currentUser, returnedRoles) => {
        const roles = [];

        returnedRoles.map(role=>{
            const found = currentUser.groups.some(groupRole=> groupRole.value === role.id);
            if(!found) roles.push({id: role.id, displayName: role.displayName, status: "unassigned"})
            else roles.push({id: role.id, displayName: role.displayName, status: "assigned"})
        });

        return roles;
    } 

    const subscribeForThisRole = (role) => {
        setIsLoading(true);

        let operations = {};
        if(role.status === "assigned") {
            operations = {
                "op": "remove",
                "path": `members[value eq ${currentUser.id}]`,
            }
        } else {
            operations = {
                "op": "add",
                "value": {
                    "members": [{
                        "display": currentUser.userName,
                        "value": currentUser.id
                    }]
                }
            }
        }

        const roleData = {
            "Operations": [operations],
            "schemas": [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ]
        }

        subscribeUserForRole(role.id, roleData)
            .then((response) => {
                setIsLoading(false);
                getRoles();
            }).catch((error) => {
                setIsLoading(false);
                getRoles();
        });
    };

    // const subscribeForThisRole2 = (role) => {
    //     setIsLoading(true);

    //     console.log("currentUser", currentUser)

    //     const roleData = {
    //         "Operations": [{
    //             "op": "remove",
    //             // "op": role.status === "assigned"? "remove": "add",
    //             "value": {
    //                 "members": [{
    //                     "display": "TPIAM.COM.PK/tpusr2",
    //                     "value": currentUser.id
    //                 }]
    //             }}
    //         ],
    //         "schemas": [
    //             "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    //         ]
    //     }

    //     // updateUserForRole(role.id, roleData)
    //     //     .then((response) => {
    //     //         console.log("🚀 ~ file: role.tsx ~ line 176 ~ .then ~ response", response)
    //     //         setIsLoading(false);
    //     //         getRoles();
    //     //     }).catch((error) => {
    //     //         setIsLoading(false);
    //     //         getRoles();
    //     // });
    // };

    // const getRolesOld = () => {
    //     setRoleListFetchRequestLoading(true);

    //     // get assigned and unassigned roles for this user
    //     const assignedRolse = getAssignedRolesForUser();
    //     const unAssignedRolse = getUnassignedRolesForUser();
    //     Promise.all([assignedRolse, unAssignedRolse])
    //         .then((values) => {
    //             const data = formateData(values[0].data.roles, values[1].data.Resources);
    //             if (values.length >= 2) {
    //                 const roleResources = data.Resources;

    //                 if (roleResources && roleResources instanceof Array) {
    //                     const updatedResources = roleResources.filter((role: RolesInterface) => {
    //                         if (filterBy === "all") {
    //                             return role.displayName;
    //                         } else if (APPLICATION_DOMAIN === filterBy) {
    //                             return role.displayName.includes(APPLICATION_DOMAIN);
    //                         } else if (INTERNAL_DOMAIN === filterBy) {
    //                             return !role.displayName.includes(APPLICATION_DOMAIN);
    //                         }
    //                     });

    //                     data.Resources = updatedResources;
    //                     setInitialRoleList(data);
    //                     setRolesPage(0, listItemLimit, data);
    //                 }
    //             }
    //         })
    //         .catch(error => {
    //             console.log("🚀 ~ file: role.tsx ~ line 150 ~ getRoles ~ error", error)
    //         })
    //         .finally(() => {
    //             setRoleListFetchRequestLoading(false);
    //         });
    // };

    // const formateData = (assignedRoles, unAssignedRoles) => {
    //     const roles = [];
        
    //     assignedRoles.shift();
    //     assignedRoles.map(role=>{
    //         roles.push({id: role.value, displayName: role.display, status: "assigned"})
    //     });

    //     unAssignedRoles.map(role=>{
    //         const found = roles.some(thisRole=> thisRole.displayName === role.displayName);
    //         if(!found) roles.push({id: role.id, displayName: role.displayName, status: "unassigned"})
    //     });
          
    //     const data = {
    //         Resources: roles,
    //         itemsPerPage: roles.length,
    //         startIndex: 1,
    //         totalResults: roles.length,
    //         schemas: "urn:ietf:params:scim:api:messages:2.0:ListResponse"
    //     };

    //     return data;
    // }    

    // const subscribeForThisRole_Old = (role) => {
    //     setIsLoading(true);

    //     const roleData = {
    //         "Operations":[{
    //             "op": role.status === "assigned"? "remove": "add",
    //             "path":"users",
    //             "value":[{
    //                 "value": currentUser.id
    //             }]
    //         }],
    //         "schemas":["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
    //     };

    //     subscribeForRole(role.id, roleData)
    //         .then((response) => {
    //             console.log("🚀 ~ file: role.tsx ~ line 189 ~ .then ~ response", response)
    //             setIsLoading(false);
    //             getRoles();
    //         }).catch((error) => {
    //             setIsLoading(false);
    //             getRoles();
    //         });
    // };

    /**
     * The following function fetch the user store list and set it to the state.
     */
    // const getUserStores = () => {
    //     const storeOptions = [
    //         {
    //             key: -2,
    //             text: "All user stores",
    //             value: null
    //         },
    //         {
    //             key: -1,
    //             text: "Primary",
    //             value: "primary"
    //         }
    //     ];
    //     let storeOption = {
    //         key: null,
    //         text: "",
    //         value: ""
    //     };
    //     getUserStoreList()
    //         .then((response) => {
    //             if (storeOptions === []) {
    //                 storeOptions.push(storeOption);
    //             }
    //             response.data.map((store, index) => {
    //                     storeOption = {
    //                         key: index,
    //                         text: store.name,
    //                         value: store.name
    //                     };
    //                     storeOptions.push(storeOption);
    //                 }
    //             );
    //             setUserStoresList(storeOptions);
    //         });

    //     setUserStoresList(storeOptions);
    // };

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(_.find(ROLES_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    const searchRoleListHandler = (searchQuery: string) => {
        console.log("🚀 ~ line 367 ~ searchRoleListHandler ~ searchQuery", searchQuery)
        const searchData: SearchRoleInterface = {
            filter: searchQuery,
            schemas: ["urn:ietf:params:scim:api:messages:2.0:SearchRequest"],
            startIndex: 1
        };

        setSearchQuery(searchQuery);

        searchRoleList(searchData)
            .then((response) => {

                if (response.status === 200) {
                    const results = response?.data?.Resources;
                    console.log("🚀  line 381 ~ results", results)


                    let updatedResults = [];
                    if (results) {
                        updatedResults = results;
                    }

                    const updatedData = {
                        ...results,
                        ...results?.data?.Resources,
                        Resources: updatedResults
                    };

                    setInitialRoleList(updatedData);
                    setPaginatedRoles(updatedData);
                }
        });
    };

    /**
     * Util method to paginate retrieved role list.
     *
     * @param offsetValue pagination offset value
     * @param itemLimit pagination item limit
     */
    const setRolesPage = (offsetValue: number, itemLimit: number, roleList: RoleListInterface) => {
        const updatedData = {
            ...roleList,
            ...roleList.Resources,
            Resources: roleList?.Resources?.slice(offsetValue, itemLimit + offsetValue)
        };
        setPaginatedRoles(updatedData);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        setRolesPage(offsetValue, listItemLimit, initialRolList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setRolesPage(listOffset, data.value as number, initialRolList);
    };

    const handleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setFilterBy(data.value as string);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     *
     * @param role - Role ID which needs to be deleted
     */
    const handleOnDelete = (role: RolesInterface): void => {
        deleteRoleById(role.id).then(() => {
            handleAlerts({
                description: t(
                    "console:manage.features.roles.notifications.deleteRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.roles.notifications.deleteRole.success.message"
                )
            });
            setListUpdated(true);
        });
    };

    /**
     * Handles the `onFilter` callback action from the
     * roles search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        if (query === null || query === "displayName sw ") {
            getRoles();
            return;
        }

        searchRoleListHandler(query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery(null);
        getRoles();
    };

    return (
        <PageLayout
            title="Roles"
            description="Subscribe and unsubscribe for roles."
        >
            {
                !isEmptyResults &&
                <ListLayout
                    advancedSearch={ (
                        <AdvancedSearchWithBasicFilters
                            data-testid="role-mgt-roles-list-advanced-search"
                            onFilter={ handleUserFilter  }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: "Name",
                                    value: "displayName"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("console:manage.features.roles.advancedSearch.form.inputs.filterAttribute." +
                                    "placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("console:manage.features.roles.advancedSearch.form.inputs.filterCondition" +
                                    ".placeholder")
                            }
                            filterValuePlaceholder={
                                t("console:manage.features.roles.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                            }
                            placeholder="Search by role name"
                            defaultSearchAttribute="displayName"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                        />
                    ) }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleListSortingStrategyOnChange }
                    sortStrategy={ listSortingStrategy }
                    rightActionPanel={null}
                    showPagination={ paginatedRoles?.Resources?.length > 0 }
                    showTopActionPanel={
                        isRoleListFetchRequestLoading || !(!searchQuery && paginatedRoles?.Resources?.length <= 0)
                    }
                    totalPages={ Math.ceil(initialRolList?.Resources?.length / listItemLimit) }
                    totalListSize={ initialRolList?.Resources?.length }
                >
                    <RoleList
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                data-testid="role-mgt-roles-list-advanced-search"
                                onFilter={ handleUserFilter  }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: "Name",
                                        value: "displayName"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("console:manage.features.roles.advancedSearch.form.inputs.filterAttribute." +
                                        "placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("console:manage.features.roles.advancedSearch.form.inputs.filterCondition" +
                                        ".placeholder")
                                }
                                filterValuePlaceholder={
                                    t("console:manage.features.roles.advancedSearch.form.inputs.filterValue" +
                                        ".placeholder")
                                }
                                placeholder={ t("console:manage.features.roles.advancedSearch.placeholder") }
                                defaultSearchAttribute="displayName"
                                defaultSearchOperator="sw"
                                triggerClearQuery={ triggerClearQuery }
                            />
                        ) }
                        data-testid="role-mgt-roles-list"
                        handleRoleDelete={ handleOnDelete }
                        isGroup={ false }
                        isLoading={ isLoading }
                        subscribeForThisRole={ (role) => subscribeForThisRole(role)}
                        onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        roleList={ paginatedRoles }
                        searchQuery={ searchQuery }
                    />
                </ListLayout>
            }
            {
                showWizard && (
                    <CreateRoleWizard
                        data-testid="role-mgt-create-role-wizard"
                        isAddGroup={ false }
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => setListUpdated(true) }
                    />
                )
            }
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RolesPage;

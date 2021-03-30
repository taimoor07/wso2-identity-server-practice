import { AlertInterface, RoleListInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout } from "@wso2is/react-components";
import _ from "lodash";
import React, { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, PaginationProps } from "semantic-ui-react";
import { AppState } from "../../../store";
import { getCurrentUser, getRolesForUser, searchRoleList, subscribeUserForRole } from "../api";
import { RoleList } from "../components";
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

const RolesPage = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const currentUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo);
    const [ listItemLimit, setListItemLimit ] = useState<number>(10);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ filterBy, setFilterBy ] = useState<string>("all");
    const [ searchQuery, setSearchQuery ] = useState<string>("");
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
                 const roleResources = formateData(values[0].data, values[1].data.Resources);
                 const response = values[1];   

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

    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(_.find(ROLES_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    const formateFilteredData = (currentUser, returnedRoles) => {
        const roles = [];
        returnedRoles.map(role=>{
            const found = currentUser.groups.some(groupRole=> groupRole.value === role.id);
            if(!found) roles.push({id: role.id, displayName: role.displayName, status: "unassigned"})
            else roles.push({id: role.id, displayName: role.displayName, status: "assigned"})
        });
        return roles;
    }

    const searchRoleListHandler = (searchQuery: string) => {
        const searchData: SearchRoleInterface = {
            filter: searchQuery,
            schemas: ["urn:ietf:params:scim:api:messages:2.0:SearchRequest"],
            startIndex: 1
        };

        setSearchQuery(searchQuery);
        
        const searchedRoleList = searchRoleList(searchData);
        const currentUser = getCurrentUser();
        Promise.all([searchedRoleList, currentUser])
            .then((values) => {
                const searchedRolesResponse = values[0];
                if (searchedRolesResponse.status === 200) {
                    const results = searchedRolesResponse?.data?.Resources;
                    // console.log("🚀  line 395 ~ searchedRolesResponse results", results)

                    let updatedResults = [];
                    if (results) {
                        updatedResults = formateFilteredData(values[1].data, results);
                    }

                    const updatedData = {
                        ...results,
                        ...results?.data?.Resources,
                        Resources: updatedResults
                    };
                    setInitialRoleList(updatedData)
                    setPaginatedRoles(updatedData)
                }
            });
    };

    const setRolesPage = (offsetValue: number, itemLimit: number, roleList: RoleListInterface) => {
        const updatedData = {
            ...roleList,
            ...roleList.Resources,
            Resources: roleList?.Resources?.slice(offsetValue, itemLimit + offsetValue)
        };
        setPaginatedRoles(updatedData)
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        console.log("🚀 ~ file: role.tsx ~ line 207 ~ handlePaginationChange ~ event", event)
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

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const handleUserFilter = (query: string): void => {
        if (query === null || query === "displayName sw ") {
            getRoles();
            return;
        }

        searchRoleListHandler(query);
    };

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery(null);
        getRoles();
    };

    console.log("--------------- paginatedRoles: ", paginatedRoles)
    
    return (
        <>
            {
                paginatedRoles?
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
                        handleRoleDelete={ null }
                        isGroup={ false }
                        isLoading={ isLoading }
                        subscribeForThisRole={ (role) => subscribeForThisRole(role)}
                        onEmptyListPlaceholderActionClick={ null }
                        onSearchQueryClear={ handleSearchQueryClear }
                        roleList={ paginatedRoles }
                        searchQuery={ searchQuery }
                    />
                </ListLayout>:
                <h1>Loading Roles...</h1>
            }
        </>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RolesPage;

import React, { FunctionComponent, useEffect, useState } from "react";
import { ListLayout} from "@wso2is/react-components";
import { RoleListInterface } from "@wso2is/core/models";
import { DropdownItemProps, DropdownProps, PaginationProps } from "semantic-ui-react";
import { getWorkflowTasks } from "./api";
import { MyworkflowList } from "./components/my-workflow-list";
import { MyWorkFlowsInterface } from "./modals";

export const MyWorkflows: FunctionComponent<{}> = (): JSX.Element => {
    useEffect(() => {
        getWorkflowTasksDetails();
    }, []);

    const getWorkflowTasksDetails = (): void => {
        getWorkflowTasks()
            .then(response => {
                const roleResources = response.data;

                if (roleResources && roleResources instanceof Array) {
                    response.data.Resources = roleResources;
                    setInitialRoleList(response.data);
                    setRolesPage(0, listItemLimit, response.data);
                }

            }).catch((error) => {
                console.log("🚀 ~ file: my-workflows.tsx ~ line 19 ~ getWorkflowTasksDetails ~ error", error)
            });
    };

    const [ paginatedRoles, setPaginatedRoles ] = useState<RoleListInterface>();
    const [ listItemLimit, setListItemLimit ] = useState<number>(10);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ initialRolList, setInitialRoleList ] = useState<RoleListInterface>();

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        setRolesPage(offsetValue, listItemLimit, initialRolList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setRolesPage(listOffset, data.value as number, initialRolList);
    };

    const setRolesPage = (offsetValue: number, itemLimit: number, roleList: RoleListInterface) => {
        const updatedData = {
            ...roleList,
            ...roleList.Resources,
            Resources: roleList?.Resources?.slice(offsetValue, itemLimit + offsetValue)
        };
        setPaginatedRoles(updatedData)
    };

     return (
        <>
            {paginatedRoles? <ListLayout
                advancedSearch={ null}
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ null }
                sortStrategy={ null }
                rightActionPanel={null}
                showPagination={ paginatedRoles?.Resources?.length > 0 }
                showTopActionPanel={null}
                totalPages={ Math.ceil(initialRolList?.Resources?.length / listItemLimit) }
                totalListSize={ initialRolList?.Resources?.length }
            >
                <MyworkflowList
                    myWorkflows={paginatedRoles}
                />
            </ListLayout>:
                <h1>Loading workflow tasks...</h1>}
        </>
    );
};

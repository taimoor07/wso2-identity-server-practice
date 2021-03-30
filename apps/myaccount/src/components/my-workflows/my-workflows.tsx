import React, { FunctionComponent, useEffect, useState } from "react";
import { ListLayout} from "@wso2is/react-components";
import { getWorkflowTasks } from "./api";
import { MyworkflowList } from "./components/my-workflow-list";
import { MyWorkFlowsInterface } from "./modals";

export const MyWorkflows: FunctionComponent<{}> = (): JSX.Element => {
    const [myWorkflows, setMyWorkflows] = useState([]);

    useEffect(() => {
        getWorkflowTasksDetails();
    }, []);

    const getWorkflowTasksDetails = (): void => {
        getWorkflowTasks()
            .then(response => {
                setMyWorkflows(response.data)
            }).catch((error) => {
                console.log("🚀 ~ file: my-workflows.tsx ~ line 19 ~ getWorkflowTasksDetails ~ error", error)
            });
    };

     return (
        <>
            <ListLayout
                advancedSearch={ null}
                currentListSize={ 10 }
                listItemLimit={ 10 }
                onItemsPerPageDropdownChange={ null }
                onPageChange={ null }
                onSortStrategyChange={ null }
                sortStrategy={ null }
                rightActionPanel={null}
                showPagination={ myWorkflows.length > 0 }
                showTopActionPanel={null}
                totalPages={ Math.ceil(myWorkflows?.length / 10) }
                totalListSize={ myWorkflows?.length }
            >
                <MyworkflowList
                    myWorkflows={myWorkflows}
                />
            </ListLayout>
        </>
    );
    
    // return (
    //     <div className="my-workflows-page">
    //         <MyworkflowList
    //             myWorkflows={myWorkflows}
    //         />
    //     </div>
    // );
};

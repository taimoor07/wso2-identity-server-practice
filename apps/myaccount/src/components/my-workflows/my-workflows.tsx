import React, { FunctionComponent, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
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
                console.log("🚀 ~ getWorkflowTasksDetails ~ response", response)
                setMyWorkflows(response.data)
            }).catch((error) => {
                console.log("Error while fetching my workflows status data", error)
        });
    };
    
    return (
        <div className="my-workflows-page">
            <MyworkflowList
                list={myWorkflows}
            />
        </div>
    );
};

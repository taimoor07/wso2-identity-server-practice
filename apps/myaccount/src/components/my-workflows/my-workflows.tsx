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
                setMyWorkflows(response.data)
            }).catch((error) => {
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

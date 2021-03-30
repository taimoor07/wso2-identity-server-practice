import { CertificateManagementConstants } from "@wso2is/core/constants";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertLevels,
    Certificate,
    DisplayCertificate,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";

import { Form, Grid, Icon, List, Placeholder, Popup, Responsive, Segment } from "semantic-ui-react";
import {MyWorkFlowsInterface} from "../modals";
import {
    AnimatedAvatar,
    AppAvatar,
    Certificate as CertificateDisplay,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    GenericIcon,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { saveAs } from "file-saver";
import { X509, zulutodate } from "jsrsasign";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Modal, SemanticICONS } from "semantic-ui-react";

const KEYSTORE = "keystore";
const TRUSTSTORE = "truststore";

export const MyworkflowList = (props): ReactElement => {
    const { myWorkflows } = props;
    
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: true,
                dataIndex: "id",
                id: "id",
                key: "id",
                render: (workflow: MyWorkFlowsInterface): ReactNode => {
                    return <p>{workflow.id}</p>
                },
                title: "Id"
            },
            {
                allowToggleVisibility: true,
                dataIndex: "eventType",
                id: "eventType",
                key: "eventType",
                render: (workflow: MyWorkFlowsInterface): ReactNode => {
                    return <p>{workflow.eventType}</p>
                },
                title: "Event Type"
            },
            {
                allowToggleVisibility: true,
                dataIndex: "approvalStatus",
                id: "approvalStatus",
                key: "approvalStatus",
                render: (workflow: MyWorkFlowsInterface): ReactNode => {
                    return <p>{workflow.approvalStatus}</p>
                },
                title: "Approval Status"
            },
            {
                allowToggleVisibility: true,
                dataIndex: "createdAt",
                id: "createdAt",
                key: "createdAt",
                render: (workflow: MyWorkFlowsInterface): ReactNode => {
                    return <p>{workflow.createdAt}</p>
                },
                title: "Created At"
            }
        ];
    };

    console.log("🚀 ~ file: my-workflow-myWorkflows.tsx ~ line 101 ~ MyworkflowList ~ myWorkflows", myWorkflows)
    return (
        <>
           { myWorkflows.length > 0? 
                <DataTable<MyWorkFlowsInterface>
                    className="roles-list"
                    externalSearch={ null }
                    isLoading={ null }
                    loadingStateOptions={{
                        count: 10,
                        imageType: "square"
                    } }
                    actions={ null }
                    columns={ resolveTableColumns() }
                    data={ myWorkflows }
                    onRowClick={ null }
                    placeholders={ null }
                    selectable={ null }
                    showHeader={ true }
                    transparent={ null }
                    data-testid={ null }
                />:
                <h1>Loading workflow tasks</h1>
            }
        </>
    );
};

/**
 * Default props for the component.
 */
MyworkflowList.defaultProps = {
    "data-testid": "myworkflow-list",
    selection: true,
    showListItemActions: false
};

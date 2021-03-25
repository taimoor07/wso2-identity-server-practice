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
    const {list} = props;
    console.log("🚀 ~ file: my-workflow-list.tsx ~ line 56 ~ MyworkflowList ~ list", list)
    
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

    // return (
    //     <Grid padded={ true }>
    //         <Grid.Row columns={ 4 }>
    //             < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 6 } className="first-column">
    //                 Id
    //             </Grid.Column>
    //             < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 3 } className="first-column">
    //                 Event Type
    //             </Grid.Column>
    //             < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 3 } className="first-column">
    //                 Status
    //             </Grid.Column>
    //             < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
    //                 Created At
    //             </Grid.Column>
    //         </Grid.Row>

    //         { list.length > 0 ? 
    //             list.map((item, index)=>{
    //                 return <Grid.Row columns={ 4 } key={index}>
    //                         < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 6 } className="first-column">
    //                             {item.id}
    //                         </Grid.Column>
    //                         < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 3 } className="first-column">
    //                             {item.eventType}
    //                         </Grid.Column>
    //                         < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 3 } className="first-column">
    //                             {item.approvalStatus}
    //                         </Grid.Column>
    //                         < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
    //                             {item.createdAt}
    //                         </Grid.Column>
    //                 </Grid.Row>
    //             }):
    //             <div>
    //                 <p>No workflow lifecycle found!</p>
    //             </div>
    //         }
    //     </Grid>
    // );

    return (
        <>
            <DataTable<any>
                className="roles-list"
                externalSearch={ null }
                isLoading={ null }
                loadingStateOptions={null}
                actions={ null }
                columns={ resolveTableColumns() }
                data={ list }
                onRowClick={ null }
                placeholders={ null }
                selectable={ null }
                showHeader={ true }
                transparent={ null }
                data-testid={ null }
            />
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

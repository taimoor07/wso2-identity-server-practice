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
// import { AppState, FeatureConfigInterface, getEmptyPlaceholderIllustrations, UIConstants } from "../../core";
// import {
//     deleteKeystoreCertificate,
//     retrieveCertificateAlias,
//     retrieveClientCertificate,
//     retrievePublicCertificate
// } from "../api";
// import { getCertificateIllustrations } from "../configs";

/**
 * @constant
 * @type {string}
 */
const KEYSTORE = "keystore";

/**
 * @constant
 * @type {string}
 */
const TRUSTSTORE = "truststore";

export const MyworkflowList = (props): ReactElement => {
    const {list} = props;
    console.log("🚀 ~ file: my-workflow-list.tsx ~ line 56 ~ MyworkflowList ~ list", list)

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    // const resolveTableColumns = (): TableColumnInterface[] => {
    //     return [
    //         {
    //             allowToggleVisibility: false,
    //             dataIndex: "name",
    //             id: "name",
    //             key: "name",
    //             render: (workflow: MyWorkFlowsInterface): ReactNode => (
    //                 <Header
    //                     image
    //                     as="h6"
    //                     className="header-with-icon"
    //                 >
    //                     <Header.Content>
    //                         { workflow.id }
    //                     </Header.Content>
    //                     <Header.Content>
    //                         { workflow.createdAt }
    //                     </Header.Content>
    //                     <Header.Content>
    //                         { workflow.approvalStatus }
    //                     </Header.Content>
    //                     <Header.Content>
    //                         { workflow.createdAt }
    //                     </Header.Content>
    //                 </Header>
    //             ),
    //             title: "workflow",
    //         }
    //     ];
    // };

    return (
        <Grid padded={ true }>
            <Grid.Row columns={ 4 }>
                < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 6 } className="first-column">
                    Id
                </Grid.Column>
                < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 3 } className="first-column">
                    Event Type
                </Grid.Column>
                < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 3 } className="first-column">
                    Status
                </Grid.Column>
                < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                    Created At
                </Grid.Column>
            </Grid.Row>

            { list.length > 0 ? 
                list.map((item, index)=>{
                    return <Grid.Row columns={ 4 } key={index}>
                            < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 6 } className="first-column">
                                {item.id}
                            </Grid.Column>
                            < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 3 } className="first-column">
                                {item.eventType}
                            </Grid.Column>
                            < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 3 } className="first-column">
                                {item.approvalStatus}
                            </Grid.Column>
                            < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                                {item.createdAt}
                            </Grid.Column>
                    </Grid.Row>
                }):
                <div>
                    <p>No workflow lifecycle found!</p>
                </div>
            }
        </Grid>
    );

    // return (
    //     <>
    //         <DataTable<MyWorkFlowsInterface>
    //             className="my-workflows-list"
    //             isLoading={ false }
    //             loadingStateOptions={ null }
    //             actions={ null }
    //             columns={ resolveTableColumns() }
    //             data={ list }
    //             externalSearch={ null }
    //             onRowClick={null}
    //             placeholders={ null }
    //             selectable={ null }
    //             showHeader={ true }
    //             transparent={ null }
    //             data-testid={ null }
    //         />
    //     </>
    // );
};

/**
 * Default props for the component.
 */
MyworkflowList.defaultProps = {
    "data-testid": "myworkflow-list",
    selection: true,
    showListItemActions: false
};

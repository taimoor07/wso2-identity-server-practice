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

import { RolesInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
// import { AppConstants, AppState, FeatureConfigInterface, history } from "../../core";
import { history } from "../../../helpers";
import { AppState } from "../../../store";
import { FeatureConfigInterface } from "../../../models";
import { EditRole } from "../components/edit-role";
import { getRoleById } from "../api";

const RoleEditPage: FunctionComponent<any> = (): ReactElement => {

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ roleId, setRoleId ] = useState<string>(undefined);
    const [ roleObject, setRoleObject ] = useState<RolesInterface>();
    const [ isRoleDetailsRequestLoading, setIsRoleDetailsRequestLoading ] = useState<boolean>(false);

    const getRoleDetails = (roleId: string ): void => {
        setIsRoleDetailsRequestLoading(true);

        getRoleById(roleId)
            .then(response => {
                if (response.status === 200) {
                    setRoleObject(response.data);
                }
            }).catch((error) => {
                console.log("🚀 ~ file: role-edit.tsx ~ line 52 ~ getRoleDetails ~ error", error)
                // TODO: handle error
            })
            .finally(() => {
                setIsRoleDetailsRequestLoading(false);
            });
    };

    const onRoleUpdate = (): void => {
        getRoleDetails(roleId);
    };

    /**
     * Get Role data from URL id
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const roleId = path[ path.length - 1 ];

        setRoleId(roleId);
        getRoleDetails(roleId);
    }, []);

    const handleBackButtonClick = () => {
        // @todo
        // console.log("back: ", AppConstants.getPaths().get("ROLES"))
        // history.push(AppConstants.getPaths().get("ROLES"));
        history.push("/myaccount/roles");
    };

    return (
        <PageLayout
            isLoading={ isRoleDetailsRequestLoading }
            title={
                roleObject && roleObject?.displayName ?
                    roleObject?.displayName :
                    t("console:manage.pages.rolesEdit.title")
            }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("Go back to roles", { type: "roles" })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditRole
                roleObject={ roleObject }
                roleId={ roleId }
                onRoleUpdate={ onRoleUpdate }
                featureConfig={ featureConfig }
            />
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RoleEditPage;

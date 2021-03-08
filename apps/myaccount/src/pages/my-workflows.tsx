import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { MyWorkflows } from "../components";
import { resolveUserProfileName } from "../helpers";
import { InnerPageLayout } from "../layouts";
import { AuthStateInterface } from "../models";
import { AppState } from "../store";

const MyWorkflowsPage = (): ReactElement => {
    const { t } = useTranslation();
    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const userProfileName: string = resolveUserProfileName(profileDetails);

    return (
        <InnerPageLayout
            pageTitle="My Workflows Status"
            pageDescription={ t("Here are my workflows status") }
            pageTitleTextAlign="left"
        >
            <MyWorkflows />
        </InnerPageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default MyWorkflowsPage;

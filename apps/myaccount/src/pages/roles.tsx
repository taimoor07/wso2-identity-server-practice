import React from "react";
// import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import Roles from "../components/roles/pages/role";
import { InnerPageLayout } from "../layouts";
// import { AlertInterface } from "../models";
// import { addAlert } from "../store/actions";

/**
 * Roles page.
 *
 * @return {JSX.Element}
 */
const RolesPage = (): JSX.Element => {
    // const dispatch = useDispatch();
    // const handleAlerts = (alert: AlertInterface) => {
    //     dispatch(addAlert(alert));
    // };

    return (
        <InnerPageLayout
            pageTitle="Roles"
            pageDescription="Subscribe and unsubscribe for roles."
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Roles />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </InnerPageLayout>
    );
};


/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RolesPage;

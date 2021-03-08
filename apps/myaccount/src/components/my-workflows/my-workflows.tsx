import React, { FunctionComponent } from "react";
import { Grid } from "semantic-ui-react";
import { AppState } from "../../store";

export const MyWorkflows: FunctionComponent<{}> = (): JSX.Element => {
    // const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    // const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    return (
        <Grid className="my-workflows-page">
            <Grid.Row>
                <Grid.Column width={ 8 }>
                    {/* <AccountStatusWidget/> */}
                    <p>testing</p>
                    <p>testing</p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

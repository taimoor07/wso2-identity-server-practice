import {
    LoadableComponentInterface,
    RoleListInterface,
    RolesInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import {
    Button,
    AnimatedAvatar,
    AppAvatar,
    DataTable,
    DataTablePropsInterface,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableColumnInterface,
    ContentLoader
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../configs";
import { UIConstants, APPLICATION_DOMAIN } from "../constants";

interface RoleListProps extends LoadableComponentInterface, TestableComponentInterface {
    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Flag for Group list.
     */
    isGroup: boolean;
    /**
     * Roles list.
     */
    roleList: RoleListInterface;

    // subscribe for role
    subscribeForThisRole: (role) => void;

    /**
     * Role delete callback.
     * @param {RolesInterface} role - Deleting role.
     */
    handleRoleDelete?: (role: RolesInterface) => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, role: RolesInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show/Hide header cells.
     */
    showHeader?: DataTablePropsInterface["showHeader"];
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * Show/Hide role type label.
     */
    showRoleType?: boolean;
}

/**
 * List component for Role Management list
 *
 * @param props contains the role list as a prop to populate
 */
export const RoleList: React.FunctionComponent<RoleListProps> = (props: RoleListProps): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        handleRoleDelete,
        isLoading,
        onEmptyListPlaceholderActionClick,
        onListItemClick,
        onSearchQueryClear,
        roleList,
        selection,
        searchQuery,
        showListItemActions,
        showMetaContent,
        showHeader,
        showRoleType,
        [ "data-testid" ]: testId,
        subscribeForThisRole
    } = props;

    const { t } = useTranslation();

    /**
     * Util method to generate listing header content.
     *
     * @param displayName - display name of the role/group
     *
     * @returns - React element if containing a prefix or the string
     */
    const generateHeaderContent = (displayName: string): ReactElement | string => {

        if (displayName.includes(APPLICATION_DOMAIN)) {

            // Show only the role name.
            if (!showRoleType) {
                return displayName.split("/")[ 1 ];
            }

            // Show role name with type label.
            return (
                <>
                    <Label
                        data-testid={ `${ testId }-role-${ displayName.split("/")[ 1 ] }-label` }
                        content={ "Application" }
                        size="mini"
                        className={ "application-label" }
                    />
                    { "/ " + displayName.split("/")[ 1 ] }
                </>
            );
        }

        // Show only the role name.
        if (!showRoleType) {
            return displayName;
        }

        // Show role name with type label.
        return (
            <>
                <Label
                    data-testid={ `${ testId }-role-${ displayName }-label` }
                    content={ "Internal" }
                    size="mini"
                    className={ "internal-label" }
                />
                { "/ " + displayName }
            </>
        );
    };

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-testid={ `${ testId }-search-empty-placeholder-clear-button` }
                            onClick={ onSearchQueryClear }
                        >
                            { t("console:manage.features.roles.list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.features.roles.list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("console:manage.features.roles.list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("console:manage.features.roles.list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (roleList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-list-empty-placeholder` }
                    action={ (
                        <PrimaryButton
                            data-testid={ `${ testId }-empty-list-empty-placeholder-add-button` }
                            onClick={ onEmptyListPlaceholderActionClick }
                        >
                            <Icon name="add"/>
                            { t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.action",
                                { type: "Role" })}
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.title",
                        { type: "role" }) }
                    subtitle={ [
                        t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.0",
                            { type: "roles" }),
                        t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.1",
                            { type: "role" }),
                        t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.2",
                            { type: "role" })
                    ] }
                />
            );
        }

        return null;
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (role: RolesInterface): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ testId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ role?.displayName[ 0 ] }
                                    size="mini"
                                    data-testid={ `${ testId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-testid={ `${ testId }-item-image` }
                        />
                        <Header.Content>
                            { generateHeaderContent(role?.displayName) }
                        </Header.Content>
                    </Header>
                ),
                title: t("Name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "subscribe",
                id: "subscribe",
                key: "subscribe",
                render: (role: any): ReactNode => {
                    return <Button
                            primary
                            type="submit"
                            size="large"
                            className="form-button"
                            onClick={ () => {
                                subscribeForThisRole(role);
                            } }
                        >
                            { role?.status === "assigned"? "Un Subscribe": "Subscribe" }
                        </Button>
                },
                title: "Subscribe/Un Subscribe"
            }
        ];
    };

    // console.log("🚀 ~ file: role-list.tsx ~ line 305 ~ roleList?.Resources", roleList?.Resources)
    return (
        <>
            {!isLoading? 
                <DataTable<RolesInterface>
                    className="roles-list"
                    externalSearch={ advancedSearch }
                    isLoading={ null }
                    loadingStateOptions={ {
                        count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                        imageType: "square"
                    } }
                    actions={ null }
                    columns={ resolveTableColumns() }
                    data={ roleList?.Resources }
                    onRowClick={ null }
                    placeholders={ showPlaceholders() }
                    selectable={ selection }
                    showHeader={ true }
                    transparent={ !isLoading && (showPlaceholders() !== null) }
                    data-testid={ testId }
                />:
                <ContentLoader className="p-3" active />
            }
        </>
    );
};

/**
 * Default props for the component.
 */
RoleList.defaultProps = {
    selection: true,
    showHeader: false,
    showListItemActions: true,
    showMetaContent: true,
    showRoleType: false
};

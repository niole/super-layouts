import * as React from 'react';
import { GeneralComponent } from '../types';

const GET_PARAMS_MATCHER = /(?<=:)([a-zA-Z][\w-]*)/;

export interface IndexedParam {
    index: number;
    key: string;
}

const splitEndpoint = (endpoint: string): string[] => endpoint.split('/').filter(x => !!x);

const findParamsNames = (matcher: string): IndexedParam[] => {
    const splitMatcher = splitEndpoint(matcher);
    return splitMatcher.reduce((all: IndexedParam[], level: string, index: number) => {
        const foundParam = level.match(GET_PARAMS_MATCHER);
        if (foundParam) {
            all.push({ index, key: foundParam[1] });
        }
        return all;
    }, []);
}

function getRouteParams<RouteParams>(matcher: string, endpoint: string): RouteParams {
    const params = findParamsNames(matcher);
    const splitUrl = splitEndpoint(endpoint);
    return params.reduce((acc: {}, next: IndexedParam, index: number) => ({
        ...acc,
        [next.key]: splitUrl[next.index],
    }), {}) as RouteParams;
}

type NavigatorHandlers = {
    [layoutKey: string]: (routeParams: { [key: string]: any }) => void;
};

export type Navigator = (url: string) => void;

export interface LayoutProps<RouteParams> {
    layoutKey: string;
    matcher: string;
    View: GeneralComponent<RouteParams & { navigators: NavigatorHandlers }>;
    title: React.ReactNode;
}

export type TabContainerProps<RouteParams> = RouteParams & {
    onChange: (layoutKey: string) => void;
    activeKey: string;
    layouts: LayoutProps<{}>[];
    navigators: NavigatorHandlers;
}

export type TabContainerComponent<RouteParams> = GeneralComponent<TabContainerProps<RouteParams>>;

export type Props<RouteParams, RouterMetadata extends object> = RouterMetadata & {
    layouts: LayoutProps<{}>[];
    TabContainer: TabContainerComponent<RouteParams>;
    navigator: Navigator;
    getEndpoint: (props: Props<RouteParams, RouterMetadata>) => string;
    defaultActiveKey: string;
};

export interface State {
    focusedKey: string;
}

class RouteAwareLayout<RouteParams, RouterMetadata extends {}> extends React.PureComponent<Props<RouteParams, RouterMetadata>, State> {
    constructor(props: Props<RouteParams, RouterMetadata>) {
        super(props);
        this.state = {
            focusedKey: props.defaultActiveKey,
        };
    }

    handleOnChange =  (layoutNavigators: NavigatorHandlers) => (layoutKey: string): void => {
        const layoutNavigator = layoutNavigators[layoutKey];
        if (layoutNavigator) {
            const { focusedKey } = this.state;
            const { layouts, getEndpoint } = this.props;
            const currentLocation = getEndpoint(this.props);
            const layout = layouts.find((layout: LayoutProps<{}>) => layout.layoutKey === focusedKey);

            const routeParams = {...this.props, ...getRouteParams(layout ? layout.matcher : '', currentLocation)};
            layoutNavigator(routeParams);
            this.setState({ focusedKey: layoutKey });
        } else {
            console.warn(`Could not find handler for layout with key ${layoutKey}`);
        }
    }

    getLayoutNavigators = (
        layoutProps: LayoutProps<{ [key: string]: any }>[],
        navigator: Navigator
    ): NavigatorHandlers => {
        return layoutProps.reduce((handlers: NavigatorHandlers, { layoutKey, matcher}: LayoutProps<{}>) => ({
            ...handlers,
            [layoutKey]: (currentRouteParams: { [key: string]: any }) => {
                const indexedParamNames = findParamsNames(matcher);
                const splitMatcher = splitEndpoint(matcher);

                indexedParamNames.forEach((params: IndexedParam) => {
                    splitMatcher[params.index] = currentRouteParams[params.key];
                });

                const nextLocation = `/${splitMatcher.join('/')}`;
                navigator(nextLocation);
                this.setState({ focusedKey: layoutKey });
            },
        }), {});
    }

    render() {
        const {
            defaultActiveKey,
            children,
            TabContainer,
            layouts,
            getEndpoint,
            navigator,
        } = this.props;
        const { focusedKey } = this.state;
        const currentLocation = getEndpoint(this.props);
        const layoutNavigators = this.getLayoutNavigators(layouts, navigator)
        const Container = TabContainer as React.FC<TabContainerProps<RouteParams>>;
        const layout = layouts.find((layout: LayoutProps<{}>) => layout.layoutKey === focusedKey);

        return (
            <Container
                activeKey={focusedKey}
                onChange={this.handleOnChange(layoutNavigators)}
                layouts={layouts}
                {...getRouteParams(layout ? layout.matcher : '', currentLocation)}
                navigators={layoutNavigators}
            />
        );
    }
}

export default RouteAwareLayout;

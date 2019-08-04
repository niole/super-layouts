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
        [next.key]: splitUrl[index],
    }), {}) as RouteParams;
}

type NavigatorHandlers = { [navigatorName: string]: (routeParams: {}) => void };

function getLayoutNavigators(layoutProps: LayoutProps<{ [key: string]: any }>[], navigator: Navigator): NavigatorHandlers {
    return layoutProps.reduce((handlers: NavigatorHandlers, { layoutKey, matcher}: LayoutProps<{}>) => ({
        ...handlers,
        [layoutKey]: (currentRouteParams: { [key: string]: any }) => {
            const indexedParamNames = findParamsNames(matcher);
            const nextLocation = splitEndpoint(matcher).map((subUrl: string, index: number) => {
                const found = indexedParamNames.find((indexed: IndexedParam) => indexed.index === index);
                return found ? currentRouteParams[found.key] : subUrl;
            }).join('/')
            navigator(nextLocation);
        },
    }), {});
}

export type Navigator = (url: string) => void;

export interface LayoutProps<RouteParams> {
    layoutKey: string;
    matcher: string;
    View: GeneralComponent<RouteParams & NavigatorHandlers>;
    title: React.ReactNode;
}

export interface TabContainerProps {
    onChange: (layoutKey: string) => void;
    activeKey: string;
    layouts: LayoutProps<{}>[];
    navigators: { [layoutKey: string]: (routeParams: { [key: string]: any }) => void }
}

export type TabContainerComponent = GeneralComponent<TabContainerProps>;

export type Props<RouteParams, RouterMetadata extends object> = RouterMetadata & {
    layouts: LayoutProps<{}>[];
    TabContainer: TabContainerComponent;
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
            layoutNavigator(this.props);
        } else {
            console.warn(`Could not find handler for layout with key ${layoutKey}`);
        }
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
        const layoutNavigators = getLayoutNavigators(layouts, navigator)
        const Container = TabContainer as React.FC<TabContainerProps>;
        const layout = layouts.find((layout: LayoutProps<{}>) => layout.layoutKey === focusedKey);

        return (
            <Container
                activeKey={defaultActiveKey}
                onChange={this.handleOnChange(layoutNavigators)}
                layouts={layouts}
                {...getRouteParams(layout ? layout.matcher : '', currentLocation)}
                navigators={layoutNavigators}
            />
        );
    }
}

export default RouteAwareLayout;

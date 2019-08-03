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

export interface TabComponentProps<RouteParams> {
    tabKey: string;
    children: React.ReactNode;
    title: React.ReactNode;
    onClick?: (params: RouteParams) => void;
}

export interface TabContainerProps {
    children?: React.ReactNode;
    onChange?: (key: string) => void;
    activeKey?: string;
}

export type TabContainerComponent = GeneralComponent<TabContainerProps>;

export type Props<RouteParams, RouterMetadata extends object> = RouterMetadata & {
    children: LayoutProps<{}>[];
    TabComponent: GeneralComponent<TabComponentProps<RouteParams>>;
    TabContainer: TabContainerComponent;
    navigator: Navigator;
    getEndpoint: (props: Props<RouteParams, RouterMetadata>) => string;
} & DefaultProps;

export type DefaultProps = {
    defaultActiveKey?: string;
};

class RouteAwareLayout<RouteParams, RouterMetadata extends {}> extends React.PureComponent<Props<RouteParams, RouterMetadata>> {
    static defaultProps: DefaultProps = {
        defaultActiveKey: undefined,
    };

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
            TabComponent,
            getEndpoint,
            navigator,
        } = this.props;
        const currentLocation = getEndpoint(this.props);
        const layoutNavigators = getLayoutNavigators(children, navigator)
        const Container = TabContainer as React.FC<TabContainerProps>;
        const Tab = TabComponent as React.FC<TabComponentProps<RouteParams>>;

        return (
            <Container
                activeKey={defaultActiveKey}
                onChange={this.handleOnChange(layoutNavigators)}
            >
                {children.map(({ matcher, View, title, layoutKey }: LayoutProps<RouteParams>) => (
                    <Tab
                        tabKey={layoutKey}
                        key={layoutKey}
                        title={title}
                        onClick={layoutNavigators[layoutKey]}
                    >
                        <View
                            {...getRouteParams(matcher, currentLocation)}
                            {...layoutNavigators}
                        />
                    </Tab>
                ))}
            </Container>
        );
    }
}

export default RouteAwareLayout;

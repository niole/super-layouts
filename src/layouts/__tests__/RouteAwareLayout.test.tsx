import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import TabPane from '@material-ui/core/Tab';
import { mount } from 'enzyme';
import RouteAwareLayout, {
    Props,
    LayoutProps,
    TabContainerComponent,
} from '../RouteAwareLayout';

const TabsComponent: TabContainerComponent<{ tag: string; number: number }> = ({ navigators, layouts, onChange, activeKey, ...rest }) => {
    return (
        <div>
            <AppBar>
                <Tabs
                    value={activeKey}
                    onChange={(event, newValue) => {
                        onChange(newValue);
                    }}
                >
                    {layouts.map((layout: LayoutProps<{}>) => (
                        <TabPane
                            key={layout.layoutKey}
                            label={layout.title}
                            value={layout.layoutKey}
                        />
                    ))}
                </Tabs>
            </AppBar>
            {layouts.map(({ View }: LayoutProps<{}>) => (
                <View
                    navigators={navigators}
                    {...rest}
                />
            ))}
        </div>
    );
};

describe('<RouteAwareLayout />', () => {
    const defaultProps = {
        layouts: [] as LayoutProps<{}>[],
        TabContainer: TabsComponent,
        navigator: (url: string): void => undefined,
        getEndpoint: (props: Props<{}, { currentEndpoint: string }>) => props.currentEndpoint,
        currentEndpoint: '/layout1/T/N',
        defaultActiveKey: 'layout1',
    };

    type ViewOneProps = { tag: string, layout1: (params: { tag: string }) => void };
    const View1: React.FC<ViewOneProps> = props => (
        <div>
            This is layout1 {props.tag}
        </div>
    );
    type ViewTwoProps = {
        number: number;
        tag: string;
        navigators: {
            layout2: (params: { tag: string; number: number }) => void;
            layout1: (params: { tag: string; number: number }) => void;
        };
    };
    const View2: React.FC<ViewTwoProps> = props => (
        <div>
            <button onClick={() => props.navigators.layout1(props)}>
                Submit
            </button>
            This is layout2 {props.number}
        </div>
    );

    it('should render the tab container', () => {
        const wrapper = mount(
            <RouteAwareLayout {...defaultProps} />
        );

        expect(wrapper.find(TabsComponent)).toHaveLength(1);
    });

    it('should render the tabs', () => {
        const wrapper = mount(
            <RouteAwareLayout
                {...defaultProps}
                layouts={[
                    {
                        layoutKey: 'layout1',
                        matcher: '/layout1/:tag',
                        View: View1,
                        title: <>One</>,
                    }
                ] as LayoutProps<ViewOneProps>[]}
            />
        );

        expect(wrapper.find(TabsComponent)).toHaveLength(1);
    });

    it('should render layout2 as default tab if specified', done => {
        const wrapper = mount(
            <RouteAwareLayout
                {...defaultProps}
                defaultActiveKey="layout2"
                layouts={[
                    {
                        layoutKey: 'layout1',
                        matcher: '/layout1/:tag/:number',
                        View: View1,
                        title: <>One</>,
                    },
                    {
                        layoutKey: 'layout2',
                        matcher: '/layout2/:tag/:number',
                        View: View2,
                        title: 'Two',
                    },
                ] as LayoutProps<ViewOneProps & ViewTwoProps>[]}
            />
        );

        setTimeout(() => {
            wrapper.update();
            const selectedTab = wrapper.find('button[aria-selected=true]');
            expect(selectedTab.text()).toEqual('Two');
            done();
        }, 50);
    });

    it('should trigger the navigation handler when clicking on layout1\'s tab', () => {
        const spy = jest.fn();
        const wrapper = mount(
            <RouteAwareLayout
                {...defaultProps}
                defaultActiveKey="layout2"
                layouts={[
                    {
                        layoutKey: 'layout1',
                        matcher: '/layout1/:tag/:number',
                        View: View1,
                        title: <>One</>,
                    },
                    {
                        layoutKey: 'layout2',
                        matcher: '/layout2/:tag/:number',
                        View: View2,
                        title: 'Two',
                    },
                ] as LayoutProps<ViewOneProps & ViewTwoProps>[]}
                navigator={spy}
            />
        );
        const selectedTab = wrapper.find('button[aria-selected=false]');
        selectedTab.simulate('click');

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should trigger navigation handler with the layout1 endpoint with arguments interpolated', () => {
        const spy = jest.fn();
        const wrapper = mount(
            <RouteAwareLayout
                {...defaultProps}
                currentEndpoint="/layout2/T/cat/N"
                defaultActiveKey="layout2"
                layouts={[
                    {
                        layoutKey: 'layout1',
                        matcher: '/layout1/:tag/:number',
                        View: View1,
                        title: <>One</>,
                    },
                    {
                        layoutKey: 'layout2',
                        matcher: '/layout2/:tag/cat/:number',
                        View: View2,
                        title: 'Two',
                    },
                ] as LayoutProps<ViewOneProps & ViewTwoProps>[]}
                navigator={spy}
            />
        );
        const selectedTab = wrapper.find('button[aria-selected=false]');
        selectedTab.simulate('click');
        expect(spy.mock.calls[0][0]).toEqual('/layout1/T/N');
    });

    it('should change the focus to tab 1 on click', done => {
        const wrapper = mount(
            <RouteAwareLayout
                {...defaultProps}
                currentEndpoint="/layout2/T/N"
                defaultActiveKey="layout2"
                layouts={[
                    {
                        layoutKey: 'layout1',
                        matcher: '/layout1/:tag/cat:number',
                        View: View1,
                        title: <>One</>,
                    },
                    {
                        layoutKey: 'layout2',
                        matcher: '/layout2/:tag/:number',
                        View: View2,
                        title: 'Two',
                    },
                ] as LayoutProps<ViewOneProps & ViewTwoProps>[]}
            />
        );

        const selectedTab = wrapper.find('button[aria-selected=false]');
        selectedTab.simulate('click');

        setTimeout(() => {
            wrapper.update();
            const newSelectedTab = wrapper.find('button[aria-selected=true]');
            expect(newSelectedTab.text()).toEqual('One');
            done();
        }, 10);
    });

    it('should change the focus to tab 1 when clicking Submit button in tab 2', done => {
        const wrapper = mount(
            <RouteAwareLayout
                {...defaultProps}
                currentEndpoint="/layout2/T/N"
                defaultActiveKey="layout2"
                layouts={[
                    {
                        layoutKey: 'layout1',
                        matcher: '/layout1/:tag/cat/:number',
                        View: View1,
                        title: <>One</>,
                    },
                    {
                        layoutKey: 'layout2',
                        matcher: '/layout2/:tag/:number',
                        View: View2,
                        title: 'Two',
                    },
                ] as LayoutProps<ViewOneProps & ViewTwoProps>[]}
            />
        );

        const submitButton = wrapper.findWhere((node: any) =>
            node.exists() && node.is('button') && node.text() === 'Submit'
        );
        submitButton.simulate('click');

        setTimeout(() => {
            wrapper.update();
            const newSelectedTab = wrapper.find('button[aria-selected=true]');
            expect(newSelectedTab.text()).toEqual('One');
            done();
        }, 10);
    });

    it('should trigger the navigation callback when clicking Submit button in tab 2', () => {
        const spy = jest.fn();
        const wrapper = mount(
            <RouteAwareLayout
                {...defaultProps}
                navigator={spy}
                currentEndpoint="/layout2/T/N"
                defaultActiveKey="layout2"
                layouts={[
                    {
                        layoutKey: 'layout1',
                        matcher: '/layout1/:tag/cat/:number',
                        View: View1,
                        title: <>One</>,
                    },
                    {
                        layoutKey: 'layout2',
                        matcher: '/layout2/:tag/:number',
                        View: View2,
                        title: 'Two',
                    },
                ] as LayoutProps<ViewOneProps & ViewTwoProps>[]}
            />
        );

        const submitButton = wrapper.findWhere((node: any) =>
            node.exists() && node.is('button') && node.text() === 'Submit'
        );
        submitButton.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should trigger the navigation callback with the right endtpoin when clicking Submit button in tab 2', () => {
        const spy = jest.fn();
        const wrapper = mount(
            <RouteAwareLayout
                {...defaultProps}
                navigator={spy}
                currentEndpoint="/layout2/T/100"
                defaultActiveKey="layout2"
                layouts={[
                    {
                        layoutKey: 'layout1',
                        matcher: '/layout1/:tag/cat/:number',
                        View: View1,
                        title: <>One</>,
                    },
                    {
                        layoutKey: 'layout2',
                        matcher: '/layout2/:tag/:number',
                        View: View2,
                        title: 'Two',
                    },
                ] as LayoutProps<ViewOneProps & ViewTwoProps>[]}
            />
        );

        const submitButton = wrapper.findWhere((node: any) =>
            node.exists() && node.is('button') && node.text() === 'Submit'
        );
        submitButton.simulate('click');

        expect(spy.mock.calls[0][0]).toEqual('/layout1/T/cat/100');
    });
});

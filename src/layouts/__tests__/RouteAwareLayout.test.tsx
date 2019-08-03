import * as React from 'react';
import { Tabs } from 'antd';
import { mount } from 'enzyme';
import RouteAwareLayout, {
    Props,
    LayoutProps,
    TabComponentProps,
    TabContainerComponent,
} from '../RouteAwareLayout';

const { TabPane } = Tabs;

const TabsComponent: TabContainerComponent = ({ children, onChange, activeKey }) => (
    <Tabs defaultActiveKey={activeKey} onChange={onChange}>
        {children}
    </Tabs>
);

class TabComponent<RouteParams> extends React.PureComponent<TabComponentProps<RouteParams>> {
    render() {
        const { title, children, tabKey } = this.props;
        return (
            <TabPane tab={title} key={tabKey}>
                {children}
            </TabPane>
        );
    }
}

describe('<RouteAwareLayout />', () => {
    const defaultProps = {
        children: [] as LayoutProps<{}>[],
        TabComponent: TabComponent,
        TabContainer: TabsComponent,
        navigator: (url: string) => console.log(url),
        getEndpoint: (props: Props<{}, { currentEndpoint: string }>) => props.currentEndpoint,
        currentEndpoint: 'x',
    };

    it('should render', () => {
        const wrapper = mount(
            <RouteAwareLayout {...defaultProps} />
        );

        expect(wrapper.find(TabsComponent)).toHaveLength(1);
    });
});

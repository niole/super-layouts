import * as React from 'react';
import { mount } from 'enzyme';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardDrilldownLayout, { PreviewPanelProps } from '../CardDrilldownLayout';

describe('<CardDrilldownLayout />', () => {
    type Entity = {
        id: number;
        animal: 'dog' | 'cat';
    };

    const PreviewPanel: React.FC<PreviewPanelProps<Entity>> = ({
        entity,
        togglePanel,
        showPanel,
    }) => (
        showPanel ? (
            <Box>
                <Button onClick={togglePanel}>
                    Toggler
                </Button>
                {entity && (
                    <>
                        {entity.id}
                        {entity.animal}
                    </>
                )}
            </Box>
        ) :
        null
    );

    const CardComponent: React.FC<{
        entity: Entity;
        onDrilldown: () => void;
    }> = ({ entity, onDrilldown }) => (
        <Card>
            <CardContent>
                {entity.animal} of id {entity.id}
            </CardContent>
            <CardActions>
                <Button onClick={onDrilldown}>
                    Submit
                </Button>
            </CardActions>
        </Card>
    );

    const twoEntities = [
        {
            id: 1,
            animal: 'cat',
        },
        {
            id: 2,
            animal: 'dog',
        },
    ];

    const defaultProps = {
        Card: CardComponent,
        MainContentLayout: ({ children }: any) => <Box>{children}</Box>,
        entities: [] as Entity[],
    };

    it('should render', () => {
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
            />
        );

        expect(wrapper.find(CardDrilldownLayout)).toHaveLength(1);
    });

    it('should render 2 cards', () => {
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                entities={twoEntities}
            />
        );

        expect(wrapper.find(Card)).toHaveLength(2);
    });

    it('should render 2 cards', () => {
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                entities={twoEntities}
            />
        );

        expect(wrapper.find(Card)).toHaveLength(2);
    });

    it('should trigger the drilldown callback if clicking on a card\'s submit button', () => {
        const spy = jest.fn();
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                drilldownRoutingNavigator={spy}
                entities={twoEntities}
            />
        );

        const catCard = wrapper.findWhere((node: any) =>
            node.exists() && node.is(Card) && node.text().indexOf('cat') > -1
        );

        catCard.find(Button).simulate('click')

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should trigger the drilldown callback with a cat animal entity', () => {
        const spy = jest.fn();
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                drilldownRoutingNavigator={spy}
                entities={twoEntities}
            />
        );

        const catCard = wrapper.findWhere((node: any) =>
            node.exists() && node.is(Card) && node.text().indexOf('cat') > -1
        );

        catCard.find(Button).simulate('click')

        expect(spy.mock.calls[0][0].animal).toBe('cat');
    });

    it('should not show PreviewPanel by default', () => {
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                PreviewPanel={PreviewPanel}
                entities={twoEntities}
            />
        );

        expect(wrapper.find(PreviewPanel).find(Box)).toHaveLength(0);
    });

    it('should show PreviewPanel by default if indicated', () => {
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                defaultShowPreviewPanel={true}
                PreviewPanel={PreviewPanel}
                entities={twoEntities}
            />
        );

        expect(wrapper.find(PreviewPanel).find(Box)).toHaveLength(1);
    });

    it('should show default selected entity in shown PreviewPanel', () => {
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                defaultShowPreviewPanel={true}
                defaultSelectedEntity={twoEntities[1]}
                PreviewPanel={PreviewPanel}
                entities={twoEntities}
            />
        );

        expect(wrapper.find(PreviewPanel).text()).toBe('Toggler2dog');
    });

    it('should show selected dog entity in preview panel', () => {
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                PreviewPanel={PreviewPanel}
                entities={twoEntities}
            />
        );

        const dogCard = wrapper.findWhere((node: any) =>
            node.exists() && node.is(Card) && node.text().indexOf('dog') > -1
        );
        dogCard.find(Button).simulate('click')

        wrapper.update();

        expect(wrapper.find(PreviewPanel).text()).toBe('Toggler2dog');
    });

    it('should toggle preview panel shut on toggle click', () => {
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                PreviewPanel={PreviewPanel}
                entities={twoEntities}
            />
        );

        const dogCard = wrapper.findWhere((node: any) =>
            node.exists() && node.is(Card) && node.text().indexOf('dog') > -1
        );
        dogCard.find(Button).simulate('click')

        wrapper.update();

        const toggle = wrapper.find(PreviewPanel).findWhere((node: any) => {
            return node.exists() && node.is(Button) && node.text() === 'Toggler'
        });

        toggle.simulate('click');

        wrapper.update();

        expect(wrapper.find(PreviewPanel).find(Box)).toHaveLength(0);
    });

    it('should be able to select cat card after selecting dog card', () => {
        const wrapper = mount(
            <CardDrilldownLayout
                {...defaultProps}
                PreviewPanel={PreviewPanel}
                entities={twoEntities}
            />
        );

        const dogCard = wrapper.findWhere((node: any) =>
            node.exists() && node.is(Card) && node.text().indexOf('dog') > -1
        );
        dogCard.find(Button).simulate('click')

        wrapper.update();

        const catCard = wrapper.findWhere((node: any) =>
            node.exists() && node.is(Card) && node.text().indexOf('cat') > -1
        );
        catCard.find(Button).simulate('click')

        wrapper.update();

        expect(wrapper.find(PreviewPanel).text()).toBe('Toggler1cat');
    });
});

import * as React from 'react';
import { mount } from 'enzyme';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardDrilldownLayout from '../CardDrilldownLayout';

describe('<CardDrilldownLayout />', () => {
    type Entity = {
        id: number;
        animal: 'dog' | 'cat';
    };
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
            id: 1,
            animal: 'dog',
        },
    ];

    const defaultProps = {
        Card: CardComponent,
        MainContentLayout: Box,
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
});

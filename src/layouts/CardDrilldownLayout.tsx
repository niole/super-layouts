import * as React from 'react';
import {
    GeneralComponent,
    ContainerComponent,
    CardComponent,
} from 'types';

// - [ ] 7. automated card with drilldown layout, where selecting a card drills down into a details view
// * details view is managed by routing library
// * details view can also be specified as an inline 'preview' panel

export type Navigator<Entity> = (entity: Entity) => void;

export interface PreviewPanelProps<Entity> {
    entity?: Entity;
    togglePanel: () => void;
    showPanel: boolean;
}

export interface Props<Entity> {
    drilldownRoutingNavigator?: Navigator<Entity>;
    Card: CardComponent<() => void, Entity>;
    MainContentLayout: ContainerComponent;
    entities: Entity[];
    PreviewPanel?: GeneralComponent<PreviewPanelProps<Entity>>;
    defaultShowPreviewPanel?: boolean;
    defaultSelectedEntity?: Entity;
}

export interface State<Entity> {
    showPreviewPanel: boolean;
    selectedEntity?: Entity;
}

class CardDrilldownLayout<Entity> extends React.PureComponent<Props<Entity>, State<Entity>> {
    constructor(props: Props<Entity>) {
        super(props);
        this.state = {
            showPreviewPanel: props.defaultShowPreviewPanel || false,
            selectedEntity: props.defaultSelectedEntity,
        };
    }

    handleDrilldown = (entity: Entity) => () => {
        const { drilldownRoutingNavigator, PreviewPanel } = this.props;
        if (drilldownRoutingNavigator) {
            drilldownRoutingNavigator(entity);
        } else if (PreviewPanel) {
            // render preview panel
            this.setState({
                showPreviewPanel: true,
                selectedEntity: entity,
            });
        } else {
            console.error(`
                Doing nothing on drilldown because neither ${PreviewPanel} nor
                ${drilldownRoutingNavigator} provided
            `);
        }
    }

    togglePreviewPanel = () => {
        this.setState({ showPreviewPanel: !this.state.showPreviewPanel });
    }

    render() {
        const {
            PreviewPanel,
            Card,
            entities,
            MainContentLayout,
        } = this.props;
        const { showPreviewPanel, selectedEntity } = this.state;
        return (
            <MainContentLayout>
                {PreviewPanel && (
                    <PreviewPanel
                        togglePanel={this.togglePreviewPanel}
                        showPanel={showPreviewPanel}
                        entity={selectedEntity}
                    />
                )}
                {entities.map((entity: Entity) => (
                    <Card
                        entity={entity}
                        onDrilldown={this.handleDrilldown(entity)}
                    />
                ))}
            </MainContentLayout>
        );
    }
}

export default CardDrilldownLayout;

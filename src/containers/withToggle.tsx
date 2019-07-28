import * as React from 'react';
import { GeneralComponent } from 'types';

interface ButtonProps extends OuterButtonProps {
    onClick: (event: any) => void;
    children: string | JSX.Element | JSX.Element[];
};

interface OuterButtonProps {
    disabled?: boolean;
}

type Button<Props> = GeneralComponent<Props>;

type ButtonState = {
    visible?: boolean;
    children?: ButtonProps['children'];
};

export type InnerProps = {
    visible: boolean;
    onClose: () => void;
};

export default function withToggle<OuterProps extends {}>(
    ToggleableComponent: GeneralComponent<OuterProps & InnerProps>
): (ButtonComponent: Button<ButtonProps>, defaultState?: ButtonState) => GeneralComponent<OuterProps & OuterButtonProps> {
    return (ButtonComponent, defaultState) => ({ disabled, ...props }) => {
        const state = defaultState || {};
        const defaultButtonState = { visible: state.visible || false, children: state.children || 'Open' };
        const [visible, setVisible] = React.useState(defaultButtonState.visible);
        return (
            <span>
                <ToggleableComponent
                    {...props as OuterProps}
                    visible={visible}
                    onClose={() => setVisible(false)}
                />
                <ButtonComponent onClick={() => setVisible(!visible)} disabled={disabled}>
                    {defaultButtonState.children}
                </ButtonComponent>
            </span>
        );
    };
}

import * as React from 'react';
import { ButtonProps, ButtonComponent as Button, GeneralComponent } from 'types';

interface OuterButtonProps {
    disabled?: boolean;
}

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
): (ButtonComponent: Button, defaultState?: ButtonState) => GeneralComponent<OuterProps & OuterButtonProps> {
    return (ButtonComponent, defaultState) => ({ disabled, ...props }) => {
        const state = defaultState || {};
        const defaultButtonState = { visible: state.visible || false, children: state.children || 'Open' };
        const [visible, setVisible] = React.useState(defaultButtonState.visible);
        return (
            <>
                <ToggleableComponent
                    {...props as OuterProps}
                    visible={visible}
                    onClose={() => setVisible(false)}
                />
                <ButtonComponent onClick={() => setVisible(!visible)} disabled={disabled}>
                    {defaultButtonState.children}
                </ButtonComponent>
            </>
        );
    };
}

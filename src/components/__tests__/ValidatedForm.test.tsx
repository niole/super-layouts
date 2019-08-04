import * as React from 'react';
import { mount } from 'enzyme';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import ValidatedForm, { ValidatedInput } from '../ValidatedForm';

describe('<ValidatedForm />', () => {
    const Text: React.FC<{ children: string }> = ({ children }) => <>{children}</>;
    const defaultProps = {
        ActionsContainer: Box,
        inputs: [[]] as ValidatedInput<any, any, any, {}>[][],
        onSubmit: async (values: {}): Promise<void> => undefined,
        onCancel: (): void => undefined,
        SubmitButton: Button,
        CancelButton: Button,
        defaultValues: {},
        Text,
        View: Box,
        ActionBar: AppBar,
    };

    it('should render', () => {
        const wrapper = mount(
            <ValidatedForm
                {...defaultProps}
            />
        );

        expect(wrapper.find(ValidatedForm)).toHaveLength(1);
    });
});

import * as React from 'react';
import { mount } from 'enzyme';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { ValidatedInput } from '../ValidatedForm';
import CreateEditModal from '../CreateEditModal';


describe('<ValidatedForm />', () => {
    const Dialog: React.FC<{
        open: boolean;
        onClose: () => void;
        children?: React.ReactNode;
    }> = ({ open, children }) => open ? <Box>{children}</Box> : null;

    const Text: React.FC<{ children: string }> = ({ children }) => <>{children}</>;
    const defaultProps = {
        DialogActions: Box,
        ActionBar: Box,
        View: Box,
        Text: Box,
        DialogTitle: Box,
        DialogContent: Box,
        Dialog,
        editing: false,
        editingTitle: 'Editing the thing',
        creatingTitle: 'Creating the thing',
        visible: false,
        onConfirm: (values: {}): void => undefined,
        onClose: (): void => undefined,
        defaultValues: {},
        inputs: [[]] as ValidatedInput<any, any, any, {}>[][],
        SubmitButton: Button,
        CancelButton: Button,
    };

    it('should render', () => {
        const wrapper = mount(
            <CreateEditModal
                {...defaultProps}
            />
        );

        expect(wrapper.find(CreateEditModal)).toHaveLength(1);
    });
});


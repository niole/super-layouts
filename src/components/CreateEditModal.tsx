import * as React from 'react';
import {
    DialogActionsComponent,
    ActionBarComponent,
    ContainerComponent,
    ButtonComponent,
    DialogContentComponent,
    TextComponent,
    DialogTitleComponent,
    DialogComponent,
} from 'types';
import ValidatedForm, { ValidatedInput } from 'components/ValidatedForm';

type Props<Values> = {
    DialogActions: DialogActionsComponent;
    ActionBar: ActionBarComponent;
    View: ContainerComponent;
    Text: TextComponent;
    DialogTitle: DialogTitleComponent;
    DialogContent: DialogContentComponent;
    Dialog: DialogComponent;
    editing: boolean;
    editingTitle: string;
    creatingTitle: string;
    visible: boolean;
    onConfirm: (values: Values) => void;
    onClose: () => void;
    defaultValues: Values;
    inputs: ValidatedInput<any, any, any>[][];
    SubmitButton: ButtonComponent;
    CancelButton: ButtonComponent;
};

function CreateEditModal<Values, Defaults>({
        ActionBar,
        SubmitButton,
        CancelButton,
        DialogContent,
        DialogActions,
        Text,
        DialogTitle,
        Dialog,
        inputs,
        editing,
        editingTitle,
        creatingTitle,
        visible,
        onConfirm,
        View,
        onClose,
        defaultValues,
        ...dialogProps
}: Props<Values>): JSX.Element {
    return (
        <Dialog open={visible} onClose={onClose} {...dialogProps}>
            <DialogTitle>
                {editing ? (
                    <Text>{editingTitle}</Text>
                ) : (
                    <Text>{creatingTitle}</Text>
                )}
            </DialogTitle>
            <DialogContent>
                <ValidatedForm
                    Text={Text}
                    ActionBar={ActionBar}
                    View={View}
                    SubmitButton={SubmitButton}
                    CancelButton={CancelButton}
                    ActionsContainer={DialogActions}
                    inputs={inputs}
                    onSubmit={async (values: Values) => {
                        onConfirm(values);
                        onClose();
                    }}
                    onCancel={onClose}
                    defaultValues={defaultValues}
                />
            </DialogContent>
        </Dialog>
    );
}
export default CreateEditModal;

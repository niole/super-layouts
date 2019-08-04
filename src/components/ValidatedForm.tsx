import * as React from 'react';
import {
    GeneralComponent,
    DialogActionsComponent,
    ActionBarComponent,
    ButtonComponent,
    ContainerComponent,
    TextComponent,
} from 'types';

const Error = ({ message, Text }: { Text: TextComponent; message?: string }) => (
    message ? <Text>{message}</Text> : null
);

export type PluggableProps<ChangedData, InputValue, AllValues> = {
    values: AllValues;
    onChange: (data: ChangedData) => void;
    value: InputValue;
    error?: string;
};

export type Validator<V> = ((value: V) => string | undefined) | undefined;

export type PluggableInput<C, V, AllValues> = GeneralComponent<PluggableProps<C, V, AllValues>>;

export type ValidatedInput<A, C, V, Values> = {
    key: string;
    validator?: Validator<A>;
    Input: PluggableInput<C, V, Values>;
};

type Props<V> = {
    ActionsContainer: DialogActionsComponent;
    inputs: ValidatedInput<any, any, any, V>[][];
    onSubmit: (values: V) => Promise<void>;
    onCancel: () => void;
    SubmitButton: ButtonComponent;
    CancelButton: ButtonComponent;
    defaultValues: V;
    Text: TextComponent;
    View: ContainerComponent;
    ActionBar: ActionBarComponent;
};

type Errors =  { [key: string]: string | undefined };

type State<V> = {
    values: V
    errors: Errors;
    disableSubmit: boolean;
    submitError?: string;
};

class ValidatedForm<V extends { [key: string]: any }> extends React.PureComponent<Props<V>, State<V>> {
    constructor(props: Props<V>) {
        super(props);
        this.state = {
            values: props.defaultValues,
            errors: {},
            disableSubmit: false,
        };
    }

    componentDidUpdate(prevProps: Props<V>) {
        if (prevProps.defaultValues !== this.props.defaultValues) {
            this.setState({ values: this.props.defaultValues });
        }
    }

    onSubmit = () => {
        const { onSubmit } = this.props;
        const { values } = this.state;
        this.handlePresubmitValidation(() => {
            onSubmit(values).catch((error: any) => {
                this.setState({ disableSubmit: true, submitError: `there was an error: ${error}` });
            });
        });
    }

    handlePresubmitValidation = (onSuccess: () => void): void => {
        const { values } = this.state;
        const { inputs } = this.props;
        const flattenedInputs = inputs.reduce(
            (acc: ValidatedInput<any, any, any, V>[], row: ValidatedInput<any, any, any, V>[]) => [...acc, ...row]
        , []);
        const newErrors =
            flattenedInputs.reduce((errors: Errors, { key, validator }: ValidatedInput<any, any, any, V>) => ({
            ...errors,
            [key]: validator ? validator(values[key]) : undefined,
        }), {});

        const disableSubmit = !!Object.values(newErrors).find((error: any) => !!error);

        this.setState({ errors: newErrors, disableSubmit, submitError: undefined});

        if (!disableSubmit) {
            onSuccess();
        }
    }

    handleInputChange = (key: string, validator: Validator<any>) => (event: any) => {
        this.setState({ submitError: undefined });
        const { values, errors } = this.state;
        if (validator) {
            const errorMessage = validator(event);
            if (!!errorMessage) {
                this.setState({
                    disableSubmit: true,
                    errors: { ...errors, [key]: errorMessage },
                    values: { ...values, [key]: event },
                });
            } else {
                const newErrors: { [key: string]: undefined | string } = { ...errors, [key]: undefined };
                const disableSubmit = !!Object.values(newErrors).find((error: any) => !!error);
                this.setState({
                    errors: newErrors,
                    disableSubmit,
                    values: { ...values, [key]: event },
                });
            }
        } else {
            this.setState({
                values: { ...values, [key]: event },
            });
        }
    }

    render() {
        const {
            Text,
            ActionBar,
            SubmitButton,
            CancelButton,
            View,
            ActionsContainer = View,
            inputs,
            onCancel,
        } = this.props;
        const { submitError, disableSubmit, errors, values } = this.state;
        return (
            <View>
                {inputs.map((inputRow: ValidatedInput<any, any, any, V>[]) => (
                    inputRow.length ? (
                        <View key={inputRow[0].key}>
                            {inputRow.map(({ key, Input, validator }: ValidatedInput<any, any, any, V>) => (
                                <View key={key}>
                                    <Input
                                        values={values}
                                        onChange={this.handleInputChange(key, validator)}
                                        value={values[key]}
                                        error={errors[key]}
                                    />
                                    <Error Text={Text} message={errors[key]} />
                                </View>
                            ))}
                        </View>
                    ) : null
                ))}
                <ActionsContainer>
                    <View>
                        <Error Text={Text} message={submitError} />
                        <ActionBar>
                            <CancelButton onClick={onCancel} key="cancel">
                                Cancel
                            </CancelButton>
                            <SubmitButton
                                key="submit"
                                disabled={disableSubmit}
                                onClick={this.onSubmit}
                            >
                                Submit
                            </SubmitButton>
                        </ActionBar>
                    </View>
                </ActionsContainer>
            </View>
        );
    }
}

export default ValidatedForm;

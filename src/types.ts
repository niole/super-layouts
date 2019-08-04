import * as React from 'react';

export type GeneralComponent<Props> = React.ComponentClass<Props> |
    React.StatelessComponent<Props> |
    React.FC<Props>;

export interface ButtonProps {
    onClick: (event: any) => void;
    children: React.ReactNode;
    disabled?: boolean;
};

export type ButtonComponent = GeneralComponent<ButtonProps>;

export interface TextProps {
    children: string;
}

export type TextComponent = GeneralComponent<TextProps>;

export interface ContainerProps {
    children?: React.ReactNode;
}

export type ContainerComponent = GeneralComponent<ContainerProps>;

export interface ActionBarProps {
    children: GeneralComponent<ButtonProps>[];
}

export type ActionBarComponent = GeneralComponent<ActionBarProps>

export interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export type DialogComponent = GeneralComponent<DialogComponentProps>;

export interface DialogTitleComponentProps {
    children: React.ReactNode;
}

export type DialogTitleComponent = GeneralComponent<DialogTitleComponentProps>;

export interface DialogContentComponentProps {
    children: React.ReactNode;
}

export type DialogContentComponent = GeneralComponent<DialogContentComponentProps>;

export interface DialogActionsComponentProps {
    children: React.ReactNode;
}

export type DialogActionsComponent = GeneralComponent<DialogActionsComponentProps>;

export interface CardProps<Navigator, Entity> {
    entity: Entity;
    onDrilldown: Navigator;
}

export type CardComponent<Navigator, Entity> = GeneralComponent<CardProps<Navigator, Entity>>;

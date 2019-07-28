import * as React from 'react';

export type GeneralComponent<Props> = React.ComponentClass<Props> | React.StatelessComponent<Props>;

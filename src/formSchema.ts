const visualizationOptions = {
    type: 'object',
    title: 'Visualization Options',
    required: ['counterColName'],
    properties: {
        counterColName: {
            title: 'Column',
            type: 'string'
        },
        counterLabel: {
            title: 'Label',
            type: 'string'
        },
        stringDecimal: {
            title: 'Decimals',
            type: 'number'
        },
        stringPrefix: {
            title: 'Prefix',
            type: 'string'
        },
        stringSuffix: {
            title: 'Suffix',
            type: 'string'
        }
    }
}

const theme = {
    darkShadow: {
        type: 'boolean'
    },
    fontColor: {
        type: 'string',
        format: 'color'
    },
    backgroundColor: {
        type: 'string',
        format: 'color'
    },
    counterNumberColor: {
        type: 'string',
        format: 'color'
    },
    counterLabelColor: {
        type: 'string',
        format: 'color'
    },
    // width: {
    //   type: 'string'
    // },
    height: {
        type: 'string'
    }
}

const themeUISchema = {
    type: 'Category',
    label: 'Theme',
    elements: [
        {
            type: 'VerticalLayout',
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/darkShadow'
                },
                {
                    type: 'HorizontalLayout',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/fontColor'
                        },
                        {
                            type: 'Control',
                            scope: '#/properties/backgroundColor'
                        }
                    ]
                },
                {
                    type: 'HorizontalLayout',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/counterNumberColor'
                        },
                        {
                            type: 'Control',
                            scope: '#/properties/counterLabelColor'
                        }
                    ]
                },
                {
                    type: 'Control',
                    scope: '#/properties/height'
                },
            ]
        }
    ]
}

export function getBuilderSchema() {
    return {
        dataSchema: {
            type: 'object',
            required: ['title'],
            properties: {
                title: {
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                ...theme
            }
        },
        uiSchema: {
            type: 'Categorization',
            elements: [
                {
                    type: 'Category',
                    label: 'General',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    scope: '#/properties/title'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/description'
                                }
                            ]
                        }
                    ]
                },
                themeUISchema
            ]
        },
        advanced: {
            dataSchema: {
                type: 'object',
                properties: {
                    options: visualizationOptions
                }
            }
        }
    }
}

export function getEmbedderSchema() {
    return {
        dataSchema: {
            type: 'object',
            required: ['title'],
            properties: {
                title: {
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                ...theme
            }
        },
        uiSchema: {
            type: 'Categorization',
            elements: [
                {
                    type: 'Category',
                    label: 'General',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    scope: '#/properties/title'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/description'
                                }
                            ]
                        }
                    ]
                },
                themeUISchema
            ]
        }
    }
}
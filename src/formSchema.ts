function visualizationOptions(columns: string[]) {
    return {
        type: 'object',
        title: 'Visualization Options',
        required: ['counterColName'],
        properties: {
            counterColName: {
                title: 'Column',
                type: 'string',
                enum: columns
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
}

const theme = {
    darkShadow: {
        type: 'boolean'
    },
    customFontColor: {
        type: 'boolean'
    },
    fontColor: {
        type: 'string',
        format: 'color'
    },
    customBackgroundColor: {
        type: 'boolean'
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
                    type: 'HorizontalLayout',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/customFontColor'
                        },
                        {
                            type: 'Control',
                            scope: '#/properties/fontColor',
                            rule: {
                                effect: 'ENABLE',
                                condition: {
                                    scope: '#/properties/customFontColor',
                                    schema: {
                                        const: true
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    type: 'HorizontalLayout',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/customBackgroundColor'
                        },
                        {
                            type: 'Control',
                            scope: '#/properties/backgroundColor',
                            rule: {
                                effect: 'ENABLE',
                                condition: {
                                    scope: '#/properties/customBackgroundColor',
                                    schema: {
                                        const: true
                                    }
                                }
                            }
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
                    type: 'HorizontalLayout',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/darkShadow'
                        },
                        {
                            type: 'Control',
                            scope: '#/properties/height'
                        }
                    ]
                }
            ]
        }
    ]
}

export function getBuilderSchema(column: string[]) {
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
                    options: visualizationOptions(column)
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
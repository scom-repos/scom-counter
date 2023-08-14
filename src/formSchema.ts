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

export function getBuilderSchema() {
    return {
        general: {
            dataSchema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  }
                }
            }
        },
        advanced: {
            dataSchema: {
                type: 'object',
                properties: {
                  options: visualizationOptions
                }
            }
        },
        theme: {
            dataSchema: {
                type: 'object',
                properties: {
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
              }
        }
    }
}

export function getEmbedderSchema() {
    return {
        general: {
            dataSchema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  }
                }
            }
        },
        theme: {
            dataSchema: {
                type: 'object',
                properties: {
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
                  height: {
                    type: 'string'
                  }
                }
              }
        }
    }
}
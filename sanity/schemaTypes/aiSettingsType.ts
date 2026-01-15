import {defineField, defineType} from 'sanity'

export const aiSettingsType = defineType({
  name: 'aiSettings',
  title: 'AI Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable AI',
      type: 'boolean',
      initialValue: true,
      description: 'Global toggle for AI features in Studio.',
    }),
    defineField({
      name: 'defaultLanguage',
      title: 'Default Language',
      type: 'string',
      initialValue: 'id',
      options: {
        list: [
          {title: 'Indonesia', value: 'id'},
          {title: 'English', value: 'en'},
        ],
      },
    }),
    defineField({
      name: 'tone',
      title: 'Default Tone',
      type: 'string',
      initialValue: 'professional',
      options: {
        list: [
          {title: 'Professional', value: 'professional'},
          {title: 'Formal', value: 'formal'},
          {title: 'Friendly', value: 'friendly'},
          {title: 'Concise', value: 'concise'},
        ],
      },
    }),
    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      initialValue: 'gemini-3-flash-preview',
      description: 'Model ID used by the AI backend.',
    }),
    defineField({
      name: 'temperature',
      title: 'Creativity (Temperature)',
      type: 'number',
      initialValue: 0.7,
      validation: (Rule) => Rule.min(0).max(1),
    }),
    defineField({
      name: 'maxTokens',
      title: 'Max Tokens',
      type: 'number',
      initialValue: 1024,
      validation: (Rule) => Rule.min(128).max(8192),
    }),
    defineField({
      name: 'companyContext',
      title: 'Company Context',
      type: 'text',
      rows: 5,
      description: 'Background info for consistent AI output (services, tone, audience).',
    }),
    defineField({
      name: 'styleGuide',
      title: 'Style Guide',
      type: 'text',
      rows: 5,
      description: 'Rules for format, terminology, and structure.',
    }),
    defineField({
      name: 'fieldOverrides',
      title: 'Field Overrides',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'fieldOverride',
          fields: [
            defineField({
              name: 'documentType',
              title: 'Document Type',
              type: 'string',
              description: 'Example: post, portfolio.',
            }),
            defineField({
              name: 'fieldName',
              title: 'Field Name',
              type: 'string',
              description: 'Example: title, excerpt, body.',
            }),
            defineField({
              name: 'enabled',
              title: 'Enable for Field',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'promptTemplate',
              title: 'Prompt Template',
              type: 'text',
              rows: 4,
              description: 'Optional custom prompt template for this field.',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'imageSearchEnabled',
      title: 'Enable Image Search',
      type: 'boolean',
      initialValue: true,
      description: 'Allow AI to fetch image suggestions via Pexels.',
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      model: 'model',
    },
    prepare(selection) {
      const {enabled, model} = selection
      return {
        title: 'AI Settings',
        subtitle: `${enabled ? 'Enabled' : 'Disabled'} · ${model ?? 'No model'}`,
      }
    },
  },
})

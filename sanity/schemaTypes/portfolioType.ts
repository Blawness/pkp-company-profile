import { CaseIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import {AiFieldInput} from '../components/AiFieldInput'

export const portfolioType = defineType({
  name: 'portfolio',
  title: 'Portofolio',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Proyek',
      type: 'string',
      validation: (Rule) => Rule.required(),
      components: {input: AiFieldInput},
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      components: {input: AiFieldInput},
    }),
    defineField({
      name: 'excerpt',
      title: 'Ringkasan',
      type: 'text',
      rows: 3,
      description: 'Ringkasan singkat portofolio untuk preview',
      components: {input: AiFieldInput},
    }),
    defineField({
      name: 'coverImage',
      title: 'Gambar Utama',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri Foto',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'client',
      title: 'Klien',
      type: 'string',
      components: {input: AiFieldInput},
    }),
    defineField({
      name: 'location',
      title: 'Lokasi',
      type: 'string',
      components: {input: AiFieldInput},
    }),
    defineField({
      name: 'year',
      title: 'Tahun',
      type: 'string',
      components: {input: AiFieldInput},
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
      components: {input: AiFieldInput},
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Detail Proyek',
      type: 'blockContent',
      components: {input: AiFieldInput},
    }),
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      media: 'coverImage',
    },
    prepare(selection) {
      const { client } = selection
      return { ...selection, subtitle: client && `Client: ${client}` }
    },
  },
})

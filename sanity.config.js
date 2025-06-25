'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

const projectId = 'cljwi34s'
const dataset = 'production'
const apiVersion = '2023-01-01'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    deskTool({ structure }), // 
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})

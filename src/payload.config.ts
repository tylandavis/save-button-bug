// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    {
      versions: {
        drafts: {
          validate: true,
        },
      },
      slug: 'examples',
      fields: [
        {
          name: 'Test Field',
          type: 'text',
          validate: async () => {
            try {
              const res = await fetch('https://yesno.wtf/api')
              if (!res.ok) return 'Third-party service error'
              const data = (await res.json()) as { answer?: string }
              return data.answer === 'yes' ? true : 'Invalid'
            } catch (err) {
              return 'Could not contact third-party service for validation'
            }
          },
        },
      ],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})

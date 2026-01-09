/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react'
import { DocumentActionComponent, DocumentActionDescription, useDocumentOperation, useClient } from 'sanity'
import { SparklesIcon } from '@sanity/icons'
import { Box, Button, Stack, Text, TextArea, Label, Card, Flex } from '@sanity/ui'

export const AiGenerateAction: DocumentActionComponent = (props) => {
  const { id, type, onComplete } = props
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { patch } = useDocumentOperation(id, type)
  const client = useClient({ apiVersion: '2023-11-01' })

  const handleGenerate = useCallback(async () => {
    if (!prompt) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to generate content')
      }

      const data = await response.json()

      // 1. Prepare patches for text fields
      const patches: Array<{ set: Record<string, unknown> }> = [
        { set: { title: data.title } },
        { set: { excerpt: data.excerpt } },
        { set: { body: data.body } },
      ]

      // 2. Handle image if present
      if (data.imageUrl) {
        try {
          const imgResponse = await fetch(data.imageUrl)
          const blob = await imgResponse.blob()
          const asset = await client.assets.upload('image', blob, {
            filename: `ai-${Date.now()}.jpg`,
            contentType: blob.type || 'image/jpeg',
          })

          patches.push({
            set: {
              coverImage: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: asset._id,
                },
                alt: data.title
              }
            }
          })
        } catch (imgErr) {
          console.error('Failed to upload image:', imgErr)
          // Don't fail the whole generation if image fails
        }
      }

      // 3. Execute all patches
      patch.execute(patches)

      setDialogOpen(false)
      onComplete()
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [prompt, patch, onComplete, client])

  const description: DocumentActionDescription = {
    label: 'Generate with AI',
    icon: SparklesIcon,
    onHandle: () => setDialogOpen(true),
    shortcut: 'ctrl+alt+g',
  }

  if (type !== 'post') return null

  return {
    ...description,
    dialog: isDialogOpen && {
      type: 'dialog',
      onClose: () => setDialogOpen(false),
      header: 'Generate Article with AI',
      content: (
        <Box padding={4}>
          <Stack space={4}>
            <Box>
              <Label>What is this article about?</Label>
              <TextArea
                placeholder="e.g. Inovasi konstruksi ramah lingkungan di Indonesia..."
                value={prompt}
                onChange={(event) => setPrompt(event.currentTarget.value)}
                rows={4}
              />
            </Box>
            {error && (
              <Card padding={3} tone="critical" radius={2}>
                <Text size={1}>{error}</Text>
              </Card>
            )}
            <Flex justify="flex-end">
              <Button
                text={loading ? 'Generating...' : 'Generate'}
                tone="primary"
                onClick={handleGenerate}
                disabled={loading || !prompt}
              />
            </Flex>
          </Stack>
        </Box>
      ),
    },
  }
}

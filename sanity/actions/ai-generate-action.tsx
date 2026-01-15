/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react'
import { DocumentActionComponent, DocumentActionDescription, useDocumentOperation, useClient } from 'sanity'
import { SparklesIcon } from '@sanity/icons'
import { Box, Button, Stack, Text, TextArea, Label, Card, Flex, Spinner } from '@sanity/ui'

type ActionConfig = {
  endpoint: string
  planEndpoint?: string
  header: string
  planHeader?: string
  label: string
  placeholder: string
  patches: (data: Record<string, unknown>) => Array<{ set: Record<string, unknown> }>
}

const createKey = () =>
  globalThis.crypto?.randomUUID?.() ?? `key_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

const addKeysToPortableText = (value: unknown) => {
  if (!Array.isArray(value)) return value

  return value.map((block) => {
    if (!block || typeof block !== 'object') return block
    const blockRecord = block as Record<string, unknown>
    const children = Array.isArray(blockRecord.children)
      ? blockRecord.children.map((child) => {
          if (!child || typeof child !== 'object') return child
          const childRecord = child as Record<string, unknown>
          return childRecord._key ? childRecord : { ...childRecord, _key: createKey() }
        })
      : blockRecord.children

    return blockRecord._key
      ? { ...blockRecord, children }
      : { ...blockRecord, _key: createKey(), children }
  })
}

const actionConfigs: Record<string, ActionConfig> = {
  post: {
    endpoint: '/api/ai/generate',
    planEndpoint: '/api/ai/plan-post-ideas',
    header: 'Generate Article with AI',
    planHeader: 'Plan Article Ideas',
    label: 'What is this article about?',
    placeholder: 'e.g. Inovasi konstruksi ramah lingkungan di Indonesia...',
    patches: (data) => [
      { set: { title: data.title } },
      { set: { excerpt: data.excerpt } },
      { set: { body: addKeysToPortableText(data.body) } },
    ],
  },
  portfolio: {
    endpoint: '/api/ai/generate-portfolio',
    header: 'Generate Portfolio with AI',
    label: 'What is this portfolio about?',
    placeholder: 'e.g. Proyek sertifikasi tanah kawasan industri...',
    patches: (data) => [
      { set: { title: data.title } },
      { set: { excerpt: data.excerpt } },
      { set: { body: addKeysToPortableText(data.body) } },
      { set: { client: data.client } },
      { set: { location: data.location } },
      { set: { year: data.year } },
      { set: { tags: data.tags } },
    ],
  },
}

export const AiGenerateAction: DocumentActionComponent = (props) => {
  const { id, type, onComplete } = props
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState('')
  const [ideas, setIdeas] = useState<Array<{ title?: string; angle?: string }>>([])
  const [loading, setLoading] = useState(false)
  const [planLoading, setPlanLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [planError, setPlanError] = useState<string | null>(null)
  const [mode, setMode] = useState<'generate' | 'plan'>('generate')
  const { patch } = useDocumentOperation(id, type)
  const client = useClient({ apiVersion: '2023-11-01' })
  const config = actionConfigs[type]
  const draftContext = props.draft ?? props.published

  const handleGenerate = useCallback(async () => {
    if (!prompt) return

    setLoading(true)
    setError(null)

    try {
      if (!config) {
        throw new Error('Unsupported document type')
      }

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context: draftContext }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to generate content')
      }

      const data = await response.json()

      // 1. Prepare patches for text fields
      const patches: Array<{ set: Record<string, unknown> }> = config.patches(data)

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
  }, [prompt, patch, onComplete, client, config, draftContext])

  const handlePlanIdeas = useCallback(async () => {
    if (!config?.planEndpoint) return
    setPlanLoading(true)
    setPlanError(null)

    try {
      const response = await fetch(config.planEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to plan ideas')
      }

      setIdeas(Array.isArray(data?.ideas) ? data.ideas : [])
    } catch (err: unknown) {
      setPlanError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setPlanLoading(false)
    }
  }, [config, seed])

  const description: DocumentActionDescription = {
    label: 'Generate with AI',
    icon: SparklesIcon,
    onHandle: () => setDialogOpen(true),
    shortcut: 'ctrl+alt+g',
  }

  if (!config) return null

  return {
    ...description,
    dialog: isDialogOpen && {
      type: 'dialog',
      onClose: () => setDialogOpen(false),
      header: mode === 'plan' && config.planHeader ? config.planHeader : config.header,
      content: (
        <Box padding={4}>
          <Stack space={4}>
            {config.planEndpoint && (
              <Flex gap={2}>
                <Button
                  mode={mode === 'generate' ? 'default' : 'ghost'}
                  text="Generate"
                  onClick={() => setMode('generate')}
                />
                <Button
                  mode={mode === 'plan' ? 'default' : 'ghost'}
                  text="Plan ideas"
                  onClick={() => setMode('plan')}
                />
              </Flex>
            )}
            {mode === 'generate' ? (
              <>
                <Box>
                  <Label>{config.label}</Label>
                  <TextArea
                    placeholder={config.placeholder}
                    value={prompt}
                    onChange={(event) => setPrompt(event.currentTarget.value)}
                    rows={4}
                  />
                </Box>
                {loading && (
                  <Card padding={3} tone="primary" radius={2}>
                    <Flex align="center" gap={3}>
                      <Spinner muted />
                      <Stack space={2}>
                        <Text size={1} weight="semibold">Generating content with AI...</Text>
                        <Text size={1} muted>This may take a few moments</Text>
                      </Stack>
                    </Flex>
                  </Card>
                )}
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
                    icon={loading ? Spinner : undefined}
                  />
                </Flex>
              </>
            ) : (
              <>
                <Box>
                  <Label>Seed idea (optional)</Label>
                  <TextArea
                    placeholder="Contoh: Legalitas tanah untuk proyek perumahan"
                    value={seed}
                    onChange={(event) => setSeed(event.currentTarget.value)}
                    rows={3}
                  />
                </Box>
                {planLoading && (
                  <Card padding={3} tone="primary" radius={2}>
                    <Flex align="center" gap={3}>
                      <Spinner muted />
                      <Text size={1} weight="semibold">Generating article ideas...</Text>
                    </Flex>
                  </Card>
                )}
                {planError && (
                  <Card padding={3} tone="critical" radius={2}>
                    <Text size={1}>{planError}</Text>
                  </Card>
                )}
                {ideas.length > 0 && (
                  <Stack space={3}>
                    {ideas.map((idea, index) => (
                      <Card key={`${idea.title ?? 'idea'}-${index}`} padding={3} radius={2} tone="transparent">
                        <Stack space={2}>
                          <Text weight="semibold">{idea.title ?? 'Untitled idea'}</Text>
                          {idea.angle && <Text size={1} muted>{idea.angle}</Text>}
                          <Flex justify="flex-end">
                            <Button
                              text="Use this idea"
                              mode="ghost"
                              onClick={() => {
                                setPrompt(idea.title ?? '')
                                setMode('generate')
                              }}
                            />
                          </Flex>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                )}
                <Flex justify="flex-end">
                  <Button
                    text={planLoading ? 'Planning...' : 'Get ideas'}
                    tone="primary"
                    onClick={handlePlanIdeas}
                    disabled={planLoading}
                  />
                </Flex>
              </>
            )}
          </Stack>
        </Box>
      ),
    },
  }
}

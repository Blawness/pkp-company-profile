import {useCallback, useMemo, useState} from 'react'
import {Box, Button, Card, Dialog, Flex, Label, Select, Spinner, Stack, Text, TextArea} from '@sanity/ui'
import {SparklesIcon} from '@sanity/icons'
import {PatchEvent, set, useFormValue} from 'sanity'
import type {InputProps} from 'sanity'

type AiMode = 'generate' | 'improve'

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

const normalizeFieldName = (path: InputProps['path']) => {
  if (!path || path.length === 0) return undefined
  const last = path[path.length - 1]
  return typeof last === 'string' ? last : undefined
}

const normalizeArrayValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string') as string[]
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

const getArrayItemTypeName = (schemaType: InputProps['schemaType']) => {
  if (!schemaType || !('of' in schemaType)) return undefined
  const arraySchema = schemaType as {of?: Array<{name?: string}>}
  return arraySchema.of?.[0]?.name
}

export const AiFieldInput = (props: InputProps) => {
  const {value, onChange, schemaType, path, renderDefault} = props
  const documentValue = useFormValue([]) as Record<string, unknown> | null
  const fieldName = normalizeFieldName(path)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [mode, setMode] = useState<AiMode>(value ? 'improve' : 'generate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fieldType = schemaType?.name
  const arrayItemType = getArrayItemTypeName(schemaType)
  const documentType = documentValue?._type

  const canUseAi = useMemo(() => {
    if (!fieldName || !fieldType) return false
    const allowed = ['string', 'text', 'slug', 'blockContent', 'array']
    return allowed.includes(fieldType)
  }, [fieldName, fieldType])

  const handleGenerate = useCallback(async () => {
    if (!fieldName || !documentType) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/field-generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          documentType,
          fieldName,
          fieldType,
          arrayItemType,
          currentValue: value,
          document: documentValue,
          instruction,
          mode,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate field')
      }

      let nextValue = data?.value

      if (fieldType === 'blockContent') {
        nextValue = addKeysToPortableText(nextValue)
      } else if (fieldType === 'array') {
        nextValue = normalizeArrayValue(nextValue)
      } else if (fieldType === 'slug' && typeof nextValue === 'string') {
        nextValue = {current: nextValue}
      }

      onChange(PatchEvent.from(set(nextValue)))
      setDialogOpen(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [arrayItemType, documentType, documentValue, fieldName, fieldType, instruction, mode, onChange, value])

  return (
    <Stack space={2}>
      {renderDefault(props)}
      {canUseAi && (
        <Flex justify="flex-end">
          <Button
            text="AI Generate"
            icon={SparklesIcon}
            mode="ghost"
            tone="primary"
            onClick={() => {
              setMode(value ? 'improve' : 'generate')
              setDialogOpen(true)
            }}
          />
        </Flex>
      )}
      {dialogOpen && (
        <Dialog
          header="AI Assist"
          id={`ai-field-${fieldName}`}
          width={1}
          onClose={() => setDialogOpen(false)}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Box>
                <Label>Mode</Label>
                <Select
                  value={mode}
                  onChange={(event) => setMode(event.currentTarget.value as AiMode)}
                >
                  <option value="generate">Generate</option>
                  <option value="improve">Improve</option>
                </Select>
              </Box>
              <Box>
                <Label>Instruction (optional)</Label>
                <TextArea
                  rows={4}
                  value={instruction}
                  onChange={(event) => setInstruction(event.currentTarget.value)}
                  placeholder="Contoh: Buat lebih singkat dan formal."
                />
              </Box>
              {loading && (
                <Card padding={3} tone="primary" radius={2}>
                  <Flex align="center" gap={3}>
                    <Spinner muted />
                    <Text size={1} weight="semibold">Generating field content...</Text>
                  </Flex>
                </Card>
              )}
              {error && (
                <Card padding={3} tone="critical" radius={2}>
                  <Text size={1}>{error}</Text>
                </Card>
              )}
              <Flex justify="flex-end" gap={2}>
                <Button text="Cancel" mode="ghost" onClick={() => setDialogOpen(false)} />
                <Button
                  text={loading ? 'Generating...' : 'Apply'}
                  tone="primary"
                  onClick={handleGenerate}
                  disabled={loading}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Stack>
  )
}

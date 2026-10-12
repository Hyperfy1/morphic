'use client'

import {
  IconVolume as Volume,
  IconVolumeOff as VolumeOff
} from '@tabler/icons-react'

import {
  isSpeechSupported,
  setSpeechEnabled,
  useSpeechEnabled
} from '@/lib/speech-output'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function SpeechMenuItem() {
  const enabled = useSpeechEnabled()
  const Icon = enabled ? Volume : VolumeOff

  return (
    <DropdownMenuItem
      role="menuitemcheckbox"
      aria-checked={enabled}
      disabled={!isSpeechSupported()}
      onSelect={event => {
        event.preventDefault()
        setSpeechEnabled(!enabled)
      }}
    >
      <Icon className="size-4" />
      <span>Read replies aloud</span>
      <span className="ml-auto text-xs text-muted-foreground">
        {enabled ? 'On' : 'Off'}
      </span>
    </DropdownMenuItem>
  )
}

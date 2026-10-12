'use client'

import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'morphic-speech-output'
const listeners = new Set<() => void>()

export function isSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined'
  )
}

export function getSpeechEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}

export function setSpeechEnabled(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled))
  } catch {
    // storage unavailable; the preference only lasts for this render
  }
  if (!enabled) stopSpeaking()
  listeners.forEach(l => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export function useSpeechEnabled(): boolean {
  return useSyncExternalStore(subscribe, getSpeechEnabled, () => false)
}

/** Strip markdown, citations and code so text reads naturally aloud */
export function toSpeakableText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[\d+\]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_~>#|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Speak text, cancelling any current speech. Returns false if unsupported. */
export function speak(
  text: string,
  handlers?: { onStart?: () => void; onEnd?: () => void }
): boolean {
  const speakable = toSpeakableText(text)
  if (!isSpeechSupported() || !speakable) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(speakable)
  utterance.onstart = () => handlers?.onStart?.()
  utterance.onend = () => handlers?.onEnd?.()
  utterance.onerror = () => handlers?.onEnd?.()
  synth.speak(utterance)
  return true
}

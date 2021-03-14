import { Draft } from 'immer'

export function setValue(key: string, value: unknown): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export function getValue<T>(key: string): T | undefined {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : undefined
  }
  return undefined
}

export function loadObjectIntoDraft<T>(draft: Draft<T>, version: string, prefix: string): boolean {
  const saved = getValue<string>(prefix) === version
  if (saved) {
    Object.keys(draft).forEach((key) => (((draft as T)[key as keyof T] as unknown) = getValue(`${prefix}.${key}`)))
  }
  return saved
}

export function saveObject<T>(o: T, version: string, prefix: string): void {
  setValue(prefix, version)
  Object.entries(o).map(([key, value]) => {
    setValue(`${prefix}.${key}`, value)
  })
}

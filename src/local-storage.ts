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

export function loadObjectIntoDraft<T>(draft: Draft<T>, prefix: string): boolean {
  const saved = getValue<boolean>(prefix) || false
  if (saved) {
    Object.keys(draft).forEach((key) => (((draft as T)[key as keyof T] as unknown) = getValue(`${prefix}.${key}`)))
  }
  return saved
}

export function saveObject<T>(o: T, prefix: string): void {
  setValue(prefix, true)
  Object.entries(o).map(([key, value]) => {
    setValue(`${prefix}.${key}`, value)
  })
}

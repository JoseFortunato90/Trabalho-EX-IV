import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CountFieldProps {
  id: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function CountField({
  id,
  value,
  onChange,
  min = 0,
  max = 50,
  disabled = false,
}: CountFieldProps) {
  function handleInputChange(rawValue: string) {
    if (rawValue.trim() === "") {
      onChange(min)
      return
    }

    const parsedValue = Number(rawValue)

    if (!Number.isFinite(parsedValue)) {
      return
    }

    onChange(clamp(Math.trunc(parsedValue), min, max))
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onChange(clamp(value - 1, min, max))}
        disabled={disabled || value <= min}
        aria-label="Diminuir quantidade"
      >
        <MinusIcon />
      </Button>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(event) => handleInputChange(event.target.value)}
        disabled={disabled}
        className="w-16 text-center"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onChange(clamp(value + 1, min, max))}
        disabled={disabled || value >= max}
        aria-label="Aumentar quantidade"
      >
        <PlusIcon />
      </Button>
    </div>
  )
}

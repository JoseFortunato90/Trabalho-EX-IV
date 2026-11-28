import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { QuestionForm } from "./question-form"

describe("QuestionForm", () => {
  it("envia a consulta e a distribuição padrão", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<QuestionForm onSubmit={onSubmit} isSubmitting={false} />)

    await user.type(
      screen.getByLabelText("Tema ou consulta"),
      "Herança e polimorfismo",
    )
    await user.click(screen.getByRole("button", { name: /gerar questões/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    expect(onSubmit.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        query: "Herança e polimorfismo",
        multiple_choice: 5,
        subjective: 2,
      }),
    )
  })
})

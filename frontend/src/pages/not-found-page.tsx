import { FileQuestionIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileQuestionIcon className="size-5" />
          Página não encontrada
        </CardTitle>
        <CardDescription>
          O endereço acessado não corresponde a nenhuma página da aplicação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/">Voltar ao início</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

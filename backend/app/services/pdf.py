from io import BytesIO
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

from app.schemas.exam import ExamResponse

ANSWER_LINES = 6  # linhas para resposta nas questões subjetivas


def build_exam_pdf(exam: ExamResponse, include_answer_key: bool = True) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, title=exam.title)
    styles = getSampleStyleSheet()

    story = [Paragraph(escape(exam.title), styles["Title"]), Spacer(1, 16)]

    # Prova
    for i, q in enumerate(exam.questions, start=1):
        story.append(Paragraph(f"<b>{i}.</b> {escape(q.statement)}", styles["Normal"]))
        story.append(Spacer(1, 6))

        if q.type == "multiple_choice":
            for letter, text in q.alternatives.items():
                story.append(Paragraph(f"{letter}) {escape(text)}", styles["BodyText"]))
        else:
            # Linhas para escrever a resposta
            for _ in range(ANSWER_LINES):
                story.append(Spacer(1, 18))
                story.append(
                    HRFlowable(
                        width="100%",
                        thickness=0.6,
                        color=colors.grey,
                        spaceBefore=0,
                        spaceAfter=0,
                    )
                )

        story.append(Spacer(1, 14))

    # Gabarito
    if include_answer_key:
        story.append(PageBreak())
        story.append(Paragraph("Gabarito", styles["Heading1"]))

        for i, q in enumerate(exam.questions, start=1):
            if q.type == "multiple_choice":
                story.append(Paragraph(
                    f"<b>{i}. {escape(q.correct_answer)}</b> - {escape(q.explanation)}",
                    styles["Normal"],
                ))
            else:
                story.append(Paragraph(
                    f"<b>{i}. Resposta esperada:</b> {escape(q.expected_answer)}",
                    styles["Normal"],
                ))
                for criterion in q.grading_criteria:
                    story.append(Paragraph(f"• {escape(criterion)}", styles["BodyText"]))
            story.append(Spacer(1, 10))

    doc.build(story)
    return buffer.getvalue()
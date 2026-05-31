import io
import logging
import pdfplumber

logger = logging.getLogger(__name__)

# Suppress noisy pdfminer warnings about unknown PDF filters
logging.getLogger("pdfminer").setLevel(logging.ERROR)


def parse_pdf(content: bytes) -> str:
    try:
        return _parse_with_pdfplumber(content)
    except Exception as e:
        logger.warning("pdfplumber failed (%s), trying pypdf fallback", e)
        return _parse_with_pypdf(content)


def _parse_with_pdfplumber(content: bytes) -> str:
    text_parts: list[str] = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def _parse_with_pypdf(content: bytes) -> str:
    from pypdf import PdfReader
    text_parts: list[str] = []
    reader = PdfReader(io.BytesIO(content))
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)
    return "\n".join(text_parts)

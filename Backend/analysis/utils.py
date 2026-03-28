import PyPDF2
import io

def extract_text_from_pdf(pdf_file):
    """
    Extracts text from a Django UploadedFile or file-like object.
    """
    try:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

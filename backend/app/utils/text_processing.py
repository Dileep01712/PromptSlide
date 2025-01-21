# type: ignore
import os
import re
from docx import Document
from PyPDF2 import PdfReader


def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from a file.
    Args:
        file_path (str): Path to the file.
    Returns:
        str: Extracted text from the file.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The file '{file_path}' does not exist.")

    file_extension = os.path.splitext(file_path)[1].lower()

    try:
        if file_extension == ".pdf":
            # Extract text from PDF
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text.strip()
        elif file_extension == ".docx":
            # Extract text from Word Document
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        else:
            raise ValueError(f"Unsupported file type: '{file_extension}'")

    except Exception as e:
        print(f"Error extracting text: {e}")
        raise ValueError(f"Error extracting text: {e}")


def chunk_text(text, max_chunk_size=500):
    """
    Splits text into smaller chunks of a specified maximum size.

    Args:
        text (str): The input text to be chunked.
        max_chunk_size (int): Maximum size of each chunk (default: 500 characters).

    Returns:
        list: A list of text chunks.
    """
    words = text.split()
    chunks = []
    current_chunk = []

    for word in words:
        if sum(len(w) + 1 for w in current_chunk) + len(word) + 1 <= max_chunk_size:
            current_chunk.append(word)
        else:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]

    # Add the last chunk
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


def clean_text(text):
    """
    Clean the input text by removing unwanted characters such as _x000D_,
    MS Word symbols, and PDF artifacts while preserving meaningful symbols.

    Args:
        text (str): The text to clean.

    Returns:
        str: The cleaned text.
    """
    # Remove the unwanted _x000D_ sequence
    text = text.replace("_x000D_", "")

    # Remove bullet points and extra lines
    text = re.sub(
        r"^[•·]\s*", "", text, flags=re.MULTILINE
    )  # Remove bullet points at the start of lines
    text = re.sub(
        r"\n\s*([•·])", "\n", text
    )  # Remove bullet points that follow new lines

    # Remove any remaining bullet point characters
    text = re.sub(r"[•·]", "", text)

    # Remove extra dots (if there are consecutive dots, remove them)
    text = re.sub(r"\.{2,}", ".", text)  # Replace consecutive dots with a single dot

    # Remove non-breaking spaces and other whitespace artifacts
    text = re.sub(
        r"\xa0|\u200b|\ufeff", " ", text
    )  # Non-breaking spaces and zero-width spaces

    # Remove special characters except allowed ones
    allowed_symbols = r"/\-:’"  # Apostrophe is now included
    text = re.sub(rf"[^a-zA-Z0-9\s.,{allowed_symbols}]", "", text)

    # Clean up leading/trailing spaces
    text = text.strip()

    # Replace multiple spaces with a single space
    text = re.sub(r"\s+", " ", text)

    # Ensure a period at the end of each sentence if missing
    text = re.sub(r"([a-zA-Z0-9])([^\s])$", r"\1.\2", text)

    return text


def extract_key_points(text, max_points=5):
    """
    Extract key points from the given text.

    Args:
        text (str): Input text to process.
        max_points (int): Maximum number of key points to extract.

    Returns:
        str: A string containing key points.
    """
    sentences = text.split(".")
    key_points = []

    # Heuristic: Select the first N sentences as key points
    for sentence in sentences:
        if len(sentence.strip()) > 20:  # Skip short or irrelevant sentences
            key_points.append(sentence.strip())
        if len(key_points) >= max_points:
            break

    return "\n".join([f"- {point}" for point in key_points])  # Format as bullet points

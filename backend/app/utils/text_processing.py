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
            text = []
            for para in doc.paragraphs:
                if para.style and getattr(para.style, "name", None):
                    text.append("\nHEADING: " + para.text)  # Mark headings for scoring
                text.append(para.text)
            return "\n".join(text).strip()
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


def split_sentence(text):
    """
    Split text into sentences using regex to handle abbreviations and edge cases.

    Args:
        text (str): The input text.

    Returns:
        list: A list of sentences.
    """
    sentences = re.split(r"(?<!\b\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s+", text)
    return [s.strip() for s in sentences if s.strip()]


def score_sentence(
    sentence, position, position_weight=0.5, keyword_weight=1, lenght_weight=0.1
):
    """
    Score a sentence based on heuristics like position, keywords, and length.

    Args:
        sentence (str): The sentence to score.
        position_weight (float): Weight for sentence position.
        keyword_weight (float): Weight for keyword presence.
        length_weight (float): Weight for sentence length.

    Returns:
        float: The sentence's score.
    """
    keywords = {"important", "key", "summary", "conclusion", "significant"}
    score = 0

    # Position: Higher score if in first/last 10% of sentences
    if position_weight:
        score += position_weight if (position < 0.1 or position > 0.9) else 0

    # Keywords
    if keyword_weight:
        score += keyword_weight * sum(
            1 for word in keywords if word in sentence.lower()
        )

    # Length
    if lenght_weight:
        score += lenght_weight * (len(sentence) // 20)

    # Numbers/Dates
    if re.search(r"\d+", sentence):
        score += 1

    return score


def remove_redundant(sentences, max_similarity=0.8):
    """
    Remove redundant sentences based on similarity.

    Args:
        sentences (list): List of sentences.
        max_similarity (float): Threshold for similarity.

    Returns:
        list: A list of unique sentences.
    """
    unique = []
    for sent in sentences:
        if not any(is_similar(sent, u, max_similarity) for u in unique):
            unique.append(sent)
    return unique


def is_similar(a, b, max_similarity):
    """
    Check if two sentences are similar based on word overlap.

    Args:
        a (str): First sentence.
        b (str): Second sentence.

    Returns:
        bool: True if sentences are similar, False otherwise.
    """
    a_words = set(a.lower().split())
    b_words = set(b.lower().split())
    overlap = len(a_words & b_words)
    return overlap / max(len(a_words), len(b_words)) > max_similarity


def extract_key_points(text, max_points=5):
    """
    Extract key points from the given text.

    Args:
        text (str): Input text to process.
        max_points (int): Maximum number of key points to extract.

    Returns:
        str: A string containing key points.
    """
    sentences = split_sentence(text)
    scored = []
    total = len(sentences)
    for idx, sent in enumerate(sentences):
        position = idx / total
        score = score_sentence(sent, position=position)
        scored.append((score, sent))

    # Sort by score descending
    scored.sort(key=lambda x: -x[0])

    # Select top and deduplicate
    top = [s for _, s in scored[: max_points * 2]]
    unique = remove_redundant(top)
    return "\n".join([f"- {s}" for s in unique[:max_points]])

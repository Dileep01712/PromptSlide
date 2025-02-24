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
    Clean the input text by removing unwanted artifacts (_x000D_, MS Word symbols)
    while preserving bullet points for PPT formatting.

    Args:
        text (str): The text to clean.

    Returns:
        str: The cleaned text.
    """

    # 1. Remove all variations of `_x000D_` plus any trailing whitespace, and also remove \r
    text = re.sub(r"_x000D_\s*", "", text, flags=re.IGNORECASE)
    text = text.replace("\r", "")

    # 2. Normalize different types of line breaks
    text = text.replace("\r\n", "\n").replace("\n\n", "\n").strip()

    # 3. Preserve bullet points (•, -, *, →) but clean unwanted artifacts
    #    First keep valid bullet points
    text = re.sub(r"([^\S\r\n]*[•\-\*→]+[^\S\r\n]*)", r"\1", text)
    #    Ensure correct spacing after bullets
    text = re.sub(r"\s*([•\-\*→])\s*", r"\n\1 ", text)

    # 4. Remove non-breaking spaces, zero-width spaces, and unwanted invisible characters
    text = re.sub(r"[\xa0\u200b\ufeff]", " ", text)

    # 5. Collapse multiple spaces into one
    text = re.sub(r"\s+", " ", text).strip()

    # 6. (Optional) Ensure a period if text doesn't already end with punctuation
    if not re.search(r"[.!?]$", text):
        text += "."

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


def clean_model_response(data):
    """
    Cleans and transforms presentation data:
      - Top-level title and subtitle are cleaned but never get a trailing period.
      - Each slide title is cleaned but never gets a trailing period.
      - Each slide's content is cleaned and may get a trailing period if missing.
      - In slide content, if a line ends with ':', it is replaced with '.'.
      - If a line starts with a bullet (either '*' or '•'), that bullet is removed and replaced with a leading space.
    """
    if not isinstance(data, dict):
        raise TypeError("Expected a dict as input")

    def basic_clean_text(text):
        """
        Basic text cleaning: remove _x000D_, normalize line breaks,
        remove zero-width spaces, and collapse all whitespace.
        This is used for text that does not require preserving newlines.
        """
        # 1. Remove all variations of `_x000D_` and remove \r
        text = re.sub(r"_x000D_\s*", "", text, flags=re.IGNORECASE)
        text = text.replace("\r", "")

        # 2. Normalize line breaks
        text = text.replace("\r\n", "\n").replace("\n\n", "\n").strip()

        # 3. Remove non-breaking spaces, zero-width spaces, and unwanted invisible characters
        text = re.sub(r"[\xa0\u200b\ufeff]", " ", text)

        # 4. Collapse multiple whitespace characters (including newlines) into a single space
        text = re.sub(r"\s+", " ", text).strip()

        return text

    def basic_clean_text_preserve_newlines(text):
        """
        Basic text cleaning that preserves newline characters.
        Removes _x000D_, normalizes line breaks, removes zero-width spaces,
        and collapses multiple spaces within each line (but keeps line breaks).
        """
        # 1. Remove _x000D_ and \r characters
        text = re.sub(r"_x000D_\s*", "", text, flags=re.IGNORECASE)
        text = text.replace("\r", "")

        # 2. Normalize line breaks (we want to preserve these)
        text = text.replace("\r\n", "\n").replace("\n\n", "\n").strip()

        # 3. Remove non-breaking spaces, zero-width spaces, and unwanted invisible characters
        text = re.sub(r"[\xa0\u200b\ufeff]", " ", text)

        # 4. Collapse multiple spaces in each line (but not across newlines)
        lines = text.split("\n")
        cleaned_lines = [re.sub(r" {2,}", " ", line).strip() for line in lines]
        text = "\n".join(cleaned_lines)

        return text

    def add_period_if_missing(text):
        """
        If the text does not end with '.', '!', or '?', add a period.
        """
        if not re.search(r"[.!?]$", text):
            text += "."
        return text

    def transform_bullets_and_colons(text):
        """
        Split the text by lines, then:
          - If a line ends with ':', replace it with '.'
          - If a line starts with '*' or '•', remove that bullet and
            replace it with a single leading space.
        """
        lines = text.split("\n")
        new_lines = []
        for line in lines:
            # Replace a trailing colon with a period
            line = re.sub(r":\s*$", ".", line)
            # Remove a starting bullet and replace with a space
            line = re.sub(r"^[*•](\s*)", " ", line)
            new_lines.append(line.strip() if line.strip() else line)
        return "\n".join(new_lines)

    #
    # 1. Clean top-level title/subtitle (use basic_clean_text which collapses newlines)
    #
    if "title" in data and isinstance(data["title"], str):
        data["title"] = basic_clean_text(data["title"])
    if "subtitle" in data and isinstance(data["subtitle"], str):
        data["subtitle"] = basic_clean_text(data["subtitle"])

    #
    # 2. Clean slides
    #
    if "slides" in data and isinstance(data["slides"], list):
        for slide in data["slides"]:
            if not isinstance(slide, dict):
                continue

            # Clean slide title (collapse newlines)
            if "title" in slide and isinstance(slide["title"], str):
                slide["title"] = basic_clean_text(slide["title"])

            # For slide content, preserve newlines for proper bullet/colon handling:
            if "content" in slide and isinstance(slide["content"], str):
                # Use cleaning function that preserves newline characters
                content = basic_clean_text_preserve_newlines(slide["content"])
                content = transform_bullets_and_colons(content)
                content = add_period_if_missing(content)
                slide["content"] = content

    return data

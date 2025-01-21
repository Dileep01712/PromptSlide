# type: ignore
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from app.utils.text_processing import extract_key_points

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


# FAISS index setup (Flat index for simplicity)
dimension = 384  # Dimension of the embedding model output
index = faiss.IndexFlatL2(dimension)
text_chunks = []  # To store the actual text


def add_to_vector_db(chunks):
    """
    Add text chunks to FAISS index.
    Args:
        chunks (list): List of text chunks.
    """
    global text_chunks
    embeddings = model.encode(chunks)
    text_chunks.extend(chunks)
    index.add(np.array(embeddings).astype("float32"))


def search_in_vector_db(query, top_k=5):
    """
    Search for the most similar chunks based on a query.
    Args:
        query (str): Query text.
        top_k (int): Number of top results to return.
    Returns:
        list: Top matching text chunks.
    """
    if index.ntotal == 0:  # Check if the FAISS index is empty
        # print("FAISS index is empty. No content to search.")
        return []  # Return an empty list if the index is empty

    query_embedding = model.encode([query])
    distances, indices = index.search(
        np.array(query_embedding).astype("float32"), top_k
    )

    # Retrieve the top-k text chunks
    matched_chunks = [text_chunks[i] for i in indices[0] if i < len(text_chunks)]

    if not matched_chunks:
        print("No matching chunks found in the vector database.")

    # Extract key points from the matched chunks
    key_points = extract_key_points(
        " ".join(matched_chunks)
    )  # Join chunks for processing
    return key_points


def clear_vector_db():
    """
    Clears all data from the vector database.
    This prevents mixing content from previous files with new ones.
    """
    try:
        # Reset the index
        global text_chunks  # Access the global text_chunks list
        text_chunks = []  # Clear the list storing text chunks
        index.reset()
        print("\nVector database cleared successfully.")
    except Exception as e:
        print(f"Error while clearing vector database: {e}")

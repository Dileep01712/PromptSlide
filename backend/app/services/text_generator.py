import re
import os
import json
import time
from dotenv import load_dotenv
from pydantic import SecretStr
from fastapi import HTTPException
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from app.services.system_prompt import system_prompt_1
from app.services.pptx_generator import create_presentation
from app.services.faiss_vector_db import search_in_vector_db


# Load environment variables
try:
    load_dotenv()
except Exception as e:
    print(f"Error while loading environment variables: {e}")

# Initialize the ChatGroq model with API key from environment variables
try:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is missing in environment variables")

    # Use SecretStr from pydantic to wrap the API key
    api_key_secret = SecretStr(GROQ_API_KEY)

    chat_model = ChatGroq(
        model="llama3-8b-8192", api_key=api_key_secret  # Pass the wrapped SecretStr
    )
except Exception as e:
    print(f"Error while initializing ChatGroq model: {e}")


def fix_json_string(bad_json_str: str) -> str:
    """
    Attempt to fix minor JSON issues such as trailing quotes after digits.
    This is a naive approach; tailor it to your specific error patterns.
    """
    fixed_str = re.sub(
        r'(\d+)(\\*)"',
        lambda m: m.group(1) + "",
        bad_json_str,
    )
    return fixed_str


def remove_whitespaces(text):
    text = text.replace("\n", " ")  # Replace newlines with a space
    text = re.sub(r"\s{2,}", " ", text)  # Replace 2 or more spaces with a single space
    return text.strip()  # Remove leading and trailing spaces


def generate_presentation_from_content(title, tone, language, num_slides=7, index=0):
    """
    Generate a presentation using extracted content and user inputs.

    Args:
        title (str): Topic for the presentation.
        tone (str): Writing tone for the slides.
        language (str): Language for the slides.
        num_slides (int): Number of slides.
    """
    # Fetch related key points
    related_key_points = search_in_vector_db(title, top_k=10)
    print(f"\nRelated key points retrieved: {related_key_points}")

    related_text = " ".join(related_key_points) if related_key_points else ""
    print(f"\nRelated text length: {len(related_text)}")

    # Prepare prompt for ChatGroq
    messages = [
        SystemMessage(content=system_prompt_1),
        SystemMessage(
            content=f"Topic: {title}, Tone: {tone}, Language: {language}, Slides: {num_slides}, Sentences: {related_text}"
        ),
    ]

    structured_llm = chat_model.with_structured_output(
        method="json_mode",
        include_raw=True,
    )

    # Invoke model and get the raw response
    response = None
    try:
        response_model = structured_llm.invoke(messages)
        response = response_model["raw"].content  # type: ignore
    except Exception as e:
        # To remove \n from error message and convert to string
        error_message = (
            str(e).replace("\n", "").replace("\\n", "")
        )  # Convert exception to string

        # remove whitespaces and \n
        output = remove_whitespaces(error_message)
        start_index = output.find('{ "title')
        if start_index == -1:
            raise Exception("Cannot find '{ \"title' in output string")
        str_json = output[start_index : len(output) - 3]
        response = fix_json_string(str_json)
        print(f"Extracted string json from error: {response}")

    print(f"Model Response: {response}")
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Check for empty response
            if not response:
                raise ValueError("Empty response from model")

            # Now clean and process the JSON as needed.
            json_str = response.replace("\\", "")
            data = json.loads(json_str)
            # cleaned_text = clean_model_response(data)
            # print(f"Cleaned text: {cleaned_text}")
            create_presentation(data, index)
            print("\nSuccessfully created presentation")
            break

        except Exception as e:
            print(f"\nAttempt {attempt+1} - Error: {e}")
            if attempt < max_retries - 1:
                print("\nRetrying...")
                time.sleep(1)
            else:
                raise HTTPException(
                    status_code=400,
                    detail="An unexpected error occurred. Please try again.",
                )

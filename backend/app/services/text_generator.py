# type: ignore
import os
import json
import traceback
from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from app.services.system_prompt import system_prompt_1
from app.services.pptx_generator import create_presentation
from app.services.faiss_vector_db import search_in_vector_db

class SlideSchema(BaseModel):
    id: int
    title: str
    content:str

class PPTSchema(BaseModel):
    title: str
    subtitle: str
    slides: list[SlideSchema]

# Load environment variables
try:
    load_dotenv()
except Exception as e:
    print(f"Error while loading environment variables: {e}")

# Initialize the ChatGroq model with API key from environment variables
try:
    chat_model = ChatGroq(
        model="llama3-8b-8192", groq_api_key=os.getenv("GROQ_API_KEY"), 
    )
except Exception as e:
    print(f"Error while initializing ChatGroq model: {e}")


def generate_presentation_from_content(title, tone, language, num_slides):
    """
    Generate a presentation using extracted content and user inputs.

    Args:
        title (str): Topic for the presentation.
        tone (str): Writing tone for the slides.
        language (str): Language for the slides.
        num_slides (int): Number of slides.
    """
    try:
        # Default num_slides to 7 if it's not provided
        num_slides = num_slides if num_slides else 7

        # Fetch related key points
        related_key_points = search_in_vector_db(title, top_k=10)
        # TODO: Can improve search query for seaching in vector database
        print(f"\nRelated key points retrieved: {related_key_points}")

        related_text = (
            " ".join(related_key_points) if related_key_points else ""
        )  # Combine key points into a single string
        print(f"\nRelated text length: {len(related_text)}")

        # Prepare prompt for ChatGroq
        messages = [
            SystemMessage(content=system_prompt_1),
            SystemMessage(
                content=f"Topic: {title}, Tone: {tone}, Language: {language}, Slides: {num_slides}, Sentences: {related_text}"
            ),
        ]

        structured_llm = chat_model.with_structured_output(
            PPTSchema,
            method="json_mode",
            include_raw=True,
        )

        # Invoke model
        response = structured_llm.invoke(messages)
        # print(f"\nModel response received: {response}")
        
        response = response['raw'].content
        response = json.loads(response)
        print(f"\nResponse: {response}")

        # Pass title and slides content to create_presentation
        create_presentation(response)
        print("\nSuccessfully created presentation")

    except Exception as e:
        print(f"Error during presentation generation: {e}")
        print(traceback.format_exc())
        raise

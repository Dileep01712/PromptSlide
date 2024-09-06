import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from pptxGenerator import create_presentation
from langchain_core.messages import HumanMessage, SystemMessage


try:
    load_dotenv()
except Exception as e:
    print(f"Error while loading environment variables: {e}")


try:
    # Initialize ChatGroq model with the specified model and API key from environment variables
    chat_model = ChatGroq(model="llama3-8b-8192", groq_api_key=os.getenv("GROQ_API_KEY"))  # type: ignore
except Exception as e:
    print(f"Error while initializing ChatGroq model: {e}")


try:
    # Open the system prompt JSON file and load its contents into a dictionary
    with open("system_prompt.json", "r") as file:
        system_prompt_data = json.load(file)
except FileNotFoundError as e:
    # Print an error message if the system prompt file is not found
    print(f"System prompt file not found: {e}")
    # Initialize an empty dictionary as fallback
    system_prompt_data = {}
except json.JSONDecodeError as e:
    # Print an error message if there is an issue decoding the JSON file
    print(f"Error decoding system prompt JSON: {e}")
    # Initialize an empty dictionary as fallback
    system_prompt_data = {}
except Exception as e:
    # Print a generic error message for any other issues
    print(f"Error loading system prompt data: {e}")
    # Initialize an empty dictionary as fallback
    system_prompt_data = {}

# Define the topic name for the presentation
topic_name = "ChatGroq Model"


try:
    # Prepare the messages to send to the ChatGroq model
    messages = [
        # Create a system message with content from the system prompt data
        SystemMessage(content=system_prompt_data.get("prompt1", "")),
        # Create a human message with the specified topic name
        HumanMessage(content=f"Topic: {topic_name}"),
    ]
except Exception as e:
    # Print an error message if there is an issue preparing the messages
    print(f"Error while preparing messages for ChatGroq model: {e}")


try:
    response = chat_model.invoke(messages)
    response_content = response.content
except Exception as e:
    print(f"Error while invoking the model: {e}")
    # Initialize an empty string as fallback
    response_content = ""


try:
    # Check if the response content is a string
    if isinstance(response_content, str):
        # Find the start and end positions of the JSON string within the response content
        json_start = response_content.find("```")
        json_end = response_content.rfind("```")
        # Extract the JSON string from the response content
        json_string = (
            response_content[json_start + 3 : json_end]
            if json_start != -1 and json_end != -1
            else ""
        )
    else:
        # Initialize an empty string if the response content is not a string
        json_string = ""
except Exception as e:
    print(f"Error extracting JSON string from response content: {e}")
    # Initialize an empty string as fallback
    json_string = ""


try:
    # Parse the extracted JSON string into a dictionary
    topic_data = json.loads(json_string)
except json.JSONDecodeError as e:
    # Print an error message if there is an issue parsing the JSON string
    print(f"Failed to parse JSON: {e}")
    # Initialize an empty dictionary as fallback
    topic_data = {}
except Exception as e:
    # Print a generic error message for any other issues
    print(f"Error while parsing JSON string: {e}")
    # Initialize an empty dictionary as fallback
    topic_data = {}


try:
    # Create a PowerPoint presentation using the topic name and parsed data
    create_presentation(topic_name, topic_data)
except Exception as e:
    # Print an error message if there is an issue creating the presentation
    print(f"Error while creating presentation: {e}")

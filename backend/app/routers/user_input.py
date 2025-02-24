import os
import traceback
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.services.faiss_vector_db import add_to_vector_db, clear_vector_db
from app.services.text_generator import generate_presentation_from_content
from app.utils.text_processing import extract_text_from_file, clean_text, chunk_text

router = APIRouter()


@router.post("/user_input")
async def user_data(
    title: str = Form(...),
    tone: str = Form("Professional"),
    language: str = Form("English"),
    num_slides: int = Form(7),
    style: int = Form(0),
    file: List[UploadFile] = File(None),
):
    """
    API to generate a presentation based on user inputs.

    Args:
        topic (str): Topic for generating slides.
        tone (str): Writing tone for the presentation content.
        language (str): Language for the presentation content.
        num_slides (int): Number of slides to include in the presentation.
        style (str): Style/theme of the presentation.
        file (UploadFile, optional): Optional file upload for text extraction.
    """
    try:
        # Additional validation to ensure no empty values
        if not title.strip() or not tone.strip() or not language.strip():
            raise HTTPException(status_code=400, detail="All fields must be filled in.")

        print("Selected style: ", style)

        # Ensure num_slide  and style is a positive number
        if num_slides <= 0:
            raise HTTPException(
                status_code=400, detail="Number of slides must be a psoitive number."
            )

        if style < 0:
            print("Index of template must be a psoitive number.")

        print(f"Received file: {file}")  # ✅ Debugging statement
        if file:
            print(f"File Name: {file[0].filename}")  # ✅ Check file name
            print(f"File Type: {file[0].content_type}")  # ✅ Check file type

        request_data = {
            "title": title,
            "tone": tone,
            "language": language,
            "num_slides": num_slides,
            "style": style,
            "file": file,
        }
        print(f"\nRequest Data: {request_data}")

        if not os.path.exists("app/uploads"):
            os.makedirs("app/uploads")

        # Extract Text from Uploaded File (if file is provided)
        extracted_content = ""
        if file:
            print(f"File name: {file[0].filename}, File type: {file[0].content_type}")
            file_path = f"app/uploads/{file[0].filename}"

            with open(file_path, "wb") as f:
                f.write(await file[0].read())

            extracted_content = extract_text_from_file(file_path)

            # Clear the vector database to avoid retaining old data
            clear_vector_db()

            if extracted_content.strip():
                cleaned_text = clean_text(extracted_content)
                text_chunks = chunk_text(cleaned_text)
                add_to_vector_db(text_chunks)
                print(f"\nExtracted Content: {text_chunks}")
            else:
                print("No content extracted from the uploaded file.")

            os.remove(file_path)  # Remove the uploaded file after processing
        actual_slides = num_slides - 1
        # Pass user inputs to generate the presentation
        generate_presentation_from_content(
            title, tone, language, actual_slides, index=style
        )

        # TODO: Send ppt file
        return {"message": "Parameters are passed successfully!"}

    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

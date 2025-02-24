import os
import time
import subprocess
from threading import Timer
from fastapi.responses import FileResponse
from fastapi import APIRouter, HTTPException

router = APIRouter()

# Define folders
PPT_FOLDER = os.path.abspath("app/presentations/ppt")
PDF_FOLDER = os.path.abspath("app/presentations/pdf")

# Ensure the PDF folder exists
os.makedirs(PDF_FOLDER, exist_ok=True)

LIBREOFFICE_PATH = r"C:\Program Files\LibreOffice\program\soffice.exe"


def get_latest_file(folder, extension):
    """Returns the latest created file with the given extension from the folder."""
    try:
        files = [f for f in os.listdir(folder) if f.endswith(extension)]
        if not files:
            return None

        # Sort by creation time (newest file first)
        files.sort(
            key=lambda x: os.path.getmtime(os.path.join(folder, x)), reverse=True
        )
        return files[0]  # Return the most recently created file
    except Exception as e:
        print(f"❌ Error fetching latest {extension} file from {folder}: {e}")
        return None


@router.get("/get-pptx")
async def get_ppt():
    """Returns the PPTX file for download"""

    pptx_filename = get_latest_file(PPT_FOLDER, ".pptx")
    # print(pptx_filename)

    if pptx_filename is None:
        raise HTTPException(status_code=404, detail="No PPTX file found in the folder!")

    file_path = os.path.join(PPT_FOLDER, pptx_filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PPT file not found!")

    response = FileResponse(
        file_path,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        filename=pptx_filename,
    )

    # Force-set the header (optional)
    response.headers["Content-Disposition"] = f'attachment; filename="{pptx_filename}"'
    print(response.headers)
    return response


@router.get("/convert-ppt-to-pdf")
async def convert_pptx_to_pdf():
    """Converts the latest PPTX file in the folder to PDF and returns it."""
    # print(f"📂 PPT Folder: {PPT_FOLDER}")
    # print(f"📂 PDF Folder: {PDF_FOLDER}")

    pptx_filename = get_latest_file(PPT_FOLDER, ".pptx")
    if not pptx_filename:
        raise HTTPException(status_code=404, detail="No PPTX file found in folder!")

    input_pptx = os.path.join(PPT_FOLDER, pptx_filename)
    output_pdf = os.path.join(PDF_FOLDER, os.path.splitext(pptx_filename)[0] + ".pdf")

    # print(f"📌 Converting: {input_pptx} → {output_pdf}")

    # Check if PPTX exists
    if not os.path.exists(input_pptx):
        raise HTTPException(
            status_code=404, detail=f"PPTX file not found: {input_pptx}"
        )

    try:
        # Convert PPTX to PDF
        result = subprocess.run(
            [
                LIBREOFFICE_PATH,
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                PDF_FOLDER,
                input_pptx,
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        # print(f"✅ Converted: {input_pptx} → {output_pdf}")
        # print("🔹 STDOUT:", result.stdout)
        # print("🔹 STDERR:", result.stderr)

        # Check if the PDF was successfully created
        if not os.path.exists(output_pdf):
            raise HTTPException(status_code=500, detail="PDF conversion failed!")

        schedule_deletion_after_conversion(input_pptx, output_pdf, delay=1800)

        # Return the converted PDF file
        return FileResponse(
            output_pdf,
            media_type="application/pdf",
            filename=os.path.basename(output_pdf),
        )

    except subprocess.CalledProcessError as e:
        print(f"❌ Conversion failed for {input_pptx}")
        print("🔹 STDERR:", e.stderr)
        raise HTTPException(status_code=500, detail="Error during PDF conversion")


def delete_file_after_delay(file_path, delay):
    """Deletes a file after a specified delay (in seconds)."""

    def delete_file():
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"✅ Deleted file: {file_path}")
            else:
                print(f"❌ File not found: {file_path}")
        except Exception as e:
            print(f"❌ Error deleting file {file_path}: {e}")

    # Schedule the deletion
    Timer(delay, delete_file).start()


def schedule_deletion_after_conversion(pptx_path, pdf_path, delay=1800):
    """Schedules the deletion of both the PPTX and the PDF file after conversion."""
    print(
        f"🕒 Scheduling deletion for PPTX: {pptx_path} in {delay} seconds\n🕒 Scheduling deletion for PDF: {pdf_path} in {delay} seconds"
    )

    # Ensure the PDF file exists before scheduling its deletion
    max_wait_time = 5  # seconds
    wait_interval = 0.5  # check every 0.5 sec
    elapsed_time = 0

    while not os.path.exists(pdf_path) and elapsed_time < max_wait_time:
        time.sleep(wait_interval)
        elapsed_time += wait_interval

    # If the PDF file exists, schedule deletion for both files
    if os.path.exists(pdf_path):
        delete_file_after_delay(pptx_path, delay)
        delete_file_after_delay(pdf_path, delay)
    else:
        print(
            f"❌ PDF file not found after waiting, deletion not scheduled for {pdf_path}"
        )

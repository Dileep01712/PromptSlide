# type:ignore
from prisma import Prisma

# Create a Prisma Client Instance
prisma = Prisma()


# Function to initialize connection
async def connect_to_db():
    if not prisma.is_connected():
        await prisma.connect()


# Function to disconnect the client
async def disconnect_from_db():
    if prisma.is_connected():
        await prisma.disconnect()

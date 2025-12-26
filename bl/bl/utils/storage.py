import uuid
from .supabase import supabase
from django.conf import settings

def upload_file_to_supabase(file, folder="uploads"):
    file_ext = file.name.split('.')[-1]
    file_name = f"{folder}/{uuid.uuid4()}.{file_ext}"
    file_byte=b""
    for chunks in file.chunks():
        file_byte+=chunks
    response = supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
        file_name,
        # file.read(),
        file_byte,
        {
            "content-type": file.content_type
        }
    )

    if response.get("error"):
        raise Exception(response["error"]["message"])

    public_url = supabase.storage.from_(settings.SUPABASE_BUCKET).get_public_url(file_name)
    return public_url  
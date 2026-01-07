
from .supabase import supabase
import uuid
from django.conf import settings

def upload_file_to_supabase(file, folder="uploads"):
    file_ext = file.name.rsplit(".", 1)[-1]
    file_name = f"{folder}/{uuid.uuid4()}.{file_ext}"

    response = supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
        path=file_name,
        file=file.read(),
        file_options={
            "content-type": file.content_type
        }
    )

    if response.get("error"):
        raise RuntimeError(response["error"]["message"])

    return supabase.storage.from_(
        settings.SUPABASE_BUCKET
    ).get_public_url(file_name)

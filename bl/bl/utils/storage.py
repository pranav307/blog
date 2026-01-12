# bl/utils/storage.py
import uuid
from django.conf import settings
from .supabase import supabase

# bl/utils/storage.py
import uuid
from django.conf import settings
from .supabase import supabase

def upload_file_to_supabase(file, folder="uploads"):
    content_type = file.content_type
    ext = content_type.split("/")[-1]
    file_name = f"{folder}/{uuid.uuid4()}.{ext}"

    file_bytes = file.read()  # critical fix

    supabase.storage.from_(
        settings.SUPABASE_BUCKET
    ).upload(
        path=file_name,
        file=file_bytes,
        file_options={"content-type": content_type}
    )

    return supabase.storage.from_(
        settings.SUPABASE_BUCKET
    ).get_public_url(file_name)

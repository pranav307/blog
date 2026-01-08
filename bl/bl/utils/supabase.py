# bl/utils/supabase.py
from supabase import create_client
from django.conf import settings

def get_supabase():
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise RuntimeError("Supabase credentials are not provided")

    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_KEY
    )

supabase = get_supabase()

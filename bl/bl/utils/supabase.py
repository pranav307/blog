from supabase import create_client
from django.conf import settings

def get_supabase():
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise RuntimeError("supabase credetials are not provided")
    return create_client(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_SERVICE_KEY   
    )

supabase=get_supabase()
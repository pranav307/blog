from celery import shared_task
from django.contrib.auth.tokens import default_token_generator
# from django.utils.http import urlsafe_base64_encode
# from django.utils.encoding import force_bytes
from .models import Customuser,Mediahandle
# from django.core.mail import send_mail
from django.conf import settings
from bl.utils.storage import upload_file_to_supabase

@shared_task(bind=True,autoretry_for=(Exception,),retry_kwargs={"max_retries":3,"countdown":10})
def handle_media_upload(file_data,content_type, post_id=None):
    """
    file_data: file in memory (e.g. bytes)
    filename: original file name
    content_type: mime type
    """
    if content_type.startswith("image/"):
        media_type = "image"
        folder = "images"
    elif content_type.startswith("video/"):
        media_type = "video"
        folder = "videos"
    else:
        raise ValueError("Unsupported file type")

    # Supabase upload
    file_url = upload_file_to_supabase(file_data, folder)

    # Save in DB
    media = Mediahandle.objects.create(
        file_url=file_url,
        media_type=media_type,
        post_id=post_id
    )

    return {
        "media_id": media.id,
        "file_url": file_url,
        "media_type": media_type
    }

# # @shared_task(bind=True,autoretry_for=(Exception,),retry_kwargs={"max_retries": 3, "countdown": 10})
# # def Sendverificationemail(self, user_id):
# #     print("TASK STARTED")

# #     user = Customuser.objects.get(id=user_id)

# #     uid = urlsafe_base64_encode(force_bytes(user.pk))
# #     token = default_token_generator.make_token(user)

# #     verifyurl = f"http://127.0.0.1:8000/verifyurl/{uid}/{token}/"

# #     print("SENDING MAIL")

# #     send_mail(
# #         subject="Verification email",
# #         message=f"Click to verify: {verifyurl}",
# #         from_email=settings.DEFAULT_FROM_EMAIL,
# #         recipient_list=[user.email],
# #         fail_silently=False,
# #     )

# #     print("MAIL SENT")


# def send_verification_email(user_id):
#     print("FUNCTION STARTED")

#     user = Customuser.objects.get(id=user_id)

#     uid = urlsafe_base64_encode(force_bytes(user.pk))
#     token = default_token_generator.make_token(user)

#     verifyurl = f"http://127.0.0.1:8000/verifyurl/{uid}/{token}/"

#     print("SENDING MAIL")

#     send_mail(
#         subject="Verification email",
#         message=f"Click to verify: {verifyurl}",
#         from_email=settings.DEFAULT_FROM_EMAIL,
#         recipient_list=[user.email],
#         fail_silently=False,
#     )

#     print("MAIL SENT")

  
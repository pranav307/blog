from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Customuser,Profile
@receiver(post_save,sender=Customuser)
def created_profile(sender,instance,created,**kwargs):
    if created:
        Profile.objects.create(user=instance)
        print("profile created")
    
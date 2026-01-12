from django.contrib import admin
from .models import Customuser, Postarticle, LikePost, Comment, Mediahandle

admin.site.register(Customuser)
admin.site.register(Postarticle)
admin.site.register(LikePost)
admin.site.register(Comment)
admin.site.register(Mediahandle)
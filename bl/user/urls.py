


from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import RegisterUser,EmailTokenObtainPairView,VerifyEmailView \
,ProfileView,LikePostview,Articlehai,Articlelist,\
Commentview,Postgpd,ImageHandling,dashboard,CommentDeleteByPost

router=DefaultRouter()
router.register('like',LikePostview,basename="likepost")
router.register("pl",Articlelist,basename="plist")
router.register("cm",Commentview,basename="commentview")


urlpatterns = [
   path("re/",RegisterUser.as_view(),name="reg"),
   path("to/",EmailTokenObtainPairView.as_view(),name="jwt"),
   path('verifyurl/<uidb64>/<token>/',VerifyEmailView.as_view(),name="verify"),
   path("pro/",ProfileView.as_view(),name="profileview"),
   # path("<int:post>/li/",LikePostview.as_view({"post":"create"}),name="likes"),
   path("",include(router.urls)),
   path("plist/",Articlehai.as_view(),name="userpost"),
   path("ard/<int:pk>/",Postgpd.as_view(),name="pgpd"),
   path("me/<int:post_id>/",ImageHandling.as_view(),name="media"),
   path("t/",dashboard),
   path("c/delete/", CommentDeleteByPost.as_view()),
   # path("task/<int:task_id>/",TaskStatus.as_view(),name="taskhai")
]
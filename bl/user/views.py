from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .permissions import Postisowner,Commentpermission
from .serialllizers import UserSerializer,\
    EmailTokenObtainPairSerializer,Profileseriallizer,Postseriallizer,\
        Likeseriallizer,Commentserializer
from django.utils.http import urlsafe_base64_decode
from .models import Customuser,Profile,Postarticle,LikePost,Comment,Mediahandle
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.views.decorators.vary import vary_on_headers
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.shortcuts import get_object_or_404
# from .tasks import send_verification_email
from rest_framework import viewsets
from django.db.models import Q
from rest_framework.decorators import action
from bl.utils.storage import upload_file_to_supabase
from django.http import HttpResponse
from django.core.cache import cache
from django_redis import get_redis_connection
User = get_user_model()

def home(request):
    return HttpResponse("ho gaya")
def dashboard(request):
    return HttpResponse(" <h1> Admin Dashboard </h1> ")
class RegisterUser(APIView):
    """
    API endpoint to register a new user.
    """

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # create method in serializer handles password hashing

            # send_verification_email(user.id)
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from rest_framework_simplejwt.views import TokenObtainPairView

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Customuser.objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save(update_fields=["is_active"])
            return Response({"message": "Email verified"})
        return Response({"error": "Invalid or expired token"})
    

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # profile = request.user.profile
            # APIView does'nt have self.user
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = Profileseriallizer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = Profileseriallizer(
            profile,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    

def clear_cache_key():
    redis =get_redis_connection("default")
    keys =redis.get("user_*_page*")
    if keys:
        redis.delete(*keys)
class Postgpd(APIView):
    #   def get_serializer_class
    def get_permissions(self):
        if self.request.method in ["PATCH", "DELETE"]:
          return [IsAuthenticated(),Postisowner()]
        return [IsAuthenticated()]
    def get_object(self,pk):
        return get_object_or_404(
            Postarticle.objects.prefetch_related("compost").prefetch_related("likes"),
            pk=pk
        )
    
    def get(self,request,pk=None):
        try:
            data=self.get_object(pk=pk)
            serializer=Postseriallizer(data)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Postarticle.DoesNotExist:
            return Response({"errors":"post does found"},status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self,request,pk=None):
        try:
            data=self.get_object(pk=pk)
            self.check_object_permissions(request,data)
            serializer=Postseriallizer(data,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                clear_cache_key()
                return Response(serializer.data,status=status.HTTP_200_OK)
        except Postarticle.DoesNotExist:
            return Response({"errors":"post does found"},status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self,request,pk=None):
        try:
            data=self.get_object(pk=pk)
            self.check_object_permissions(request,data)
            data.delete()
            clear_cache_key()
            return Response({"message":f"this item is deleted successsfully"},status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({"error":f"this item getting error in deleting"},status=status.HTTP_400_BAD_REQUEST)
        

    
        
class Articlehai(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        try:
           data=Postarticle.objects.prefetch_related("compost").prefetch_related("likes").filter(user=request.user)
           serializer=Postseriallizer(data,many=True)
           if data is not None:
               return Response(serializer.data,status=status.HTTP_200_OK)
                 
        except Postarticle.DoesNotExist:
            return Response({"error":"article not found for you"},status=status.HTTP_400_BAD_REQUEST)
        
    def post(self,request):
        serializer=Postseriallizer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            clear_cache_key()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

#like picture
class LikePostview(viewsets.ModelViewSet):
    queryset=LikePost.objects.all()
    serializer_class=Likeseriallizer
    permission_classes=[IsAuthenticated]
     
    # def perform_create(self, serializer):
    #     serializer.save(post=self.kwargs["post"],user=self.request.user)
    def create(self, request, *args, **kwargs):
        post_id =self.kwargs["post"]
        user=request.user

        like=LikePost.objects.filter(
           Q(post_id=post_id) &
            Q(user=user)
        )

        if like.exists():
            like.delete()
            return Response({
                "message":"dislike succussefully"
            },status=status.HTTP_200_OK)
        
        LikePost.objects.create(post_id=post_id,user=user)

        return Response({
            "message":"like successfully",

        },status=status.HTTP_201_CREATED)
   
   
class Commentview(viewsets.ModelViewSet):
    queryset=Comment.objects.all()
    serializer_class=Commentserializer
    # permission_classes=[IsAuthenticated,Commentpermission]
    
    def get_permissions(self):
        if self.action in ["list","retrieve"]:
            permission_classes=[AllowAny]
        
        elif self.action in ["create"]:
            permission_classes=[IsAuthenticated]

        else:
            permission_classes=[IsAuthenticated,Commentpermission]

        return [permission() for permission in permission_classes]
    @action(detail=False,methods=["POST"])
    # (?P<post_id>\d+)/toggle
    def ccom(self,request):
        # post_id=request.data["post_id"]
        post_id=request.query_params.get("post_id")
        content =request.data["content"]
        # parent=request.data["parent"] | None
        # parent_id=request.data["parent"]
        parent_id=request.data.get("parent") #optional
        if not post_id or not content:
            return Response({"message":"post_id and content are required"},status=status.HTTP_400_BAD_REQUEST)
       
        post=get_object_or_404(Postarticle,pk=post_id)
        parent_comment=None  # write any name
        if parent_id:
           parent_comment =get_object_or_404(Comment,pk=parent_id)

        print(parent_comment,"kkkk")
        comment=Comment.objects.create(
                post=post,
                user=request.user,
                content=content,
                parent=parent_comment
            )

        serilizer=Commentserializer(comment)
        return Response(serilizer.data,status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        post_id=request.query_params.get("post_id")
        parent_id =request.query_params.get("parent")

        queryset = self.queryset.filter(post_id=post_id)
        if not parent_id:
           queryset.filter(parent__isnull=True)
        else:
            queryset.filter(parent_id=parent_id)
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
   
        


###
#post list view
@method_decorator(vary_on_headers("Authorization"),name="list")
@method_decorator(cache_page(60*5),name="list")
class Articlelist(viewsets.ModelViewSet):

    queryset=Postarticle.objects.all()
    serializer_class=Postseriallizer
    permission_classes=[Commentpermission]

    def get_cache_key(self,request):
        user_id =request.user.id if request.user.is_authenticated else None
        page=request.query_params.get("page",1)
        return f"user_{user_id}_page{page}"
    
    def list(self, request, *args, **kwargs):
       cache_key=self.get_cache_key(request)

       data=cache.get(cache_key)
       if data:
           return Response(data)
       
       response =super.list(request,*args,**kwargs)

       cache.set(cache_key,response.data,timeout=300)
       return response
    
###
#image and video handling
MAX_VIDEO_SIZE = 50 * 1024 * 1024
class ImageHandling(APIView):
    def post(self, request,post_id=None):
        file = request.FILES.get("file")
        # post_id = request.data.get("post_id")  # OPTIONAL

        if not file:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        content_type = file.content_type

        if content_type.startswith("image/"):
            media_type = "image"
            folder = "images"

        elif content_type.startswith("video/"):
            media_type = "video"
            folder = "videos"

            if file.size > MAX_VIDEO_SIZE:
                return Response(
                    {"error": "Video must be less than 50MB"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(
                {"error": "Unsupported file type"},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_url = upload_file_to_supabase(file, folder)

        media = Mediahandle.objects.create(
            file_url=file_url,
            media_type=media_type,
            post_id=post_id if post_id else None
        )

        return Response(
            {
                "media_id": media.id,
                "file_url": media.file_url,
                "media_type": media.media_type,
                "attached_to_post": bool(post_id)
            },
            status=status.HTTP_201_CREATED
        )

    # def get(self,request,post_id=None):


    

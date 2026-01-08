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
from django.http import Http404
# from .tasks import send_verification_email
from rest_framework import viewsets
from django.db.models import Q,Count
from rest_framework.decorators import action

from django.http import HttpResponse
from django.core.cache import cache
from django_redis import get_redis_connection
from rest_framework.pagination import PageNumberPagination
from rest_framework.throttling import UserRateThrottle,SimpleRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .filters import PostarticleFilter
User = get_user_model()

def home(request):
    return HttpResponse("ho gaya")
def dashboard(request):
    return HttpResponse(" <h1> Admin Dashboard </h1> ")

class Burstscopethrottle(SimpleRateThrottle):
    scope='burst'
    # ident in throtaling
    def get_cache_key(self, request, view):
       if request.user.is_authenticated:
           ident=request.user.id
       else:
           ident=self.get_ident(request)

       return self.cache_format %{
           'scope':self.scope,
           'ident':ident
       }

class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'
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
    keys =redis.keys("user_*_cat_*_search_*_page_*")
    if keys:
        redis.delete(*keys)


class Postgpd(APIView):

    def get_permissions(self):
        if self.request.method in ["PATCH", "DELETE"]:
            return [IsAuthenticated(), Postisowner()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        return get_object_or_404(
            Postarticle.objects
            .prefetch_related("compost", "likes"),
            pk=pk
        )

    def get(self, request, pk=None):
        try:
            post = self.get_object(pk)
            serializer = Postseriallizer(instance=post)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            return Response(
                {"error": "Post not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, pk=None):
        try:
            post = self.get_object(pk)
            self.check_object_permissions(request, post)

            serializer = Postseriallizer(
                instance=post,
                data=request.data,
                partial=True
            )

            if serializer.is_valid():
                serializer.save()
                clear_cache_key()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Http404:
            return Response(
                {"error": "Post not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, pk=None):
        try:
            post = self.get_object(pk)
            self.check_object_permissions(request, post)
            post.delete()
            clear_cache_key()
            return Response(
                {"message": "Item deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Http404:
            return Response(
                {"error": "Post not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
   

    
        
class Articlehai(APIView):
    permission_classes=[IsAuthenticated]

    def get_throttles(self):
        if self.request.method == "POST":
            return [SustainedRateThrottle(),Burstscopethrottle()]
        return []
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
    serializer_class = Likeseriallizer
    permission_classes = [IsAuthenticated]

   
        
    
    @action(detail=False, methods=["GET"])
    def glike(self, request):
        post_id = request.query_params.get("post")

        if not post_id:
            return Response(
                {"error": "post query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        liked = self.queryset.filter(
            post_id=post_id,
            user=request.user
        ).exists()

        return Response(
            {"liked": liked},
            status=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        post_id = request.query_params.get("post")
        user = request.user

        like = self.queryset.filter(post_id=post_id, user=user)

        if like.exists():
            like.delete()
            return Response(
                {"message": "dislike successfully"},
                status=status.HTTP_200_OK
            )

        self.queryset.create(post_id=post_id, user=user)
        return Response(
            {"message": "like successfully"},
            status=status.HTTP_201_CREATED
        )

   
class Commentpagination(PageNumberPagination):
    page_size=2
    page_query_param="page" 
    max_page_size=30
    # def get_paginated_response(self, data):
    #     return Response({
    #         "count": self.page.paginator.count,
    #         "next": self.get_next_link(),
    #         "previous": self.get_previous_link(),
    #         "results": data,
    #     })

class Commentview(viewsets.ModelViewSet):
    queryset=Comment.objects.all()
    serializer_class=Commentserializer
    pagination_class=Commentpagination
    # permission_classes=[IsAuthenticated,Commentpermission]
    
    def get_permissions(self):
        if self.action in ["list","retrieve"]:
            permission_classes=[AllowAny]
        
        elif self.action in ["create"]:
            permission_classes=[IsAuthenticated]

        else:
            permission_classes=[IsAuthenticated,Commentpermission]

        return [permission() for permission in permission_classes]
    @action(detail=False,methods=["POST"],throttle_classes=[Burstscopethrottle,SustainedRateThrottle])
    # (?P<post_id>\d+)/toggle
    def ccom(self,request):
        # post_id=request.data["post_id"]
        post_id=request.query_params.get("post_id")
        content =request.data["content"]
        # parent=request.data["parent"] | None
        # parent_id=request.data["parent"]
        parent_id=request.query_params.get("parent") #optional
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
           queryset=queryset.filter(parent__isnull=True)
        else:
           queryset=queryset.filter(parent_id=parent_id)

        queryset = queryset.annotate(
        replies_count=Count("replies")
        )

        page = self.paginate_queryset(queryset)  #this will return current model instace in array form
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
   
        
    #   def paginate_queryset(self, queryset, request, view=None):
    # page_size = self.get_page_size(request)
    # if not page_size:
    #     return None

    # paginator = Paginator(queryset, page_size)
    # page_number = self.get_page_number(request, paginator)

    # try:
    #     self.page = paginator.page(page_number)
    # except InvalidPage:
    #     raise NotFound("Invalid page")

    # self.request = request
    # return list(self.page)
    def destroy(self, request, *args, **kwargs):
        post_id = request.query_params.get("post_id")
        Comment.objects.filter(post_id=post_id).delete()
        return Response(status=204)

###
#post list view
# @method_decorator(vary_on_headers("Authorization"),name="list")
@method_decorator(cache_page(60*5),name="list")
class Articlelist(viewsets.ModelViewSet):

    queryset=Postarticle.objects.all()
    serializer_class=Postseriallizer
    permission_classes=[Commentpermission]
    filter_backends = [DjangoFilterBackend,filters.SearchFilter]
    # filterset_fields = ['category']
    filterset_class=PostarticleFilter
    search_fields = ['title','description']
    # search_fields = ['=name']  # Exact match

    def get_cache_key(self,request):
        user_id =request.user.id if request.user.is_authenticated else None
        page=request.query_params.get("page",1)
        category = request.query_params.get("category", "")
        search = request.query_params.get("search", "").strip().lower()

        return f"user_{user_id}_cat_{category}_search_{search}_page_{page}"
    
    def list(self, request, *args, **kwargs):
       cache_key=self.get_cache_key(request)

       data=cache.get(cache_key)
       if data:
           print("redis hai kya bhe")
           return Response(data)
       
       response =super().list(request,*args,**kwargs)

       cache.set(cache_key,response.data,timeout=300)
       return response
    
###
#image and video handling

from django.db import transaction

MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50 MB
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
from rest_framework.parsers import MultiPartParser, FormParser
from bl.utils.storage import upload_file_to_supabase
class ImageHandling(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, post_id=None):
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        content_type = file.content_type or ""

        # Determine media type
        if content_type.startswith("image/"):
            media_type = "image"
            folder = "images"
        elif content_type.startswith("video/"):
            media_type = "video"
            folder = "videos"
        else:
            return Response(
                {"error": "Unsupported file type"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            #  Upload directly
            file_url = upload_file_to_supabase(file, folder)

            #  Save immediately in DB
            media = Mediahandle.objects.create(
                file_url=file_url,
                media_type=media_type,
                post_id=post_id
            )

            return Response(
                {
                    "media_id": media.id,
                    "file_url": file_url,
                    "media_type": media_type
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

   
       

           
    # def get(self,request,post_id=None):


class CommentDeleteByPost(APIView):
    def delete(self, request):
        post_id = request.query_params.get("post_id")

        if not post_id:
            return Response({"error": "post_id required"}, status=400)

        Comment.objects.filter(post_id=post_id).delete()
        return Response(status=204)  

# from celery.result import AsyncResult

# class TaskStatus(APIView):
#     def get(self, request, task_id):
#         result = AsyncResult(task_id)
#         return Response({
#             "state": result.state,
#             "result": result.result if result.ready() else None
#         })

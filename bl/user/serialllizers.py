from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile,Comment,Postarticle,LikePost,Mediahandle
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  # hash password
        user.save()
        return user
    


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        # email = attrs.get("email")
        # password = attrs.get("password")

        # user = authenticate(email=email, password=password)
        data = super().validate(attrs)
        user=self.user
        if not user:
            raise serializers.ValidationError(
                {"detail": "Invalid email or password"}
               )
        if user and not user.is_active:
            raise AuthenticationFailed("Please verify your email first")

        

        data["user"] = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
        }
        return data  

#profile seriallizer
class Profileseriallizer(serializers.ModelSerializer):
    
    class Meta:
        model=Profile
        fields = [
            "id",
            "display_name",
            "bio",
            "profile_image",
            "website",
            "location",
            "twitter",
            "linkedin",
            "github",
            "slug",
            "created_at",
            "updated_at",
            'user'
        ]
        # read_only_fields = ["slug", "created_at", "updated_at"]
        extra_kwargs = {
            "user": {"read_only": True},
            "slug": {"read_only": True},
            "profile_image": {"required": False},
            "website": {"required": False, "allow_blank": True},
            "twitter": {"required": False},
            "linkedin": {"required": False},
            "github": {"required": False},
        }


#post article
class Postseriallizer(serializers.ModelSerializer):
    compost=serializers.PrimaryKeyRelatedField(many=True,read_only=True)
    media=serializers.PrimaryKeyRelatedField(many=True,read_only=True)
    class Meta:
        model=Postarticle
        fields=['id','user','title','description','category','link1','link2','created_at','like_count','compost','media']
        read_only_fields=['id','user','created_at']

#comments seriallizer
class Recursivecommentserializer(serializers.Serializer):

    def to_representation(self,instance):
        serializer =Commentserializer(instance,context=self.context)
        return serializer.data
class Commentserializer(serializers.ModelSerializer):
    replies_count = serializers.IntegerField(source="replies.count", read_only=True)
    replies=Recursivecommentserializer(many=True,read_only=True)
    user=serializers.StringRelatedField()

    class Meta:
        model=Comment
        fields=['id','user','content','post','replies','created_at','replies_count']

#like seriallizer
class Likeseriallizer(serializers.ModelSerializer):

    class Meta:
        field=['id','user','post']
        read_only_fields=['id']

# class Imageandvideoserializer(serializers.ModelSerializer):
#     class Meta:
#         model=Mediahandle
#         field=['image','video']
       
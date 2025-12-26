
from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Customuser(AbstractUser):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
   
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    class Meta:
        ordering = ['-created_at']
        verbose_name = "user"
        verbose_name_plural = "users"





class Profile(models.Model):
    user = models.OneToOneField(
        Customuser,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    # Core identity
    display_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.URLField(
        
        blank=True
    )

    # Blogging / author info
    website = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(unique=True, blank=True)

    # Social links
    twitter = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)

    # Stats (optional but useful)
    total_posts = models.PositiveIntegerField(default=0)
    total_views = models.PositiveIntegerField(default=0)

    # Meta
    is_author = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = self.display_name or self.user.username
            self.slug = slugify(base)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.display_name or self.user.username
    
class Category(models.TextChoices):
    NEWS = "news", "News"
    EDUCATION = "edu", "Education"
    SPORTS = "sports", "Sports"
    TECHNOLOGY = "tech", "Technology"
    BUSINESS = "business", "Business"
    HEALTH = "health", "Health"
    ENTERTAINMENT = "entertainment", "Entertainment"
    POLITICS = "politics", "Politics"
    TRAVEL = "travel", "Travel"
    FOOD = "food", "Food"
    LIFESTYLE = "lifestyle", "Lifestyle"

class Postarticle(models.Model):
    user=models.ForeignKey(Customuser,on_delete=models.CASCADE,related_name="postarticle")
   
    title=models.CharField(max_length=100,default="")
    category=models.CharField(max_length=100,choices=Category.choices,default=Category.NEWS)
    description=models.TextField()
    link1=models.URLField(blank=True)
    link2=models.URLField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    
    @property

    def like_count(self):
        # return self.likepost_set.count()
        return self.likes.count()

    def __str__(self):
        return self.title

class Mediahandle(models.Model):
   
    MEDIA_TYPE_CHOICES = (
        ("image", "Image"),
        ("video", "Video"),
    )

    file_url = models.URLField()
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # Optional – later attach
    post = models.ForeignKey(
        "Postarticle",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="media"
    )
class LikePost(models.Model):
    post=models.ForeignKey(Postarticle,on_delete=models.CASCADE,related_name="likes")
    user=models.ForeignKey(Customuser,on_delete=models.CASCADE,related_name="userlike")
    
  
    class Meta:
        unique_together = ("post", "user")  # prevents duplicate likes
    def __str__(self):
        return self.post.title
    
    

class Comment(models.Model):
    post=models.ForeignKey(Postarticle,on_delete=models.CASCADE,related_name="compost")
    user=models.ForeignKey(Customuser,on_delete=models.CASCADE,related_name="comlike")
    parent=models.ForeignKey("self", null=True,
    blank=True,on_delete=models.CASCADE,related_name="replies") #this is for nested comments
    content=models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.post.title
    
    



    



    
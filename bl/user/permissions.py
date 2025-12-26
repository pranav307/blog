from rest_framework.permissions import BasePermission,SAFE_METHODS



class Postisowner(BasePermission):
    message = "You are not allowed to modify this post."

    def has_object_permission(self, request, view, obj):
        return obj.user==request.user
    

class Commentpermission(BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        
        return obj.user ==request.user
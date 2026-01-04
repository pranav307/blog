from django_filters import rest_framework as filters
from .models import Postarticle

class PostarticleFilter(filters.FilterSet):
    category = filters.CharFilter(field_name='category', lookup_expr='exact')

    class Meta:
        model = Postarticle
        fields = ['category']

# from rest_framework.filters import BaseFilterBackend

# class OwnerFilterBackend(BaseFilterBackend):
#     def filter_queryset(self, request, queryset, view):
#         owner_id = request.query_params.get('owner_id')
#         if owner_id:
#             return queryset.filter(owner_id=owner_id)
#         return queryset
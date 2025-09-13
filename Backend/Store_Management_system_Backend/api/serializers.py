from rest_framework import serializers
from .models import Product, Category, Sale, Transaction


class CategorySerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    category_name = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    location = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)

    def validate_category_name(self, value):
        if Category.objects(category_name=value).first():
            raise serializers.ValidationError("Category with this name already exists")
        return value

    def create(self, validated_data):
        category = Category(**validated_data)
        category.save()
        return category


class ProductSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    product_name = serializers.CharField(max_length=255)
    price = serializers.DecimalField(max_digits=18, decimal_places=2)
    quantity_in_stock = serializers.IntegerField(required=False)
    category = serializers.CharField(required=False, allow_null=True)
    last_updated = serializers.DateTimeField(required=False)
    location = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)


class SaleSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    employee = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    sale_date = serializers.DateTimeField(required=False)


class TransactionSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    sale = serializers.CharField()
    product = serializers.CharField()
    quantity_sold = serializers.IntegerField()
    price_at_sale = serializers.DecimalField(max_digits=18, decimal_places=2)

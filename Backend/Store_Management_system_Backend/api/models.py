from mongoengine import Document, StringField, DecimalField, IntField, ReferenceField, DateTimeField
import datetime


class Category(Document):
    category_name = StringField(required=True, unique=True, max_length=100)
    description = StringField()
    location = StringField(max_length=100)

    def __str__(self):
        return self.category_name


class Product(Document):
    product_name = StringField(required=True, max_length=255)
    price = DecimalField(precision=2, required=True)
    quantity_in_stock = IntField(default=0)
    category = ReferenceField(Category, reverse_delete_rule=2)  # CASCADE
    last_updated = DateTimeField(default=datetime.datetime.utcnow)
    location = StringField(max_length=100)

    def __str__(self):
        return self.product_name


class Sale(Document):
    employee = StringField(required=True)
    total_amount = DecimalField(precision=2, required=True)
    sale_date = DateTimeField(default=datetime.datetime.utcnow)

class Transaction(Document):
    sale = ReferenceField(Sale, reverse_delete_rule=2)  # CASCADE
    product = ReferenceField(Product, reverse_delete_rule=2)
    quantity_sold = IntField(required=True)
    price_at_sale = DecimalField(precision=2, required=True)    
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container, Title, Text, Button, Group, Stack, Card, SimpleGrid, Badge, Rating, TextInput, NumberInput } from '@mantine/core';
import Link from 'next/link';
import { API_URL } from '../../../services/api';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products/${productId}`);
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: parseInt(productId), quantity }),
      });

      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      await fetch(`${API_URL}/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: parseInt(productId) }),
      });

      alert('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  if (loading) {
    return <Container size="xl" py="xl"><Text>Loading...</Text></Container>;
  }

  if (!product) {
    return <Container size="xl" py="xl"><Text>Product not found</Text></Container>;
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Button variant="subtle" component={Link} href="/products">← Back to Products</Button>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <Card withBorder p="xl" mb="md">
            {product.images && product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage].image_url}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <Text c="dimmed">No Image</Text>
              </div>
            )}
          </Card>
          {product.images && product.images.length > 1 && (
            <SimpleGrid cols={4} spacing="sm">
              {product.images.map((image: any, index: number) => (
                <Card
                  key={index}
                  withBorder
                  p="xs"
                  style={{ cursor: 'pointer', opacity: selectedImage === index ? 1 : 0.6 }}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image.image_url} alt={product.name} className="w-full h-20 object-cover" />
                </Card>
              ))}
            </SimpleGrid>
          )}
        </div>

        {/* Product Details */}
        <Stack>
          <Title order={1}>{product.name}</Title>
          <Group>
            <Rating value={product.average_rating || 0} fractions={2} readOnly />
            <Text size="sm" c="dimmed">({product.reviews?.length || 0} reviews)</Text>
          </Group>

          <Group>
            {product.discount_price ? (
              <>
                <Text size="xl" fw={700} c="red">${product.discount_price}</Text>
                <Text size="lg" td="line-through" c="dimmed">${product.price}</Text>
                <Badge color="red">Sale</Badge>
              </>
            ) : (
              <Text size="xl" fw={700}>${product.price}</Text>
            )}
          </Group>

          <Text c={product.stock > 0 ? 'green' : 'red'} fw={500}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </Text>

          <Text>{product.description}</Text>

          {product.frame_type && (
            <Group>
              <Text fw={500}>Frame Type:</Text>
              <Text>{product.frame_type}</Text>
            </Group>
          )}

          {product.size && (
            <Group>
              <Text fw={500}>Size:</Text>
              <Text>{product.size}</Text>
            </Group>
          )}

          {product.color && (
            <Group>
              <Text fw={500}>Color:</Text>
              <Text>{product.color}</Text>
            </Group>
          )}

          <Group>
            <NumberInput
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(val) => setQuantity(Number(val))}
              w={100}
            />
            <Button size="lg" onClick={addToCart} disabled={product.stock === 0}>
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" onClick={addToWishlist}>
              ♡ Wishlist
            </Button>
          </Group>
        </Stack>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <Title order={2} mb="xl">Customer Reviews</Title>
        {product.reviews && product.reviews.length > 0 ? (
          <Stack>
            {product.reviews.map((review: any) => (
              <Card key={review.id} withBorder p="md">
                <Group justify="space-between">
                  <Text fw={500}>{review.user_name}</Text>
                  <Rating value={review.rating} readOnly />
                </Group>
                <Text mt="sm">{review.comment}</Text>
              </Card>
            ))}
          </Stack>
        ) : (
          <Text c="dimmed">No reviews yet</Text>
        )}
      </div>
    </Container>
  );
}

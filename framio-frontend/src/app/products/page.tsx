'use client';

import { useState, useEffect } from 'react';
import { Container, Title, TextInput, Select, RangeSlider, Button, SimpleGrid, Card, Text, Group, Badge, Stack, Pagination } from '@mantine/core';
import Link from 'next/link';
import { API_URL } from '../../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('created_at');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [search, category, priceRange, sortBy, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category_id', category);
      params.append('min_price', priceRange[0].toString());
      params.append('max_price', priceRange[1].toString());
      params.append('sort', sortBy);
      params.append('limit', '12');

      const response = await fetch(`${API_URL}/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Our Products</Title>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <Stack>
            <TextInput
              label="Search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              label="Category"
              placeholder="Select category"
              data={[
                { value: '1', label: 'Photo Frames' },
                { value: '2', label: 'Art Frames' },
                { value: '3', label: 'Wall Décor' },
                { value: '4', label: 'Mirror Frames' },
              ]}
              value={category}
              onChange={setCategory}
              clearable
            />

            <div>
              <Text size="sm" fw={500} mb="xs">Price Range</Text>
              <RangeSlider
                min={0}
                max={1000}
                value={priceRange}
                onChange={setPriceRange}
                marks={[
                  { value: 0, label: '$0' },
                  { value: 250, label: '$250' },
                  { value: 500, label: '$500' },
                  { value: 750, label: '$750' },
                  { value: 1000, label: '$1000' },
                ]}
              />
              <Text size="xs" c="dimmed" mt="xs">
                ${priceRange[0]} - ${priceRange[1]}
              </Text>
            </div>

            <Select
              label="Sort By"
              placeholder="Sort by"
              data={[
                { value: 'created_at', label: 'Newest' },
                { value: 'price', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'name', label: 'Name' },
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value || 'created_at')}
            />

            <Button onClick={fetchProducts} fullWidth>
              Apply Filters
            </Button>
          </Stack>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <Text>Loading products...</Text>
          ) : products.length === 0 ? (
            <Text>No products found</Text>
          ) : (
            <>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                {products.map((product) => (
                  <Card key={product.id} shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0].image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Text c="dimmed">No Image</Text>
                        )}
                      </div>
                    </Card.Section>
                    <Group justify="space-between" mt="md">
                      <Text fw={500} lineClamp={1}>{product.name}</Text>
                      {product.discount_price && (
                        <Badge color="red">Sale</Badge>
                      )}
                    </Group>
                    <Text size="sm" c="dimmed" mt="xs">
                      {product.discount_price ? (
                        <>
                          <Text span c="red" fw={500}>${product.discount_price}</Text>
                          <Text span td="line-through" ml="xs">${product.price}</Text>
                        </>
                      ) : (
                        <Text fw={500}>${product.price}</Text>
                      )}
                    </Text>
                    <Button variant="light" color="blue" fullWidth mt="md" radius="md" component={Link} href={`/products/${product.id}`}>
                      View Details
                    </Button>
                  </Card>
                ))}
              </SimpleGrid>

              <div className="mt-8 flex justify-center">
                <Pagination total={10} value={page} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

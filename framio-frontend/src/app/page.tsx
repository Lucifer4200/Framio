'use client';

import Link from 'next/link';
import { Button, Container, Title, Text, SimpleGrid, Card, Image, Badge, Group } from '@mantine/core';

export default function HomePage() {
  return (
    <Container size="xl" py="xl">
      {/* Hero Section */}
      <div className="text-center py-20">
        <Title order={1} className="text-5xl font-bold mb-4">
          Framio - Premium Home Décor Frames
        </Title>
        <Text size="xl" className="text-gray-600 mb-8">
          Discover our collection of premium frames for your walls
        </Text>
        <Group justify="center">
          <Button size="lg" component={Link} href="/products">
            Shop Now
          </Button>
          <Button size="lg" variant="outline" component={Link} href="/categories">
            Browse Categories
          </Button>
        </Group>
      </div>

      {/* Featured Categories */}
      <div className="py-16">
        <Title order={2} className="text-3xl mb-8 text-center">
          Shop by Category
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
          {['Photo Frames', 'Art Frames', 'Wall Décor', 'Mirror Frames'].map((category) => (
            <Card key={category} shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Text c="dimmed">{category}</Text>
                </div>
              </Card.Section>
              <Group justify="space-between" mt="md">
                <Text fw={500}>{category}</Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </div>

      {/* Featured Products */}
      <div className="py-16">
        <Title order={2} className="text-3xl mb-8 text-center">
          Featured Products
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Text c="dimmed">Product Image</Text>
                </div>
              </Card.Section>
              <Group justify="space-between" mt="md">
                <Text fw={500}>Premium Frame {i}</Text>
                <Badge color="pink">New</Badge>
              </Group>
              <Text size="sm" c="dimmed" mt="xs">
                $99.99
              </Text>
              <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                View Details
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </div>

      {/* Newsletter */}
      <div className="py-16 bg-gray-100 rounded-lg text-center">
        <Title order={2} className="text-3xl mb-4">
          Subscribe to Our Newsletter
        </Title>
        <Text size="lg" className="text-gray-600 mb-8">
          Get updates on new arrivals and exclusive offers
        </Text>
        <Group justify="center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border rounded-lg w-80"
          />
          <Button size="md">Subscribe</Button>
        </Group>
      </div>
    </Container>
  );
}

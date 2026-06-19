'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  IconAdjustmentsHorizontal,
  IconArrowRight,
  IconChevronDown,
  IconMinus,
  IconPlus,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { API_URL } from '../../services/api';
import { formatCurrency } from '../../utils/format';

type ProductImage = {
  image_url: string;
  is_primary?: boolean;
};

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  discount_price?: number | string | null;
  frame_type?: string;
  size?: string;
  color?: string;
  category_name?: string;
  images?: ProductImage[];
};

type FilterSection = 'material' | 'size' | 'matting' | 'price';

const fallbackFrames = [
  {
    studio:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85',
    room:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85',
  },
  {
    studio:
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85',
    room:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85',
  },
  {
    studio:
      'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&w=900&q=85',
    room:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85',
  },
  {
    studio:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85',
    room:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=85',
  },
];

const materialOptions = [
  { label: 'Walnut', value: 'Walnut' },
  { label: 'Oak', value: 'Oak' },
  { label: 'Maple', value: 'Maple' },
  { label: 'Black Aluminum', value: 'Black Aluminum' },
];

const sizeOptions = ['8 x 10', '11 x 14', '16 x 20', '24 x 36'];
const mattingOptions = ['No mat', 'Warm white', 'Linen', 'Double mat'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [material, setMaterial] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [matting, setMatting] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('created_at');
  const [page, setPage] = useState(1);
  const [openSections, setOpenSections] = useState<Record<FilterSection, boolean>>({
    material: true,
    size: true,
    matting: true,
    price: true,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (material) params.append('frame_type', material);
        if (size) params.append('size', size);
        params.append('min_price', priceRange[0].toString());
        params.append('max_price', priceRange[1].toString());
        params.append('sort', sortBy);
        params.append('page', page.toString());
        params.append('limit', '12');

        const response = await fetch(`${API_URL}/products?${params.toString()}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, material, size, priceRange, sortBy, page]);

  const hasActiveFilters = Boolean(search || material || size || matting || priceRange[0] > 0 || priceRange[1] < 1000);

  const activeFilterLabel = useMemo(() => {
    const filters = [material, size, matting].filter(Boolean);
    return filters.length ? filters.join(' / ') : 'All custom frames';
  }, [material, size, matting]);

  const clearFilters = () => {
    setSearch('');
    setMaterial(null);
    setSize(null);
    setMatting(null);
    setPriceRange([0, 1000]);
    setPage(1);
  };

  const toggleSection = (section: FilterSection) => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] text-[#1a1a1a]">
      <section className="border-b border-[#ded8ce] px-5 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#7a7167]">
            <Link href="/" className="transition hover:text-[#9b6b43]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#1a1a1a]">Collection</span>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[12px] uppercase tracking-[0.32em] text-[#9b6b43]">
                Shop custom frames
              </p>
              <h1 className="mt-4 font-serif text-[clamp(3rem,7vw,6.2rem)] font-medium leading-[0.92]">
                The Framio Collection
              </h1>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#665e54] lg:text-right">
              Choose by material, scale, and matting style. Every piece is built for archival
              presentation with the calm restraint of a gallery wall.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[280px_1fr] lg:py-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-[#ded8ce] bg-[#fdfbf7]">
            <div className="flex items-center justify-between border-b border-[#ded8ce] p-5">
              <div className="flex items-center gap-3">
                <IconAdjustmentsHorizontal size={18} stroke={1.6} />
                <p className="text-sm uppercase tracking-[0.2em]">Filters</p>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-[#9b6b43] transition hover:text-[#1a1a1a]"
                >
                  <IconX size={14} stroke={1.6} />
                  Clear
                </button>
              )}
            </div>

            <div className="border-b border-[#ded8ce] p-5">
              <label htmlFor="product-search" className="mb-3 block text-xs uppercase tracking-[0.2em] text-[#766d62]">
                Search
              </label>
              <div className="flex h-11 items-center gap-3 border border-[#ded8ce] px-3 focus-within:border-[#9b6b43]">
                <IconSearch size={17} stroke={1.6} className="text-[#9b6b43]" />
                <input
                  id="product-search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Frame name"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a99f94]"
                />
              </div>
            </div>

            <FilterGroup
              title="Material"
              open={openSections.material}
              onToggle={() => toggleSection('material')}
            >
              <OptionList
                options={materialOptions.map((option) => option.label)}
                value={material}
                onChange={(value) => {
                  setMaterial(value);
                  setPage(1);
                }}
              />
            </FilterGroup>

            <FilterGroup title="Size" open={openSections.size} onToggle={() => toggleSection('size')}>
              <OptionList
                options={sizeOptions}
                value={size}
                onChange={(value) => {
                  setSize(value);
                  setPage(1);
                }}
              />
            </FilterGroup>

            <FilterGroup
              title="Matting"
              open={openSections.matting}
              onToggle={() => toggleSection('matting')}
            >
              <OptionList options={mattingOptions} value={matting} onChange={setMatting} />
            </FilterGroup>

            <FilterGroup
              title="Price"
              open={openSections.price}
              onToggle={() => toggleSection('price')}
              last
            >
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="Min"
                    value={priceRange[0]}
                    onChange={(value) => {
                      setPriceRange(([_, max]) => [Math.min(value, max), max]);
                      setPage(1);
                    }}
                  />
                  <NumberField
                    label="Max"
                    value={priceRange[1]}
                    onChange={(value) => {
                      setPriceRange(([min]) => [min, Math.max(value, min)]);
                      setPage(1);
                    }}
                  />
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#766d62]">
                  ${priceRange[0]} - ${priceRange[1]}
                </p>
              </div>
            </FilterGroup>
          </div>
        </aside>

        <div>
          <div className="mb-8 flex flex-col gap-5 border-b border-[#ded8ce] pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#9b6b43]">{activeFilterLabel}</p>
              <p className="mt-2 text-sm text-[#766d62]">
                {loading ? 'Curating frames...' : `${products.length} pieces shown`}
              </p>
            </div>

            <label className="flex w-full items-center justify-between gap-4 border border-[#ded8ce] px-4 py-3 md:w-[260px]">
              <span className="text-xs uppercase tracking-[0.2em] text-[#766d62]">Sort By</span>
              <span className="relative flex flex-1 items-center">
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none bg-transparent pr-7 text-right text-sm outline-none"
                >
                  <option value="created_at">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
                <IconChevronDown className="pointer-events-none absolute right-0 text-[#9b6b43]" size={16} stroke={1.6} />
              </span>
            </label>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] bg-[#eee8df]" />
                  <div className="mt-5 h-4 w-2/3 bg-[#eee8df]" />
                  <div className="mt-3 h-3 w-24 bg-[#eee8df]" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center border border-[#ded8ce] px-6 text-center">
              <p className="font-serif text-4xl">No frames found</p>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#665e54]">
                Try widening your material, size, or price selections to reveal more of the
                collection.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-8 inline-flex h-11 items-center gap-3 border border-[#1a1a1a] px-5 text-xs uppercase tracking-[0.18em] transition hover:border-[#9b6b43] hover:bg-[#9b6b43] hover:text-white"
              >
                Reset filters
                <IconArrowRight size={15} stroke={1.6} />
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              <div className="mt-14 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="h-11 border border-[#ded8ce] px-5 text-xs uppercase tracking-[0.18em] text-[#665e54] transition hover:border-[#9b6b43] hover:text-[#9b6b43] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="flex h-11 min-w-11 items-center justify-center border border-[#1a1a1a] px-4 text-sm">
                  {page}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  className="h-11 border border-[#ded8ce] px-5 text-xs uppercase tracking-[0.18em] text-[#665e54] transition hover:border-[#9b6b43] hover:text-[#9b6b43]"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const fallback = fallbackFrames[index % fallbackFrames.length];
  const primaryImage = product.images?.find((image) => image.is_primary)?.image_url || product.images?.[0]?.image_url || fallback.studio;
  const secondaryImage = product.images?.[1]?.image_url || fallback.room;
  const salePrice = product.discount_price ? Number(product.discount_price) : null;

  return (
    <article className="group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#eee8df]">
          <img
            src={primaryImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] group-hover:opacity-0"
          />
          <img
            src={secondaryImage}
            alt={`${product.name} in an interior setting`}
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100"
          />
          {salePrice && (
            <span className="absolute left-4 top-4 bg-[#fdfbf7] px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[#9b6b43]">
              Sale
            </span>
          )}
        </div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-5">
        <div className="min-w-0">
          <Link
            href={`/products/${product.id}`}
            className="block truncate text-[15px] font-medium uppercase tracking-[0.16em] transition hover:text-[#9b6b43]"
          >
            {product.name}
          </Link>
          <p className="mt-2 line-clamp-1 text-sm text-[#766d62]">
            {product.frame_type || product.category_name || 'Custom archival frame'}
          </p>
        </div>
        <div className="shrink-0 text-right text-sm">
          {salePrice ? (
            <>
              <p className="text-[#9b6b43]">${formatCurrency(salePrice)}</p>
              <p className="mt-1 text-[#9d9489] line-through">${formatCurrency(product.price)}</p>
            </>
          ) : (
            <p>${formatCurrency(product.price)}</p>
          )}
        </div>
      </div>
    </article>
  );
}

function FilterGroup({
  title,
  open,
  onToggle,
  children,
  last = false,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? '' : 'border-b border-[#ded8ce]'}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left text-xs uppercase tracking-[0.22em]"
        aria-expanded={open}
      >
        {title}
        {open ? <IconMinus size={15} stroke={1.6} /> : <IconPlus size={15} stroke={1.6} />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function OptionList({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center justify-between gap-4 text-sm text-[#665e54]">
          <span>{option}</span>
          <input
            type="radio"
            name={options.join('-')}
            checked={value === option}
            onChange={() => onChange(value === option ? null : option)}
            className="h-4 w-4 accent-[#9b6b43]"
          />
        </label>
      ))}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[#766d62]">{label}</span>
      <input
        type="number"
        min={0}
        max={1000}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="h-10 w-full border border-[#ded8ce] bg-transparent px-3 text-sm outline-none focus:border-[#9b6b43]"
      />
    </label>
  );
}

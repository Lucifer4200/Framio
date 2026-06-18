'use client';

import Link from 'next/link';
import {
  IconHeart,
  IconSearch,
  IconShoppingBag,
  IconArrowRight,
  IconMenu2,
  IconStarFilled,
} from '@tabler/icons-react';

const collections = [
  {
    title: 'Classic Wood',
    price: 'From $84',
    image:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Modern Metal',
    price: 'From $98',
    image:
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Floating Frames',
    price: 'From $112',
    image:
      'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Shadowboxes',
    price: 'From $126',
    image:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80',
  },
];

const products = [
  {
    name: 'Oak Gallery Frame',
    finish: 'Natural oak, archival mat',
    price: '$118',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Slim Brass Profile',
    finish: 'Brushed metal, museum glass',
    price: '$136',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Blackline Shadowbox',
    finish: 'Deep profile, linen backing',
    price: '$152',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
  },
];

const press = ['Galerie', 'Maison', 'Forma', 'Canvas', 'Atelier'];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] text-[#1a1a1a]">
      <header className="sticky top-0 z-30 border-b border-[#ded8ce] bg-[#fdfbf7]/95 backdrop-blur">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-serif text-3xl font-semibold tracking-normal">
            Framio
          </Link>

          <div className="hidden items-center gap-10 text-[13px] uppercase tracking-[0.22em] text-[#4d4740] lg:flex">
            <Link href="/products" className="transition hover:text-[#9b6b43]">
              Collection
            </Link>
            <Link href="/products" className="transition hover:text-[#9b6b43]">
              Build a Frame
            </Link>
            <Link href="/" className="transition hover:text-[#9b6b43]">
              Stories
            </Link>
            <Link href="/" className="transition hover:text-[#9b6b43]">
              About
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <IconButton label="Search">
              <IconSearch size={18} stroke={1.6} />
            </IconButton>
            <IconButton label="Wishlist" className="hidden sm:inline-flex">
              <IconHeart size={18} stroke={1.6} />
            </IconButton>
            <Link
              href="/cart"
              aria-label="Cart"
              className="inline-flex h-10 w-10 items-center justify-center border border-[#1a1a1a] transition hover:border-[#9b6b43] hover:text-[#9b6b43]"
            >
              <IconShoppingBag size={18} stroke={1.6} />
            </Link>
            <IconButton label="Menu" className="lg:hidden">
              <IconMenu2 size={19} stroke={1.6} />
            </IconButton>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-12">
        <div className="max-w-2xl">
          <p className="mb-6 text-[12px] uppercase tracking-[0.32em] text-[#9b6b43]">
            Custom archival framing
          </p>
          <h1 className="font-serif text-[clamp(3.4rem,8vw,7.6rem)] font-medium leading-[0.9] tracking-normal">
            Frames Crafted for Eternal Memories
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#5e564c]">
            Museum-grade frames, hand-finished profiles, and warm materials selected to make
            photographs, prints, and objects feel quietly permanent.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="inline-flex h-12 items-center gap-3 border border-[#1a1a1a] px-6 text-sm uppercase tracking-[0.18em] transition hover:border-[#9b6b43] hover:bg-[#9b6b43] hover:text-white"
            >
              Shop Collection
              <IconArrowRight size={16} stroke={1.6} />
            </Link>
            <Link
              href="/products"
              className="inline-flex h-12 items-center border-b border-[#1a1a1a] text-sm uppercase tracking-[0.18em] transition hover:border-[#9b6b43] hover:text-[#9b6b43]"
            >
              Build a Frame
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden border border-[#ded8ce] bg-[#ebe5db] lg:min-h-[680px]">
          <img
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=85"
            alt="Oak frames arranged on a calm gallery wall"
            className="h-full min-h-[420px] w-full object-cover lg:min-h-[680px]"
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 border-t border-white/55 bg-[#fdfbf7]/88 p-5 backdrop-blur-sm">
            <div>
              <p className="font-serif text-2xl">Oak Gallery Set</p>
              <p className="mt-1 text-sm text-[#665e54]">Hand-finished wood, floating mat</p>
            </div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#9b6b43]">$118</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ded8ce]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link
              href="/products"
              key={collection.title}
              className="group border-b border-[#ded8ce] p-5 transition hover:bg-white sm:border-r lg:border-b-0"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#eee8df]">
                <img
                  src={collection.image}
                  alt={`${collection.title} frame collection`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <h2 className="font-serif text-3xl leading-none">{collection.title}</h2>
                <p className="shrink-0 text-sm text-[#766d62]">{collection.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#ded8ce] pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[12px] uppercase tracking-[0.32em] text-[#9b6b43]">
              New in the studio
            </p>
            <h2 className="mt-4 font-serif text-5xl font-medium leading-none lg:text-6xl">
              Gallery-ready pieces
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-[#1a1a1a] transition hover:text-[#9b6b43]"
          >
            View all frames
            <IconArrowRight size={16} stroke={1.6} />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.name} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-[#eee8df]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex justify-between gap-5">
                <div>
                  <h3 className="font-serif text-3xl leading-tight">{product.name}</h3>
                  <p className="mt-1 text-sm text-[#766d62]">{product.finish}</p>
                </div>
                <p className="pt-2 text-sm text-[#9b6b43]">{product.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#1a1a1a] px-5 py-20 text-[#fdfbf7] sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-[12px] uppercase tracking-[0.32em] text-[#c99669]">
              Collector notes
            </p>
            <div className="mt-8 flex gap-1 text-[#c99669]" aria-label="Five star rating">
              {Array.from({ length: 5 }).map((_, index) => (
                <IconStarFilled key={index} size={18} />
              ))}
            </div>
          </div>
          <figure>
            <blockquote className="font-serif text-[clamp(2.4rem,5vw,5.2rem)] italic leading-[1.02]">
              "The frame felt like it belonged to the artwork from the beginning."
            </blockquote>
            <figcaption className="mt-8 text-sm uppercase tracking-[0.22em] text-[#c8bfb3]">
              Mina R. / Interior curator
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-[#ded8ce] px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 text-[#766d62]">
          {press.map((name) => (
            <p key={name} className="font-serif text-3xl italic">
              {name}
            </p>
          ))}
        </div>
      </section>

      <footer className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="font-serif text-4xl">Framio</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#665e54]">
            Premium single-vendor framing for photographs, prints, canvases, and heirloom objects.
          </p>
        </div>
        <div className="grid gap-8 text-sm sm:grid-cols-3">
          <FooterColumn title="Studio" items={['Collection', 'Build a Frame', 'Stories']} />
          <FooterColumn title="Service" items={['Shipping', 'Sizing guide', 'Returns']} />
          <FooterColumn title="Visit" items={['hello@framio.test', 'Dhaka atelier', 'Mon-Fri']} />
        </div>
      </footer>
    </main>
  );
}

function IconButton({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center border border-[#ded8ce] transition hover:border-[#9b6b43] hover:text-[#9b6b43] ${className}`}
    >
      {children}
    </button>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-4 text-[12px] uppercase tracking-[0.24em] text-[#9b6b43]">{title}</p>
      <div className="space-y-3 text-[#665e54]">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

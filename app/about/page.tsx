import Link from "next/link";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="mb-6 text-5xl font-bold">About Our Store</h1>
          <p className="mx-auto max-w-3xl text-lg text-blue-100">
            We're passionate about delivering high-quality products, exceptional
            customer experiences, and the latest trends right to your doorstep.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900">Our Story</h2>
            <p className="mb-4 text-gray-600">
              Founded with a simple mission — to make online shopping easy,
              affordable, and enjoyable for everyone.
            </p>
            <p className="mb-4 text-gray-600">
              From carefully selected products to fast delivery and excellent
              customer support, we focus on every detail to ensure a seamless
              shopping experience.
            </p>
            <p className="text-gray-600">
              Today, thousands of customers trust us for quality products and
              reliable service.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
              alt="Shopping Experience"
              className="h-80 w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div className="rounded-xl border p-8 shadow-sm">
              <h3 className="text-4xl font-bold text-blue-600">50K+</h3>
              <p className="mt-2 text-gray-600">Happy Customers</p>
            </div>

            <div className="rounded-xl border p-8 shadow-sm">
              <h3 className="text-4xl font-bold text-blue-600">10K+</h3>
              <p className="mt-2 text-gray-600">Products Sold</p>
            </div>

            <div className="rounded-xl border p-8 shadow-sm">
              <h3 className="text-4xl font-bold text-blue-600">100+</h3>
              <p className="mt-2 text-gray-600">Trusted Brands</p>
            </div>

            <div className="rounded-xl border p-8 shadow-sm">
              <h3 className="text-4xl font-bold text-blue-600">24/7</h3>
              <p className="mt-2 text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
          Why Choose Us?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 text-5xl">🚚</div>
            <h3 className="mb-3 text-2xl font-semibold">Fast Delivery</h3>
            <p className="text-gray-600">
              Quick and reliable shipping to ensure your products arrive on
              time.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 text-5xl">🔒</div>
            <h3 className="mb-3 text-2xl font-semibold">Secure Payments</h3>
            <p className="text-gray-600">
              Your transactions are protected with industry-standard security.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 text-5xl">⭐</div>
            <h3 className="mb-3 text-2xl font-semibold">Premium Quality</h3>
            <p className="text-gray-600">
              We carefully curate products to ensure the best quality and value.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-bold">Start Shopping Today</h2>

          <p className="mb-8 text-lg text-indigo-100">
            Explore our collection and discover products you'll love.
          </p>

          <button className="rounded-lg bg-white px-8 py-3 font-semibold text-indigo-700 transition hover:bg-gray-100">
            <Link href="/products">Shop Now</Link>
          </button>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

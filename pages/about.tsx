import Image from "next/image";
import Layout from "../components/Layout";

export default function About() {
  const teamMembers = [
    {
      name: "Hung Lai",
      role: "Founder & Creative Director",
      image: "/images/hung.jpg",
      bio: "Hung is the visionary behind HandcraftBK. With a passion for traditional craftsmanship, he travels the world to discover unique artisans and their stories.",
    },
    {
      name: "Lai Hung",
      role: "Artisan Relations",
      image: "/images/hung.jpg",
      bio: "Lai is dedicated to building strong relationships with our artisan partners. He ensures that their voices are heard and their needs are met, fostering a supportive community.",
    },
    {
      name: "The Hung",
      role: "Product Curator",
      image: "/images/hung.jpg",
      bio: "The Hung has an eye for detail and a love for unique designs. He curates our collection, ensuring that each piece reflects the artistry and culture of its origin.",
    },
  ];

  const values = [
    {
      title: "Artisan-Focused",
      description:
        "We prioritize the wellbeing and fair compensation of the artisans who create our products.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "Sustainable Practices",
      description:
        "We are committed to environmental responsibility in our sourcing, production, and shipping.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Cultural Preservation",
      description:
        "We honor and help preserve traditional crafting techniques and cultural heritage.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      ),
    },
    {
      title: "Quality Craftsmanship",
      description:
        "We believe in the value of handmade items and their superior quality compared to mass-produced alternatives.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];

  return (
    <Layout title="About Us">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/images/our-story-banner.avif"
            alt="About HandcraftBK"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-white font-heading text-4xl md:text-5xl font-bold mb-4">
              Our Story
            </h1>
            <p className="text-white text-lg">
              Connecting artisans and craft lovers since 2025
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-h1 mb-6">Our Mission</h2>
            <p className="text-lg mb-6 ">
              At HandcraftBK, we believe in the power of handmade. Our mission
              is to celebrate and promote the art of traditional craftsmanship
              by connecting skilled artisans with people who value their work.
            </p>
            <p className="text-lg">
              We strive to create a marketplace that supports sustainable
              practices, preserves cultural heritage, and ensures fair
              compensation for the creators behind each unique piece in our
              collection.
            </p>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-h1 mb-6">Our Journey</h2>
              <p className="mb-4 text-justify">
                HandcraftBK was established in 2025 by our founder, Hung Lai,
                who embarked on a journey through Vietnam. During his travels,
                his was mesmerized by the exquisite craftsmanship he discovered.
                Inspired by the beauty of these handmade items and mindful of
                the difficulties artisans faced in accessing global markets, he
                decided to create HandcraftBK.
              </p>
              <p className="mb-4 text-justify">
                What started as a small online shop featuring products from five
                artisans has grown into a curated marketplace representing over
                200 craftspeople from more than 30 countries.
              </p>
              <p className="text-justify">
                Today, we're proud to offer a diverse collection of handcrafted
                home goods that bring joy to our customers while supporting
                traditional crafting communities around the world.
              </p>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/images/our-journey.png"
                alt="Our journey"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-subtle">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-h1 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm flex"
              >
                <div className="mr-4 flex-shrink-0">{value.icon}</div>
                <div>
                  <h3 className="font-heading text-h3 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-h1 text-center mb-12">
            Meet my team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-h3 mb-1">{member.name}</h3>
                  <p className="text-accent mb-4">{member.role}</p>
                  <p className="text-gray-600 text-justify">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Partners */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-h1 mb-6">Our Artisan Partners</h2>
          <p className="text-lg mb-10 max-w-3xl mx-auto">
            We work with over 200 talented artisans from more than 30 countries.
            Each partner is carefully selected based on their craftsmanship,
            dedication to traditional techniques, and commitment to sustainable
            practices.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">30+</div>
              <p className="text-gray-600">Countries</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <p className="text-gray-600">Artisans</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <p className="text-gray-600">Products</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <p className="text-gray-600">Craft Techniques</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-h1 mb-6">Join Our Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to stay updated on new artisans,
            collections, and the stories behind our handcraft products.
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 flex-grow border border-subtle rounded-l focus:outline-none text-textDark"
              aria-label="Email address"
            />
            <button
              type="button"
              onClick={() => alert("Subscribed!")}
              className="bg-secondary text-primary px-6 py-3 rounded-r font-medium hover:bg-subtle mt-2 sm:mt-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

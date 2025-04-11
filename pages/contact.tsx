import { useState } from "react";
import Image from "next/image";
import Layout from "../components/Layout";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Mock form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: "Thank you for your message! We will get back to you soon.",
      });
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <Layout title="Contact Us">
      {/* Hero Section */}
      <section className="relative h-[300px]">
        <div className="absolute inset-0">
          <Image
            src="/images/contact-banner.jpg"
            alt="Contact HandcraftBK"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-white font-heading text-4xl md:text-5xl font-bold mb-2">
              Contact Us
            </h1>
            <p className="text-white text-lg">We'd love to hear from you</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
              <h2 className="font-heading text-h2 mb-6">Send Us a Message</h2>

              {formStatus.submitted && (
                <div
                  className={`p-4 mb-6 rounded ${
                    formStatus.success
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 font-medium" htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium" htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium" htmlFor="subject">
                    Subject
                  </label>
                  <div className="dropdown w-full">
                    <label
                      tabIndex={0}
                      className="flex justify-between items-center w-full px-3 py-3 border border-gray-300 rounded cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {formState.subject || "Please select"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow-md bg-white rounded-md w-full mt-1 z-[1]"
                    >
                      <li>
                        <button
                          onClick={() => {
                            setFormState((prev) => ({
                              ...prev,
                              subject: "Product Inquiry",
                            }));
                          }}
                          className="py-2 px-4 hover:bg-gray-100 text-left"
                        >
                          Product Inquiry
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setFormState((prev) => ({
                              ...prev,
                              subject: "Order Status",
                            }));
                          }}
                          className="py-2 px-4 hover:bg-gray-100 text-left"
                        >
                          Order Status
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setFormState((prev) => ({
                              ...prev,
                              subject: "Return or Exchange",
                            }));
                          }}
                          className="py-2 px-4 hover:bg-gray-100 text-left"
                        >
                          Return or Exchange
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setFormState((prev) => ({
                              ...prev,
                              subject: "Wholesale Inquiry",
                            }));
                          }}
                          className="py-2 px-4 hover:bg-gray-100 text-left"
                        >
                          Wholesale Inquiry
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setFormState((prev) => ({
                              ...prev,
                              subject: "Artisan Partnership",
                            }));
                          }}
                          className="py-2 px-4 hover:bg-gray-100 text-left"
                        >
                          Artisan Partnership
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setFormState((prev) => ({
                              ...prev,
                              subject: "Other",
                            }));
                          }}
                          className="py-2 px-4 hover:bg-gray-100 text-left"
                        >
                          Other
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium" htmlFor="message">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={5}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="font-heading text-h2 mb-6">Contact Information</h2>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <h3 className="font-heading text-h3">Visit Us</h3>
                  </div>
                  <p className="text-gray-600 ml-9">
                    1st Dai Co Viet Street
                    <br />
                    Hai Ba Trung District
                    <br />
                    Hanoi, Vietnam
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="font-heading text-h3">Email Us</h3>
                  </div>
                  <div className="ml-9">
                    <p className="text-gray-600 mb-1">
                      General Inquiries:{" "}
                      <a
                        href="mailto:chuquanpho29@gmail.com"
                        className="text-primary hover:underline"
                      >
                        chuquanpho29@gmail.com
                      </a>
                    </p>
                    <p className="text-gray-600 mb-1">
                      Customer Support:{" "}
                      <a
                        href="mailto:chuquanpho29@gmail.com"
                        className="text-primary hover:underline"
                      >
                        chuquanpho29@gmail.com
                      </a>
                    </p>
                    <p className="text-gray-600">
                      Artisan Relations:{" "}
                      <a
                        href="mailto:chuquanpho29@gmail.com"
                        className="text-primary hover:underline"
                      >
                        chuquanpho29@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <h3 className="font-heading text-h3">Call Us</h3>
                  </div>
                  <div className="ml-9">
                    <p className="text-gray-600 mb-1">
                      Phone:{" "}
                      <a
                        href="tel:+84783225944"
                        className="text-primary hover:underline"
                      >
                        84783225944
                      </a>
                    </p>
                    <p className="text-gray-600">
                      Hours: Monday-Friday, 9am-6pm PT
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <h3 className="font-heading text-h3">Connect with Us</h3>
                  </div>
                  <div className="ml-9 flex space-x-4">
                    <a href="#" className="text-primary hover:text-accent">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-primary hover:text-accent">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-primary hover:text-accent">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.4.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8">
                <h3 className="font-heading text-h3 mb-4">Our Location</h3>
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  {/* This is a placeholder for an actual map integration */}
                  <div className="absolute inset-0 bg-subtle flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-primary mx-auto mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <p className="text-primary font-medium">Việt Nam</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-h1 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading text-h3 mb-3">
                What are your shipping times?
              </h3>
              <p className="text-gray-600">
                We typically process orders within 1-2 business days. Domestic
                shipping takes 3-5 business days, while international shipping
                can take 7-14 business days depending on the destination.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading text-h3 mb-3">
                Do you offer returns or exchanges?
              </h3>
              <p className="text-gray-600">
                Yes, we offer returns and exchanges within 30 days of purchase.
                Items must be in original condition. Please note that custom
                orders are non-returnable.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading text-h3 mb-3">
                How do I track my order?
              </h3>
              <p className="text-gray-600">
                Once your order ships, you'll receive a confirmation email with
                tracking information. You can also log into your account to view
                order status.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading text-h3 mb-3">
                Can I request custom orders?
              </h3>
              <p className="text-gray-600">
                Absolutely! We love working on custom pieces. Please contact us
                with your ideas and requirements, and we'll connect you with an
                artisan who specializes in that craft.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="mb-4">Can't find an answer to your question?</p>
            <a href="#" className="btn-primary inline-block">
              View All FAQs
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-subtle">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-h1 mb-4">Stay Updated</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter for updates on new artisans,
            collections, and exclusive offers.
          </p>

          <form className="max-w-md mx-auto flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 flex-grow border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-r font-medium hover:bg-accent mt-2 sm:mt-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

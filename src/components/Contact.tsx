import React from "react";

const Contact: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const response = await fetch("https://api.monday.com/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "YOUR_MONDAY_API_KEY", // 🔑 Replace with your Monday API token
        },
        body: JSON.stringify({
          query: `
            mutation {
              create_item (
                board_id: YOUR_BOARD_ID,    // e.g. 123456789
                group_id: "topics",         // Change to your group ID
                item_name: "${name}",
                column_values: "{ \\"email\\": \\"${email}\\", \\"message\\": \\"${message}\\" }"
              ) {
                id
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.data) {
        alert("✅ Your message has been submitted to Monday CRM!");
        form.reset();
      } else {
        console.error("Error:", result);
        alert("❌ Failed to submit. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Network error, please try again later.");
    }
  };

  return (
    <section className="py-16 bg-gray-50" id="contact">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Contact Us
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-8 shadow-lg rounded-lg"
        >
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your name"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;

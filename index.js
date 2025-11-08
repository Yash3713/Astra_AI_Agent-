import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import axios from "axios";
import { Resend } from "resend";

if (
  !process.env.RESEND_API_KEY ||
  !process.env.EMAIL_FROM ||
  !process.env.EMAIL_TO
) {
  throw new Error(
    "Missing required environment variables: RESEND_API_KEY, EMAIL_FROM, EMAIL_TO"
  );
}

const resend = new Resend(process.env.RESEND_API_KEY);

const weatherTool = tool({
  name: "get_weather",
  description: "Get the current weather for a given location",
  parameters: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
  execute: async ({ city }) => {
    try {
      const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
      const response = await axios.get(url, {
        responseType: "text",
        timeout: 5000,
      });
      return `The current weather in ${city} is ${response.data}`;
    } catch (error) {
      console.error(`Failed to fetch weather for ${city}:`, error.message);
      return `Failed to fetch weather for ${city}. Please try again later.`;
    }
  },
});

const sendEmailTool = tool({
  name: "send_email",
  description: "Send an email with the given subject and body",
  parameters: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  execute: async ({ subject, body }) => {
    try {
      // Escape HTML to prevent XSS
      const escapeHtml = (text) => {
        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
      };

      const email = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: escapeHtml(subject),
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">${escapeHtml(body)}</div>`,
      });
      return `Email sent successfully with ID: ${email.id}`;
    } catch (error) {
      console.error("Failed to send email:", error.message);
      return `Failed to send email: ${error.message}`;
    }
  },
});

const assistantAgent = new Agent({
  name: "Weather Agent",
  instructions: `
    Get the weather for cities and ALWAYS email the results to the user
    using the send_email tool. Never just summarize the results in text.
    Format the email body as HTML with each city in a separate div:
    <div class="weather-item">
      <div class="city">City Name</div>
      <div class="temp">Weather details</div>
    </div>

    Make it visually appealing and easy to read.
  `,
  tools: [weatherTool, sendEmailTool],
});

async function main(query) {
  try {
    console.log(`Processing query: "${query}"`);
    const response = await run(assistantAgent, query);
    console.log("Agent Response:", response.finalOutput);
    console.log("\nTask completed successfully!");
  } catch (error) {
    console.error("Error running agent:", error.message);
    process.exit(1);
  }
}

// Get query from command line arguments or use default
const defaultQuery =
  "Get the weather in Chennai, and send me an email with the results.";
const query = process.argv.slice(2).join(" ") || defaultQuery;

main(query);

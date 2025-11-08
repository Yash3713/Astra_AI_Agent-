import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import axios from "axios";
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
  throw new Error("Missing environment variables for Resend.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const weatherTool = tool({
  name: "get_weather",
  description: "Get the current weather for a given location",
  parameters: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
  execute: async ({ city }) => {
    const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
    const response = await axios.get(url, { responseType: "text" });
    return `The current weather in ${city} is ${response.data}`;
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
    const email = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject,
      html: `<p>${body}</p>`,
    });
    return `Email sent with ID: ${email.id}`;
  },
});

const assistantAgent = new Agent({
  name: "Weather Agent",
  instructions: `
    Get the weather for  cities and ALWAYS email the results to the user 
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
  const response = await run(assistantAgent, query);
  console.log("Agent Response:", response.finalOutput);
}

main("Get the weather in Chennai, and send me an email with the results.");

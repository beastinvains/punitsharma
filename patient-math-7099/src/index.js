/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request,env) {
    const url = new URL(request.url)

    // ✅ CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }

    // ✅ Handle preflight (VERY IMPORTANT)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      })
    }

    // TEST API
    if (url.pathname === "/api/test") {
      return new Response(
        JSON.stringify({ message: "API working 🚀" }),
        { headers: corsHeaders }
      )
    }

    // LOGIN API
    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      return new Response(
        JSON.stringify({ token: "test-token-123" }),
        { headers: corsHeaders }
      )
    }

    // BLOGS API (temporary)
    if (url.pathname === "/api/blogs") {
      return new Response(
        JSON.stringify([{ id: 1, title: "Test Blog" }]),
        { headers: corsHeaders }
      )
    }

    // GALLERY API (temporary)
    if (url.pathname === "/api/gallery") {
      return new Response(
        JSON.stringify([{ id: 1, title: "Project 1" }]),
        { headers: corsHeaders }
      )
    }
 if (url.pathname === "/api/debug-db") {
      const { results } = await env.DB.prepare("SELECT * FROM blogs").all()

      return new Response(JSON.stringify(results), {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    return new Response("OK")

    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders,
    })
  }
}
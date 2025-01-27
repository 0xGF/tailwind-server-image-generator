# Tailwind Image Generator

A powerful Node.js package for generating images server-side using Tailwind CSS. Perfect for creating social media cards, thumbnails, or any dynamic images that leverage Tailwind's utility classes.

## Features

- Server-side image generation using Tailwind CSS
- Express server included for HTTP API access
- Support for custom dimensions and formats
- Built-in error handling and automatic port selection
- Uses Puppeteer for accurate rendering
- Supports all Tailwind CSS utility classes

## Installation

```bash
npm install tailwind-image-generator
```

## Quick Start

```javascript
const { generateImage, startServer } = require("tailwind-image-generator");

// Generate a single image
const htmlContent = `
  <div class="bg-blue-500 text-white font-bold py-4 px-6 rounded-lg">
    <h1 class="text-2xl">Hello, World!</h1>
    <p class="mt-4">Generated with Tailwind CSS</p>
  </div>
`;

generateImage(htmlContent, "output.png", {
  width: 600,
  height: 400,
  format: "png",
}).then(() => {
  console.log("Image generated successfully!");
});

// Start the HTTP server
startServer();
```

## API Reference

### `generateImage(htmlContent, outputPath, options)`

Generates an image from HTML content with Tailwind CSS styles.

#### Parameters:

- `htmlContent` (string): The HTML content to render
- `outputPath` (string): The path where the image will be saved
- `options` (object):
  - `width` (number): Image width in pixels (default: 800)
  - `height` (number): Image height in pixels (default: 600)
  - `format` (string): Image format - 'png' (default)

### `startServer(initialPort = 3000, maxAttempts = 10)`

Starts an Express server for HTTP-based image generation.

#### Parameters:

- `initialPort` (number): Starting port number (default: 3000)
- `maxAttempts` (number): Maximum attempts to find an available port (default: 10)

## HTTP API Usage

Once the server is running, you can generate images via HTTP:

```bash
GET /generate?html=<encoded-html>&width=800&height=600&format=png
```

Example:

```javascript
fetch(
  "http://localhost:3000/generate?html=" +
    encodeURIComponent('<div class="bg-blue-500">Hello</div>')
)
  .then((response) => response.blob())
  .then((blob) => {
    // Handle the generated image
  });
```

## Requirements

- Node.js >= 18.17.0
- Tailwind CSS ^4.0.0
- Puppeteer ^24.1.1

## Error Handling

The package includes robust error handling:

- Port conflicts are automatically resolved
- Invalid HTML content returns appropriate error messages
- File system errors are properly caught and reported

## Best Practices

1. Always encode HTML content when using the HTTP API
2. Consider image dimensions based on your use case
3. Clean up generated images after use
4. Use appropriate error handling in production

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start server
node test.js
```

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Puppeteer Documentation](https://pptr.dev/)
- [Express.js Documentation](https://expressjs.com/)

## License

ISC

## AI Integration Example

Here's how an AI system could use this package to generate images:

```javascript
async function generateSocialCard(content) {
  // 1. Generate HTML with the content
  const html = `
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800">${content.title}</h1>
      <p class="mt-4 text-gray-600">${content.description}</p>
    </div>
  `;

  // 2. Make request to your image generator endpoint
  const response = await fetch(
    "http://your-server.com/generate?" +
      new URLSearchParams({
        html: encodeURIComponent(html),
        width: 1200,
        height: 630,
      })
  );

  // 3. Get the image
  const imageBuffer = await response.blob();

  // 4. Use the image for your needs (e.g., save to disk, upload to storage, etc.)
  return imageBuffer;
}
```

This allows AI systems to:

- Generate social media cards
- Create dynamic banners/headers
- Generate preview images
- Create custom visualizations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

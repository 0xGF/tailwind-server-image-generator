const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

async function generateImage(htmlContent, outputPath, options = {}) {
  const { width = 800, height = 600, format = "png" } = options;

  // Launch a new browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the viewport size to the desired image dimensions
  await page.setViewport({ width: parseInt(width), height: parseInt(height) });

  // Create a temporary HTML file with the provided HTML content
  const tempFilePath = path.join(__dirname, "temp.html");
  fs.writeFileSync(
    tempFilePath,
    `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `
  );

  // Load the temporary HTML file in the browser
  await page.goto(`file://${tempFilePath}`, { waitUntil: "networkidle0" });

  // Wait for the Tailwind CSS styles to be applied
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const checkStyles = () => {
        const element = document.querySelector("*");
        if (window.getComputedStyle(element).display !== "none") {
          resolve();
        } else {
          setTimeout(checkStyles, 100);
        }
      };
      checkStyles();
    });
  });

  // Capture a screenshot of the rendered page
  await page.screenshot({ path: outputPath, fullPage: true });

  // Close the browser instance
  await browser.close();

  // Delete the temporary HTML file
  fs.unlinkSync(tempFilePath);
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/generate", async (req, res) => {
  const { html, width, height, format } = req.query;

  // Validate width and height
  if (width && (isNaN(width) || width <= 0)) {
    return res.status(400).send("Width must be a positive number");
  }
  if (height && (isNaN(height) || height <= 0)) {
    return res.status(400).send("Height must be a positive number");
  }

  if (!html) {
    return res.status(400).send("HTML content is required");
  }

  // Create a unique filename for each request
  const timestamp = Date.now();
  const outputDir = path.join(__dirname, "public", "generated");
  const outputPath = path.join(
    outputDir,
    `image-${timestamp}.${format || "png"}`
  );

  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await generateImage(html, outputPath, { width, height, format });

    // Send file and then delete it
    res.sendFile(outputPath, () => {
      // Delete file after it's sent
      fs.unlink(outputPath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send("Error generating image");
  }
});

function startServer(initialPort = 3000, maxAttempts = 10) {
  let port = initialPort;
  let attempts = 0;

  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempts < maxAttempts) {
      console.log(
        `Port ${port} is already in use. Trying the next available port...`
      );
      port++;
      attempts++;
      server.close(() => startServer(port, maxAttempts));
    } else {
      console.error("Failed to start the server:", error);
    }
  });
}

module.exports = {
  generateImage,
  startServer,
};

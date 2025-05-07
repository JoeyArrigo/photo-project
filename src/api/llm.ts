import axios from 'axios';
import fs from 'fs';

const OLLAMA_URL = 'http://localhost:11434/api/generate';

/**
 * Sends an image to Ollama for processing with Gemma3 and returns the description
 * @param imagePath Path to the image file
 * @returns The generated description
 */
export async function generatePhotoDescription(imagePath: string): Promise<string> {
  try {
    // Read the image file as base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Create prompt for the LLM
    const prompt = `
      Please describe this photo in detail. Include information about:
      - Who or what is in the photo
      - The setting or location
      - Any notable objects or activities
      - The general mood or atmosphere

      Provide a clear, concise description that captures the key elements of the image.
    `;

    console.log('getting description...')
    // Call Ollama API
    const response = await axios.post(OLLAMA_URL, {
      model: 'gemma3:4b',
      prompt: prompt,
      images: [base64Image],
      format: 'json',
      stream: false
    });

    // Extract the description from the response
    const description = JSON.parse(response.data.response.trim()).description;
    console.log('description', description)
    return description;
  } catch (error) {
    console.error('Error generating photo description:', error);
    throw new Error('Failed to generate photo description');
  }
}

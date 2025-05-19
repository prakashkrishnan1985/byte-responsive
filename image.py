import base64
import requests
import json
import sys

# Function to encode image to base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Function to query Ollama with a vision model
def query_ollama(image_path, model="llava:7b-v1.6-mistral-q4_1", prompt="Please give a friendly welcome message to the person in this image"):
    # Ollama API endpoint
    api_url = "http://localhost:11434/api/chat"
    
    # Encode the image
    base64_image = encode_image(image_path)
    
    # Prepare the request payload for Ollama
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": prompt,
                "images": [base64_image]
            }
        ],
        "stream": False  # Set to False to get a complete response
    }
    
    try:
        response = requests.post(api_url, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error querying Ollama: {e}")
        print(f"Response content: {response.text if 'response' in locals() else 'No response'}")
        return None

# Main function
def main():
    if len(sys.argv) < 2:
        print("Usage: python script.py <image_path>")
        return
    
    image_path = sys.argv[1]
    
    # Query Ollama
    print(f"Sending image '{image_path}' to LLaVA via Ollama...")
    print("This may take a minute on CPU...")
    result = query_ollama(image_path)
    
    if result:
        # Extract and print the response based on Ollama's response format
        try:
            message = result['message']['content']
            print("\nWelcome Message:")
            print(message)
        except (KeyError, IndexError) as e:
            print(f"Error parsing response: {e}")
            print("Full response:", json.dumps(result, indent=2))
    else:
        print("Failed to get response from Ollama")

if __name__ == "__main__":
    main()

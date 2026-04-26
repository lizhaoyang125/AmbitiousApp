import os
import requests


def generate_puppy_image(prompt: str, api_key: str = None) -> str:
    """
    Generate an image using MiniMax text-to-image API.

    Args:
        prompt: Text description of the image
        api_key: MiniMax API key (defaults to MINIMAX_API_KEY env var)

    Returns:
        URL of the generated image
    """
    if api_key is None:
        api_key = os.environ.get("MINIMAX_API_KEY")
        if not api_key:
            raise ValueError("API key not provided and MINIMAX_API_KEY env var not set")

    url = "https://api.minimaxi.com/v1/image_generation"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "image-01",
        "prompt": prompt,
        "aspect_ratio": "1:1",
        "response_format": "url",
        "n": 1,
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()

    data = response.json()
    if data.get("base_resp", {}).get("status_code") != 0:
        raise Exception(f"API error: {data.get('base_resp', {}).get('status_msg')}")

    image_urls = data.get("data", {}).get("image_urls", [])
    if not image_urls:
        raise Exception("No image URL in response")

    return image_urls[0]


if __name__ == "__main__":
    image_url = generate_puppy_image("a cute puppy dog, fluffy fur, big eyes, playing in a park")
    print(f"Generated image: {image_url}")
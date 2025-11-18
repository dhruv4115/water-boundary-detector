# Water Boundary Detector

Pixel-accurate water-body detection from drone and satellite images.  
This repository contains:

- A **FastAPI + PyTorch backend** that runs a UNet (ResNet34 encoder) segmentation model.
- A **React + Vite + TypeScript frontend** that uploads images and displays:
  - predicted mask,
  - mask-overlay,
  - and GeoJSON water-boundary polygons.

---

## ⭐ Table of Contents
- [Project Overview](#project-overview)
- [What the API Returns](#what-the-api-returns)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Example cURL Commands](#example-curl-commands)
- [Model Inference Pipeline](#model-inference-pipeline)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Production & Scaling Notes](#production--scaling-notes)
- [Troubleshooting](#troubleshooting)
- [Step-by-Step Workflow](#step-by-step-workflow)
- [License](#license)

---

## 🔍 Project Overview
The Water Boundary Detector identifies water regions in aerial images and returns:

- A **binary segmentation mask**
- A **red overlay** placed over the image for visual clarity
- **GeoJSON polygons** representing detected water boundaries

The backend hosts a UNet (ResNet34 encoder) model (`unet_best.pth`) and exposes a REST API for inference.

The frontend is a simple interface that:
- uploads an image,
- sends it to the backend,
- and displays all results (mask + overlay + GeoJSON).

---

## 📦 What the API Returns
A successful response from `/v1/predict` looks like:

```json
{
  "images": {
    "original": "<base64 png>",
    "mask": "<base64 png>",
    "overlay": "<base64 png>"
  },
  "geojson": {
    "type": "FeatureCollection",
    "features": [...]
  },
  "model_input_shape": [512, 512]
}
```

## 🛠 Tech Stack

### **Backend**
- **Python**
- **FastAPI**
- **Uvicorn**
- **PyTorch**
- **segmentation_models_pytorch**
- **OpenCV**
- **Pillow**

### **Frontend**
- **React**
- **Vite**
- **TypeScript**
- **Axios**

### **Model**
- **UNet** (with **ResNet34** encoder)
- Pretrained weights located at: **`models/unet_best.pth`**


## 📁 Repository Structure

```bash
water-boundary-detector/
├── models/            # Trained weights (unet_best.pth)
├── ui/                # Frontend: React + Vite + TypeScript
├── backend/
│   ├── app/           # FastAPI application code
│   └── requirements.txt
├── screenshots/
└── README.md
```

## 🚀 Backend Setup
```bash
# From project root
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate      # macOS/Linux
# venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Ensure model exists
cp ../models/unet_best.pth ./models/unet_best.pth
# (or set MODEL_PATH env variable)

# Run the server
uvicorn app.main:app --reload --port 8000

# Visit:
# http://localhost:8000/docs

```

## 🖥️ Frontend Setup

```bash
cd ui
npm install

# Add .env file inside /ui
# VITE_API_URL=http://localhost:8000/v1/predict

npm run dev

# Open: http://localhost:5173
```

## 📡 API Documentation

### **POST /v1/predict**

Uploads an image and returns:

- **Water mask (base64 PNG)**
- **Overlay image (base64 PNG)**
- **GeoJSON polygons** for detected water boundaries

---

### **📤 Form Data**

| Field | Type  | Required | Description                     |
|-------|--------|----------|---------------------------------|
| file  | image | yes      | Input drone/satellite image     |

---

### **🔍 Query Parameters**

| Param  | Type  | Default | Description            |
|--------|--------|----------|------------------------|
| thresh | float | 0.5      | Mask threshold (0–1)   |

---

### **📥 Response Format**

- `images.mask` → Base64-encoded PNG  
- `images.overlay` → Base64-encoded PNG  
- `geojson` → GeoJSON polygon features  
- `model_input_shape` → Shape of tensor fed to UNet  

---

## 🧪 Example cURL Commands

### **Basic prediction**
```bash
curl -X POST "http://localhost:8000/v1/predict" \
  -F "file=@sample.jpg" \
  -o response.json
```
### Decode mask and overlay
```bash
jq -r '.images.mask' response.json | base64 --decode > mask.png
jq -r '.images.overlay' response.json | base64 --decode > overlay.png

```

## 🧠 Model Inference Pipeline

1. **Read file bytes** → convert to RGB `numpy` array  
2. **Resize** to `MODEL_INPUT_SIZE` × `MODEL_INPUT_SIZE` (default **512**, configurable)  
3. **Normalize** → convert to `torch.Tensor` → move to device (`cpu` / `cuda` / `mps`)  
4. **Model forward pass** (UNet with ResNet34 encoder)  
5. **Apply sigmoid** → threshold → binary mask  
6. **Extract contours** → convert to GeoJSON polygons  
7. **Create overlay image** (mask blended over original/resized image)  
8. **Encode outputs to PNG (base64)**  
9. **Return JSON response** containing:  
   - `images.mask` (base64 PNG)  
   - `images.overlay` (base64 PNG)  
   - `geojson` (FeatureCollection)  
   - `model_input_shape`

---

## ⚙️ Environment Variables

Add these to your `.env` file or export them in your deployment environment.

| Variable         | Description                                 |
|------------------|---------------------------------------------|
| `MODEL_PATH`     | Path to `unet_best.pth` (e.g. `./models/unet_best.pth`) |
| `DEVICE`         | `cpu` / `cuda` / `mps`                      |
| `MODEL_INPUT_SIZE` | Default: `512` (square input for the model) |
| `MAX_UPLOAD_SIZE`| Maximum upload size in bytes (limit)        |
| `CORS_ORIGINS`   | Comma-separated allowed frontend origins (for FastAPI CORS) |

### Example `.env`
```env
MODEL_PATH=./models/unet_best.pth
DEVICE=cpu
MODEL_INPUT_SIZE=512
MAX_UPLOAD_SIZE=104857600   # 100 MB
CORS_ORIGINS=http://localhost:5173
```

## 🚀 Future Improvements

* **Georeferencing:** Convert pixel coordinates → Lat/Lon using image EXIF/GPS metadata.
* **Standardized Output:** Serve GeoJSON in WGS84 coordinates after georeferencing.
* **Security:** Add user authentication (JWT) and API rate limiting.
* **Scalability:** Add a batching system with Celery/RabbitMQ for heavy inference loads.
* **Deployment:** Containerize the backend using Docker and deploy to AWS/GCP.
* **Refinement:** Add morphological smoothing and small-object removal during post-processing.
* **Optimization:** Export the model to ONNX or TorchScript for high-speed inference without Python overhead.

## 🔧 Production & Scaling Notes

* **Large Images:** For high-resolution drone maps, resize client-side before upload or implement tiling-based inference (sliding window) on the backend.
* **Concurrency:** Run the API behind **Gunicorn** with multiple Uvicorn workers to handle parallel requests.
* **Caching:** Cache results for repeated inferences on the same image hash using **Redis**.
* **Security:** Enable HTTPS and require JWT authentication for all endpoints.
* **Monitoring:** Track model latency and memory usage (e.g., using Prometheus/Grafana).

## 🐞 Troubleshooting

**Model Load Errors**
* Ensure the architecture definition in your inference code matches exactly what was used to train the model.

**Device Mismatch**
* The code attempts to auto-detect the device.
* **For M1/M2 Mac:** If you encounter issues, force MPS usage:
    ```bash
    export USE_MPS=1
    ```

**CORS Error**
* If the frontend cannot connect to the backend, ensure your frontend URL is added to the `allow_origins` list in the FastAPI CORS middleware configuration.

**Large Images Failing**
* Increase the `MAX_UPLOAD_SIZE` configuration.
* Consider implementing streaming requests for very large files.

**Incorrect GeoJSON**
* Remember that returned coordinates are for the **resized** image input (e.g., 512×512).
* You must map these back to the original image resolution in the frontend if precise overlay is required on the full-size image.

## 🧭 Step-by-Step Workflow Summary

1.  **Backend Init:** Create folder structure and add application code.
2.  **Environment:** Create Python virtual environment and install `requirements.txt`.
3.  **Model Weights:** Copy your trained model file to `models/unet_best.pth`.
4.  **Run Server:** Start the backend:
    ```bash
    uvicorn app.main:app --reload
    ```
5.  **Verify API:** Open `http://localhost:8000/docs` to test the endpoint.
6.  **Frontend Setup:** configure `.env` to point to the backend URL.
7.  **Run Client:** Start the React app:
    ```bash
    npm run dev
    ```
8.  **Test:** Upload an image and validate the mask, overlay, and polygon outputs.
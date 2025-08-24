# backend/classifier.py
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import joblib
import os
import re
import fitz  # PyMuPDF
import io
from typing import Dict, Any

# --- OCR & Image preprocessing ---
def preprocess_image_for_ocr(image):
    import cv2
    import numpy as np
    from PIL import Image

    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    denoised = cv2.medianBlur(gray, 3)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(denoised)
    binary = cv2.adaptiveThreshold(enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY, 11, 2)
    return Image.fromarray(binary)

def extract_text_with_ocr(pdf_path, use_ocr_threshold=0.1):
    import pytesseract
    from pdf2image import convert_from_path
    from PIL import Image
    import numpy as np

    text_content = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page_num, page in enumerate(doc):
                page_text = page.get_text()

                if len(page_text.strip()) / max(len(page_text), 1) < use_ocr_threshold:
                    print(f"Page {page_num + 1}: OCR activé")
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    img_data = pix.tobytes("png")
                    image = Image.open(io.BytesIO(img_data))
                    processed_image = preprocess_image_for_ocr(image)
                    ocr_text = pytesseract.image_to_string(
                        processed_image,
                        lang='eng+fra',
                        config='--oem 3 --psm 6'
                    )
                    text_content += ocr_text + " "
                else:
                    text_content += page_text + " "
    except Exception as e:
        print(f"Erreur extraction texte: {e}")
        try:
            images = convert_from_path(pdf_path, dpi=200)
            for i, image in enumerate(images):
                print(f"OCR sur page {i + 1}")
                processed_image = preprocess_image_for_ocr(image)
                ocr_text = pytesseract.image_to_string(
                    processed_image,
                    lang='eng+fra',
                    config='--oem 3 --psm 6'
                )
                text_content += ocr_text + " "
        except Exception as ocr_error:
            print(f"Erreur OCR: {ocr_error}")
            return ""
    return text_content.strip()

# --- Nettoyage du texte ---
def clean_text_advanced(text):
    import nltk
    import string
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer

    if not isinstance(text, str):
        return ""

    # Télécharger les ressources NLTK
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('punkt_tab', quiet=True)

    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()

    text = text.lower()
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'http[s]?://\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'[^a-zA-ZÀ-ÿ\s]', ' ', text)

    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words and len(word) > 2]
    return " ".join(tokens)

# --- Classifieur ---
class PDFClassifier:
    def __init__(self, model_path="./models/pdf_classifier_final"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[INFO] Chargement du modèle depuis {model_path} sur {self.device}")

        self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.label_encoder = joblib.load(os.path.join(model_path, "label_encoder.pkl"))
        self.model.to(self.device)
        self.model.eval()
        self.max_length = 512  # Valeur fixée (comme dans ton notebook)

    def predict(self, pdf_path: str) -> Dict[str, Any]:
        try:
            text = extract_text_with_ocr(pdf_path)
            if not text.strip():
                return {"error": "Aucun texte extrait du PDF."}

            cleaned_text = clean_text_advanced(text)
            if not cleaned_text.strip():
                return {"error": "Texte vide après nettoyage."}

            inputs = self.tokenizer(
                cleaned_text,
                return_tensors="pt",
                truncation=True,
                padding="max_length",
                max_length=self.max_length,
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}

            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
                confidence, pred_id = torch.max(probs, dim=-1)

            predicted_class = self.label_encoder.inverse_transform([pred_id.cpu().item()])[0]
            confidence_score = confidence.cpu().item()

            extracted_info = self.extract_key_info(predicted_class, text)

            return {
                "predicted_class": predicted_class,
                "confidence": round(confidence_score, 3),
                "extracted_info": extracted_info,
                "text_length": len(cleaned_text),
                "original_text_length": len(text),
            }

        except Exception as e:
            return {"error": str(e)}

    def extract_key_info(self, category, text):
        """Extraction des informations clés selon la catégorie détectée"""
        info = {}
        category = category.lower()

        if category == "invoice":
            info["Order Date"] = self.find_regex(r"Order Date[:\s]+([\d\-\/]+)", text)
            info["Contact Name"] = self.find_regex(r"Contact Name[:\s]+([A-Za-z\s]+)", text)
            info["Address"] = self.find_regex(r"Address[:\s]+(.+)", text)
            info["Products"] = re.findall(r"(\w+)\s+([\w\s]+)\s+(\d+)\s+([\d\.]+)", text)
   

        elif category == "purchase order":
             header_match = re.search(r"(\d+)\s+(\d{4}-\d{2}-\d{2})\s+([A-Za-z\s]+)", text)
             if header_match:
                info["Order ID"] = header_match.group(1)
                info["Order Date"] = header_match.group(2)
                info["Customer Name"] = header_match.group(3).strip()

            # Produits : ID, Nom, Quantité, Prix unitaire
             info["Products"] = re.findall(
                r"(\d+)\s+([A-Za-z\s]+?)\s+(\d+)\s+([\d\.]+)",
                text, re.MULTILINE
            )

        elif category == "report":
            info["Period"] = self.find_regex(r"(20\d{2}-\d{2})", text)
            info["Category"] = self.find_regex(r"Category\s*:\s*(.+)", text)
            info["Products"] = re.findall(r"([\w\s]+)\s+(\d+)\s+(\d+)\s+([\d\.]+)", text)

        elif category.replace(" ", "") == "shippingorder":
            info["Order ID"] = self.find_regex(r"Order ID[:\s]+(\d+)", text)

    # Dates
            info["Order Date"] = self.find_regex(r"Order Date[:\s]+([\d\-\/]+)", text)
            info["Shipped Date"] = self.find_regex(r"Shipped Date[:\s]+([\d\-\/]+)", text)

    # Shipping details
            info["Ship Name"] = self.find_regex(r"Ship Name[:\s]+(.+)", text)
            info["Ship Address"] = self.find_regex(r"Ship Address[:\s]+(.+)", text)
            info["Ship City"] = self.find_regex(r"Ship City[:\s]+(.+)", text)
            info["Ship Region"] = self.find_regex(r"Ship Region[:\s]+(.+)", text)
            info["Ship Postal Code"] = self.find_regex(r"Ship Postal Code[:\s]+(.+)", text)
            info["Ship Country"] = self.find_regex(r"Ship Country[:\s]+(.+)", text)

            # Produits : Nom, Quantité, Prix unitaire, Total
            info["Products"] = re.findall(
                r"Product[:\s]*(.+?)\s*Quantity[:\s]*(\d+)\s*Unit Price[:\s]*([\d\.]+)\s*Total[:\s]*([\d\.]+)",
                text, re.IGNORECASE | re.DOTALL
            )


        return info


    def find_regex(self, pattern: str, text: str) -> str:
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else None
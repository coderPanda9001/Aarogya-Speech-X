import os
import json
import logging

logger = logging.getLogger(__name__)

DATASET_FILE = os.path.join(os.path.dirname(__file__), "hindi_speech_corpus.json")

def load_hindi_speech_corpus():
    """Loads the curated Hindi speech therapy corpus from local dataset storage."""
    if os.path.exists(DATASET_FILE):
        with open(DATASET_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            logger.info(f"Loaded {len(data)} items from Hindi speech corpus dataset.")
            return data
    return []

def get_material_counts_by_category():
    """Returns dynamic item counts grouped by material category."""
    materials = load_hindi_speech_corpus()
    counts = {}
    for item in materials:
        cat = item.get("category", "अन्य")
        counts[cat] = counts.get(cat, 0) + 1
    return counts

if __name__ == "__main__":
    data = load_hindi_speech_corpus()
    print(f"Total dataset items loaded: {len(data)}")
    print("Category Breakdown:", get_material_counts_by_category())

import json

with open('admin_gallery_dump.json', 'r', encoding='utf-8') as f:
    dump = json.load(f)

clean = []
for d in dump:
    clean.append({
        'id': d['id'],
        'title': d['title'],
        'category': d.get('category', 'events'),
        'imageUrl': d['imageUrl'],
        'date': d.get('date', 'Recent Event'),
        'description': d.get('description', '')
    })

content = 'import { GalleryItem } from "../types";\n\n'
content += 'export const ADMIN_GALLERY_ITEMS: GalleryItem[] = ' + json.dumps(clean, indent=2) + ';\n'

with open('frontend/src/data/adminGallery.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('backend/src/data/store.json', 'r', encoding='utf-8') as f:
    store = json.load(f)

store['gallery'] = clean

with open('backend/src/data/store.json', 'w', encoding='utf-8') as f:
    json.dump(store, f, indent=2, ensure_ascii=False)

print(f"Successfully created adminGallery.ts and updated store.json with {len(clean)} items.")

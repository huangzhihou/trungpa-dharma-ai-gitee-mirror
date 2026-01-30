import json
import os

books = [
    "The_Collected_Works_of_Ch_gyam_Trungpa_Volume_1__Ch_gyam_Trungpa___Z-Library___1_.pdf.json",
    "The_Collected_Works_of_Ch_gyam_Trungpa_Volume_2__Ch_gyam_Trungpa___Z-Library_.pdf.json",
    "The_Collected_Works_of_Cho_gyam_Trungpa_Volume_3__Cho_gyam_Trungpa___Z-Library_.pdf.json",
    "The_Collected_Works_of_Ch_gyam_Trungpa_Volume_4__Ch_gyam_Trungpa___Z-Library_.pdf.json",
    "The_Collected_Works_of_Ch_gyam_Trungpa_Volume_5__Ch_gyam_Trungpa___Z-Library_.pdf.json",
    "The_Collected_Works_of_Ch_gyam_Trungpa_Volume_6__Ch_gyam_Trungpa___Z-Library_.pdf.json",
    "The_Collected_Works_of_Ch_gyam_Trungpa_Volume_7__Ch_gyam_Trungpa___Z-Library_.pdf.json",
    "The_Collected_Works_of_Ch_gyam_Trungpa_Volume_8__Ch_gyam_Trungpa___Z-Library_.pdf.json",
    "The_Collected_Works_of_Ch_gyam_Trungpa__Volume_9__Chogyam_Trungpa__Carolyn_Rose_Gimian___Z-Library_.pdf.json",
    "The_Collected_Works_of_Ch_gyam_Trungpa__Volume_10__Chogyam_Trungpa__Carolyn_Rose_Gimian___Z-Library_.pdf.json",
    "The_Essential_Chogyam_Trungpa__Chogyam_Trungpa___Z-Library_.pdf.json"
]

book_list = []
for book_file in books:
    try:
        with open(os.path.join('data', book_file), 'r', encoding='utf-8') as f:
            data = json.load(f)
            filename = book_file
            title = data.get('title', data.get('filename', filename))
            cn_name = filename.replace('The_Collected_Works_of_Ch_gyam_Trungpa_Volume_', '创巴仁波切文集第').replace('Ch_gyam_Trungpa___Z-Library___1_.pdf.json', '卷（第一部）').replace('Ch_gyam_Trungpa___Z-Library_.pdf.json', '卷').replace('Cho_gyam_Trungpa___Z-Library_.pdf.json', '卷').replace('Chogyam_Trungpa__Carolyn_Rose_Gimian___Z-Library_.pdf.json', '卷').replace('The_Essential_Chogyam_Trungpa__Chogyam_Trungpa___Z-Library_.pdf.json', '精粹')
            book_list.append({'filename': filename, 'en_title': title if isinstance(title, str) else filename, 'cn_title': cn_name})
            print(f"✓ {cn_name}")
    except Exception as e:
        print(f"✗ Error reading {book_file}: {e}")

with open('data/book_list.json', 'w', encoding='utf-8') as f:
    json.dump(book_list, f, ensure_ascii=False, indent=2)

print(f"\n已保存 {len(book_list)} 本书的目录信息")

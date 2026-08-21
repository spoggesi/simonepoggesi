# Simone Poggesi, Ph.D. — Academic & Personal Website

This repository powers the personal academic website of **Simone Poggesi, Ph.D.** hosted on GitHub Pages at:  
👉 **[https://spoggesi.github.io/simonepoggesi/](https://spoggesi.github.io/simonepoggesi/)**

---

## 📁 Repository Directory Structure

```text
simonepoggesi/
├── index.html                  # Main layout and structure
├── README.md                   # Site instructions
├── CV_Simone_Poggesi.pdf       # Main PDF CV available for download
├── data/
│   ├── publications.json       # All peer-reviewed journal papers
│   ├── posters.json            # Conference posters metadata
│   └── news.json               # Research blog, news cards & videos
├── media/
│   ├── profile.jpg             # Profile photo
│   └── signature.png           # Digital signature
├── posters/
│   ├── 2025_pangborn_icecream.pdf
│   └── 2025_pangborn_metaverse.pdf
└── js/
    └── main.js                 # Automatic data loading & sorting logic
```

## 🛠️ How to Update Content (Instructions for Future Updates)
You never need to edit index.html for routine updates. Simply modify the JSON files in the data/ folder and push your changes.

1. Adding a New Publication
Open data/publications.json and add a new object to the top of the list:

```JSON
{
  "authors": "Poggesi, S., et al.",
  "year": 2027,
  "title": "Your New Paper Title",
  "journal": "Food Quality and Preference",
  "volume": "100123",
  "doi": ""
}
```

2. Adding a New Conference Poster
Upload the PDF file to the posters/ folder (e.g., posters/2026_eurosense.pdf).

Open data/posters.json and add an entry:

```JSON
{
  "title": "Poster Title Here",
  "authors": "S. Poggesi, J. Hort",
  "conference": "EuroSense 2026",
  "location": "Rotterdam, Netherlands",
  "description": "Brief summary of poster findings.",
  "pdfPath": "posters/2026_eurosense.pdf",
  "year": 2026
}
```

3. Adding a News Update, Blog Post, or Video
Open data/news.json and add a new object:

Text-only post:

```JSON
{
  "id": 4,
  "title": "Awarded New Research Grant",
  "date": "October 2026",
  "category": "Grant Awarded",
  "categoryColor": "purple",
  "description": "Description of the new grant or milestone.",
  "mediaType": "none",
  "mediaUrl": ""
}
```

Video Post:

Upload an .mp4 video to media/ (e.g., media/vr_demo.mp4), then set:

```JSON
"mediaType": "video",
"mediaUrl": "media/vr_demo.mp4"
```

## 🚀 Pushing Updates to GitHub (VS Code Terminal)
After editing files in Visual Studio Code, run these commands in the Terminal (Ctrl + ~):

```Bash
git add .
git commit -m "Updated publications/news"
git push
```
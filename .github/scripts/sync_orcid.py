import json
import os
import requests
from datetime import datetime

ORCID_ID = os.getenv("ORCID_ID") # Get ORCID ID from environment variable
if not ORCID_ID:
    raise ValueError("ORCID_ID environment variable not set!")

# ORCID API endpoint for public works
url = f"https://pub.orcid.org/v3.0/{ORCID_ID}/works"
headers = {"Accept": "application/json"}

response = requests.get(url, headers=headers)
response.raise_for_status() # Raise an exception for bad status codes

data = response.json()

# Prepare markdown content
md_content = f"# My Publications (Last updated: {datetime.now().strftime('%Y-%m-%d')})\n\n"

for group in data.get('group', []):
    # Each group represents a publication
    work_summary = group['work-summary'][0] # Take the first summary in the group
    title = work_summary.get('title', {}).get('title', {}).get('value', 'No Title')
    journal_title = work_summary.get('journal-title', {}).get('value', '')
    publication_date = work_summary.get('publication-date')
    
    date_str = "N/A"
    if publication_date:
        year = str(publication_date.get('year', {}).get('value', ''))
        month = str(publication_date.get('month', {}).get('value', '')).zfill(2)
        day = str(publication_date.get('day', {}).get('value', '')).zfill(2)
        date_str = f"{year}-{month}-{day}" if year else "N/A"

    md_content += f"- **{title}**\n"
    if journal_title:
        md_content += f"  - *{journal_title}*, {date_str}\n"
    else:
        md_content += f"  - {date_str}\n"
    md_content += "\n"

# Write the content to PUBLICATIONS.md
with open("PUBLICATIONS.md", "w", encoding='utf-8') as f:
    f.write(md_content)

print(f"Publications successfully fetched from ORCID ({ORCID_ID}) and written to PUBLICATIONS.md")
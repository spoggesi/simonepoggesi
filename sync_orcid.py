import os
from datetime import datetime, timezone

import requests

ORCID_ID = os.getenv("ORCID_ID")  # Get ORCID ID from environment variable
if not ORCID_ID:
    raise ValueError("ORCID_ID environment variable not set!")

# ORCID API endpoint for public works
url = f"https://pub.orcid.org/v3.0/{ORCID_ID}/works"
headers = {"Accept": "application/json"}

response = requests.get(url, headers=headers)
response.raise_for_status()  # Raise an exception for bad status codes

data = response.json()


def get_nested(data, *keys, default=None):
    """Estrae in modo sicuro valori nidificati da dizionari anche in presenza di valori None."""
    for key in keys:
        if not isinstance(data, dict):
            return default
        data = data.get(key)
        if data is None:
            return default
    return data


# Prepare markdown content
md_content = f"# My Publications (Last updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d')})\n\n"

for group in data.get("group", []):
    # Each group represents a publication
    work_summary = group["work-summary"][0]  # Take the first summary in the group
    title = get_nested(work_summary, "title", "title", "value", default="No Title")
    journal_title = get_nested(work_summary, "journal-title", "value", default="")

    # Safely extract publication date parts
    year_val = get_nested(work_summary, "publication-date", "year", "value")
    month_val = get_nested(work_summary, "publication-date", "month", "value")
    day_val = get_nested(work_summary, "publication-date", "day", "value")

    date_str = "N/A"
    year = str(year_val) if year_val else ""
    month = str(month_val).zfill(2) if month_val else ""
    day = str(day_val).zfill(2) if day_val else ""

    # Construct the date string based on available parts
    if year and month and day:
        date_str = f"{year}-{month}-{day}"
    elif year and month:
        date_str = f"{year}-{month}"
    elif year:
        date_str = f"{year}"

    md_content += f"- **{title}**\n"
    if journal_title:
        md_content += f"  - *{journal_title}*, {date_str}\n"
    else:
        md_content += f"  - {date_str}\n"
    md_content += "\n"

# Write the content to PUBLICATIONS.md
with open("PUBLICATIONS.md", "w", encoding="utf-8") as f:
    f.write(md_content)

print(
    f"Publications successfully fetched from ORCID ({ORCID_ID}) and written to PUBLICATIONS.md"
)

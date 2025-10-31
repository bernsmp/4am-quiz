"""Scrape futuretools.io tool listings and export structured JSON."""

from __future__ import annotations

import json
import sys
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, Tag


BASE_URL = "https://www.futuretools.io/"
LISTING_PATH = "/"
REQUEST_DELAY_SECONDS = 1.0
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/127.0.0.0 Safari/537.36"
)


@dataclass(slots=True)
class ToolRecord:
    slug: str
    title: str
    detail_url: str
    visit_url: Optional[str]
    summary: Optional[str]
    description: Optional[str]
    description_html: Optional[str]
    categories: list[str]
    pricing_model: Optional[str]
    pricing_notes: Optional[str]
    free_trial: bool
    matt_pick: bool
    special_offer: bool
    affiliate_disclaimer: bool
    related_tags: list[str]
    image_url: Optional[str]
    og_image_url: Optional[str]
    upvotes: Optional[int]
    list_item_id: Optional[str]
    last_scraped_at: str


class FutureToolsScraper:
    def __init__(self, delay_seconds: float = REQUEST_DELAY_SECONDS) -> None:
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Referer": BASE_URL,
            "Accept-Language": "en-US,en;q=0.9",
        })
        self.delay_seconds = max(0.0, delay_seconds)

    def scrape(self) -> list[ToolRecord]:
        records: list[ToolRecord] = []
        visited_slugs: set[str] = set()
        next_url = urljoin(BASE_URL, LISTING_PATH)
        page_index = 1

        while next_url:
            print(f"Fetching listing page {page_index}: {next_url}")
            soup = self._fetch_soup(next_url)
            items = list(self._parse_listing_page(soup))
            if not items:
                print("No listing items found; stopping pagination.")
                break

            for item in items:
                slug = item.get("slug")
                if not slug:
                    continue
                if slug in visited_slugs:
                    continue

                visited_slugs.add(slug)
                detail_url = item.get("detail_url")
                detail_data = self._parse_detail_page(detail_url) if detail_url else {}
                record = self._merge_record(item, detail_data)
                records.append(record)

            next_url = self._find_next_page_url(soup, current_url=next_url)
            page_index += 1

        return records

    def _fetch_soup(self, url: str) -> BeautifulSoup:
        response = self.session.get(url, timeout=30)
        response.raise_for_status()
        if self.delay_seconds:
            time.sleep(self.delay_seconds)
        return BeautifulSoup(response.text, "html.parser")

    def _parse_listing_page(self, soup: BeautifulSoup) -> Iterable[dict[str, Optional[str]]]:
        tool_nodes = soup.select("div.tool.w-dyn-item")
        for node in tool_nodes:
            title_link = node.select_one("a.tool-item-link---new")
            detail_href = title_link["href"].strip() if title_link and title_link.has_attr("href") else None
            detail_url = urljoin(BASE_URL, detail_href) if detail_href else None

            title = title_link.get_text(strip=True) if title_link else None
            summary_el = node.select_one(".tool-item-description-box---new")
            summary = summary_el.get_text(strip=True) if summary_el else None

            image_el = node.select_one("img.tool-item-image---new")
            image_url = image_el["src"].strip() if image_el and image_el.has_attr("src") else None

            visit_link = node.select_one("a.tool-item-new-window---new")
            visit_href = visit_link["href"].strip() if visit_link and visit_link.has_attr("href") else None
            visit_url = urljoin(BASE_URL, visit_href) if visit_href else None

            categories = [
                el.get_text(strip=True)
                for el in node.select(".collection-list-8 .text-block-53")
                if el.get_text(strip=True)
            ]

            list_item_input = node.select_one("input.jetboost-list-item")
            list_item_id = list_item_input["value"].strip() if list_item_input and list_item_input.has_attr("value") else None

            upvote_el = node.select_one(".jetboost-item-total-favorites-vd2l")
            upvotes = self._safe_int(upvote_el.get_text(strip=True) if upvote_el else None)

            slug = self._extract_slug(detail_href) if detail_href else None

            yield {
                "slug": slug,
                "title": title,
                "detail_url": detail_url,
                "visit_url": visit_url,
                "summary": summary,
                "categories": categories,
                "image_url": image_url,
                "upvotes": upvotes,
                "list_item_id": list_item_id,
            }

    def _parse_detail_page(self, url: Optional[str]) -> dict[str, Optional[str]]:
        if not url:
            return {}

        print(f"  Fetching detail page: {url}")
        soup = self._fetch_soup(url)

        description_html = None
        rich_text = soup.select_one(".rich-text-block")
        if rich_text and not self._is_hidden(rich_text):
            description_html = rich_text.decode_contents().strip()
        else:
            summary_text = soup.select_one(".text-block-9")
            if summary_text and not self._is_hidden(summary_text):
                description_html = summary_text.decode_contents().strip()

        description_text = None
        if description_html is not None:
            description_text = BeautifulSoup(description_html, "html.parser").get_text(" ", strip=True)

        pricing_model = None
        pricing_notes = None
        free_trial = False

        pricing_container = soup.select_one(".div-block-17")
        if pricing_container:
            visible_blocks = [
                el.get_text(strip=True)
                for el in pricing_container.select(".text-block-2, .text-block-14")
                if not self._is_hidden(el) and el.get_text(strip=True)
            ]
            if visible_blocks:
                pricing_model = visible_blocks[0]
            if len(visible_blocks) > 1:
                pricing_notes = " ".join(visible_blocks[1:])

            free_trial = any(
                "free trial" in el.get_text(strip=True).lower()
                for el in pricing_container.select(".div-block-13, .text-block-14")
                if not self._is_hidden(el)
            )

        tags = [
            el.get_text(strip=True)
            for el in soup.select(".tags-block .text-block-18")
            if not self._is_hidden(el) and el.get_text(strip=True)
        ]

        matt_pick = any(
            not self._is_hidden(block)
            for block in soup.select(".matts-pick-block")
        )

        special_offer = any(
            not self._is_hidden(block)
            for block in soup.select(".div-block-50")
        )

        affiliate_disclaimer = any(
            not self._is_hidden(block)
            for block in soup.select(".affiliate-disclaimer")
        )

        hero_image = soup.select_one(".cell-2 img")
        hero_src = hero_image["src"].strip() if hero_image and hero_image.has_attr("src") else None

        og_image = None
        og_tag = soup.find("meta", attrs={"property": "og:image"})
        if og_tag and og_tag.get("content"):
            og_image = og_tag["content"].strip()

        return {
            "description": description_text,
            "description_html": description_html,
            "pricing_model": pricing_model,
            "pricing_notes": pricing_notes,
            "free_trial": free_trial,
            "related_tags": tags,
            "matt_pick": matt_pick,
            "special_offer": special_offer,
            "affiliate_disclaimer": affiliate_disclaimer,
            "detail_image_url": hero_src,
            "og_image_url": og_image,
        }

    def _merge_record(self, listing: dict[str, Optional[str]], detail: dict[str, Optional[str]]) -> ToolRecord:
        timestamp = datetime.now(timezone.utc).isoformat()
        categories = detail.get("related_tags") or listing.get("categories") or []
        if isinstance(categories, str):
            categories = [categories]

        image_url = detail.get("detail_image_url") or listing.get("image_url")

        return ToolRecord(
            slug=listing.get("slug") or "",
            title=listing.get("title") or "",
            detail_url=listing.get("detail_url") or "",
            visit_url=detail.get("visit_url") or listing.get("visit_url"),
            summary=listing.get("summary"),
            description=detail.get("description"),
            description_html=detail.get("description_html"),
            categories=list(dict.fromkeys([c for c in categories if c])),
            pricing_model=detail.get("pricing_model"),
            pricing_notes=detail.get("pricing_notes"),
            free_trial=bool(detail.get("free_trial")),
            matt_pick=bool(detail.get("matt_pick")),
            special_offer=bool(detail.get("special_offer")),
            affiliate_disclaimer=bool(detail.get("affiliate_disclaimer")),
            related_tags=list(dict.fromkeys(detail.get("related_tags", []))),
            image_url=image_url,
            og_image_url=detail.get("og_image_url"),
            upvotes=listing.get("upvotes"),
            list_item_id=listing.get("list_item_id"),
            last_scraped_at=timestamp,
        )

    def _find_next_page_url(self, soup: BeautifulSoup, current_url: str) -> Optional[str]:
        next_link = soup.select_one(".w-pagination-next")
        if not next_link or not next_link.has_attr("href"):
            return None

        href = next_link["href"].strip()
        if not href or href.startswith("#"):
            return None

        candidate_url = urljoin(current_url, href)
        if candidate_url == current_url:
            return None
        return candidate_url

    @staticmethod
    def _extract_slug(detail_href: str) -> Optional[str]:
        if not detail_href:
            return None
        parsed = urlparse(detail_href)
        path = parsed.path or detail_href
        parts = [p for p in path.strip("/").split("/") if p]
        if not parts:
            return None
        return parts[-1]

    @staticmethod
    def _safe_int(value: Optional[str]) -> Optional[int]:
        if value is None:
            return None
        try:
            return int(value.replace(",", ""))
        except (ValueError, AttributeError):
            return None

    @staticmethod
    def _is_hidden(node: Tag) -> bool:
        classes = node.get("class", [])
        return "w-condition-invisible" in classes if classes else False


def write_json(records: list[ToolRecord], output_path: Path) -> None:
    data = [asdict(record) for record in records]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2, ensure_ascii=False)


def main() -> int:
    scraper = FutureToolsScraper()
    try:
        records = scraper.scrape()
    except requests.RequestException as exc:
        print(f"Error while scraping: {exc}", file=sys.stderr)
        return 1

    if not records:
        print("No records were scraped.")
        return 1

    output_path = Path("data/futuretools.json")
    write_json(records, output_path)
    print(f"Wrote {len(records)} tool records to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


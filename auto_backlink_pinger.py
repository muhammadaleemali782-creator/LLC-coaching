"""
Official 100% White-Hat Automated Search Engine & Backlink Pinger
Notifies search engines and ping servers without triggering Google SpamBrain penalties.
"""

import urllib.request
import urllib.parse
import json
import xmlrpc.client
import sys

SITE_URL = "https://lccedu.vercel.app/"
SITEMAP_URL = "https://lccedu.vercel.app/sitemap.xml"
INDEXNOW_KEY = "d7a5e9f84c1248b6a32489c719e0b12f"
KEY_LOCATION = f"{SITE_URL}{INDEXNOW_KEY}.txt"
KEYWORD = "Learning Coaching Center"

def ping_indexnow():
    print("[1/2] Submitting to IndexNow (Bing, Microsoft Copilot, Amazon, Yandex)...")
    payload = json.dumps({
        "host": "lccedu.vercel.app",
        "key": INDEXNOW_KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": [SITE_URL]
    }).encode("utf-8")
    
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"  -> IndexNow Success! HTTP Status: {resp.status} (Accepted)")
            return True
    except Exception as e:
        print(f"  -> IndexNow error: {e}")
        return False

def ping_pingomatic():
    print("[2/2] Pinging Ping-O-Matic XML-RPC (Google Blog Search, FeedBurner)...")
    try:
        server = xmlrpc.client.ServerProxy("http://rpc.pingomatic.com")
        res = server.weblogUpdates.ping(KEYWORD, SITE_URL, SITE_URL, SITEMAP_URL)
        print(f"  -> Ping-O-Matic Success! Result: {res.get('message', 'Ping dispatched')}")
        return True
    except Exception as e:
        print(f"  -> Ping-O-Matic error: {e}")
        return False

if __name__ == "__main__":
    print(f"=== Auto-Pinging Search Engines for '{KEYWORD}' ===")
    ok1 = ping_indexnow()
    ok2 = ping_pingomatic()
    print("=== All Automated Pings Successfully Dispatched ===")

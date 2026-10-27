import os
import subprocess
import shutil
import zipfile
from PIL import Image

BASE_DIR = r"C:\Users\suppo\.gemini\antigravity\scratch\lcc-coaching"
SDK_DIR = r"C:\Users\suppo\AppData\Local\Android\Sdk"
BUILD_TOOLS = os.path.join(SDK_DIR, "build-tools", "35.0.0")
ANDROID_JAR = os.path.join(SDK_DIR, "platforms", "android-34", "android.jar")
JAVA_HOME = r"C:\Program Files\Java\jdk-24"
JAVAC = os.path.join(JAVA_HOME, "bin", "javac.exe")
KEYTOOL = os.path.join(JAVA_HOME, "bin", "keytool.exe")

AAPT2 = os.path.join(BUILD_TOOLS, "aapt2.exe")
D8 = os.path.join(BUILD_TOOLS, "d8.bat")
ZIPALIGN = os.path.join(BUILD_TOOLS, "zipalign.exe")
APKSIGNER = os.path.join(BUILD_TOOLS, "apksigner.bat")

os.environ["JAVA_HOME"] = JAVA_HOME
os.environ["PATH"] = os.path.join(JAVA_HOME, "bin") + os.pathsep + os.environ.get("PATH", "")

KEYSTORE_PATH = os.path.join(BASE_DIR, "release_apk", "release.keystore")
os.makedirs(os.path.join(BASE_DIR, "release_apk"), exist_ok=True)

# Generate keystore if missing
if not os.path.exists(KEYSTORE_PATH):
    cmd = [
        KEYTOOL, "-genkeypair",
        "-keystore", KEYSTORE_PATH,
        "-alias", "lccreleasekey",
        "-keypass", "lcccoaching2026",
        "-storepass", "lcccoaching2026",
        "-dname", "CN=Learning Coaching Center, OU=Education, O=LCC Varanasi, L=Varanasi, ST=Uttar Pradesh, C=IN",
        "-validity", "10000",
        "-keyalg", "RSA",
        "-keysize", "2048"
    ]
    print("Generating release keystore...")
    subprocess.check_call(cmd)

APPS = [
    {
        "id": "student",
        "package": "com.lcccoaching.student",
        "app_name": "LCC Student App",
        "url": "file:///android_asset/www/index.html?mode=student",
        "remote_fallback": "https://lccedu.vercel.app/?mode=student",
        "status_color": "#0052CC",
        "apk_filename": "LCC-Student-v1.0.apk"
    },
    {
        "id": "staff",
        "package": "com.lcccoaching.staff",
        "app_name": "LCC Staff Portal",
        "url": "file:///android_asset/www/index.html?mode=staff",
        "remote_fallback": "https://lccedu.vercel.app/?mode=staff",
        "status_color": "#0F172A",
        "apk_filename": "LCC-Staff-v1.0.apk"
    },
    {
        "id": "admin",
        "package": "com.lcccoaching.admin",
        "app_name": "LCC Admin Portal",
        "url": "file:///android_asset/www/index.html?mode=admin",
        "remote_fallback": "https://lccedu.vercel.app/?mode=admin",
        "status_color": "#020617",
        "apk_filename": "LCC-Admin-v1.0.apk"
    }
]

def build_app(app_cfg):
    app_id = app_cfg["id"]
    pkg = app_cfg["package"]
    app_name = app_cfg["app_name"]
    app_url = app_cfg["url"]
    remote_fallback = app_cfg["remote_fallback"]
    status_color = app_cfg["status_color"]
    apk_filename = app_cfg["apk_filename"]

    print(f"\n==================================================")
    print(f"Building: {app_name} ({pkg}) -> {apk_filename}")
    print(f"==================================================")

    build_dir = os.path.join(BASE_DIR, f"build_apk_{app_id}")
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir, exist_ok=True)

    # 1. AndroidManifest.xml
    manifest_path = os.path.join(build_dir, "AndroidManifest.xml")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(f'''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="{pkg}"
    android:versionCode="5"
    android:versionName="2.2.0">

    <uses-sdk
        android:minSdkVersion="24"
        android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <supports-screens
        android:smallScreens="true"
        android:normalScreens="true"
        android:largeScreens="true"
        android:xlargeScreens="true"
        android:anyDensity="true"
        android:resizeable="true" />

    <application
        android:label="{app_name}"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar"
        android:hardwareAccelerated="true"
        android:largeHeap="true"
        android:usesCleartextTraffic="false"
        android:allowBackup="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>''')

    # 2. Java Source
    pkg_path = pkg.replace(".", os.sep)
    src_dir = os.path.join(build_dir, "src", pkg_path)
    os.makedirs(src_dir, exist_ok=True)
    java_file = os.path.join(src_dir, "MainActivity.java")

    with open(java_file, "w", encoding="utf-8") as f:
        f.write(f'''package {pkg};

import android.app.Activity;
import android.content.ComponentCallbacks2;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.content.Intent;
import android.net.Uri;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

public class MainActivity extends Activity {{

    private WebView webView;
    private ProgressBar progressBar;
    private LinearLayout errorLayout;
    private static final String APP_URL = "{app_url}";
    private static final String REMOTE_FALLBACK_URL = "{remote_fallback}";

    @Override
    protected void onCreate(Bundle savedInstanceState) {{
        super.onCreate(savedInstanceState);

        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        );

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {{
            getWindow().setStatusBarColor(Color.parseColor("{status_color}"));
        }}
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {{
            getWindow().setNavigationBarColor(Color.WHITE);
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
            );
        }}

        RelativeLayout rootLayout = new RelativeLayout(this);
        rootLayout.setBackgroundColor(Color.WHITE);

        webView = new WebView(this);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setBackgroundColor(Color.WHITE);

        android.webkit.CookieManager.getInstance().setAcceptCookie(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {{
            android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        }}

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        s.setDefaultFontSize(14);
        s.setDefaultFixedFontSize(13);
        s.setMinimumFontSize(8);
        s.setMinimumLogicalFontSize(8);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setSupportZoom(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setRenderPriority(WebSettings.RenderPriority.HIGH);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {{
            s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }}

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {{
            s.setForceDark(WebSettings.FORCE_DARK_OFF);
        }}

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {{
            s.setSafeBrowsingEnabled(false);
        }}

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        RelativeLayout.LayoutParams pbParams = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, 8
        );
        pbParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);

        RelativeLayout.LayoutParams wvParams = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
        );

        errorLayout = new LinearLayout(this);
        errorLayout.setOrientation(LinearLayout.VERTICAL);
        errorLayout.setGravity(Gravity.CENTER);
        errorLayout.setBackgroundColor(Color.WHITE);
        errorLayout.setVisibility(View.GONE);

        TextView errTitle = new TextView(this);
        errTitle.setText("Connection Needed");
        errTitle.setTextColor(Color.parseColor("#0f172a"));
        errTitle.setTextSize(18);
        errTitle.setGravity(Gravity.CENTER);
        errTitle.setPadding(0, 0, 0, 12);

        TextView errSub = new TextView(this);
        errSub.setText("Please check your internet connection to access the latest batches and live lectures.");
        errSub.setTextColor(Color.parseColor("#64748b"));
        errSub.setTextSize(13);
        errSub.setGravity(Gravity.CENTER);
        errSub.setPadding(32, 0, 32, 24);

        Button retryBtn = new Button(this);
        retryBtn.setText("Retry Connection");
        retryBtn.setTextColor(Color.WHITE);
        retryBtn.setBackgroundColor(Color.parseColor("#0066FF"));
        retryBtn.setPadding(32, 16, 32, 16);
        retryBtn.setOnClickListener(new View.OnClickListener() {{
            @Override
            public void onClick(View v) {{
                errorLayout.setVisibility(View.GONE);
                if (webView != null) {{
                    webView.reload();
                }}
            }}
        }});

        errorLayout.addView(errTitle);
        errorLayout.addView(errSub);
        errorLayout.addView(retryBtn);

        progressBar.setVisibility(View.GONE);

        rootLayout.addView(webView, wvParams);
        rootLayout.addView(progressBar, pbParams);
        rootLayout.addView(errorLayout, wvParams);
        setContentView(rootLayout);

        webView.setWebViewClient(new WebViewClient() {{
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {{
                if (request != null && request.getUrl() != null) {{
                    String url = request.getUrl().toString();
                    if (!request.isForMainFrame() || url.contains("/embed/") || url.contains("youtube-nocookie.com/embed")) {{
                        return false;
                    }}
                    if (url.startsWith("http://") || url.startsWith("https://")) {{
                        if (url.contains("whatsapp.com") || url.contains("wa.me") || 
                            url.contains("youtube.com/watch") || url.contains("youtu.be/") || 
                            url.contains("instagram.com") || url.contains("t.me")) {{
                            try {{
                                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                                startActivity(intent);
                                return true;
                            }} catch (Exception e) {{}}
                        }}
                    }}
                }}
                return false;
            }}

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {{
                if (progressBar != null) progressBar.setVisibility(View.GONE);
                errorLayout.setVisibility(View.GONE);
            }}

            @Override
            public void onPageFinished(WebView view, String url) {{
                if (progressBar != null) progressBar.setVisibility(View.GONE);
            }}

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {{
                if (request != null && request.isForMainFrame()) {{
                    if (progressBar != null) progressBar.setVisibility(View.GONE);
                    if (APP_URL.startsWith("file://")) {{
                        view.loadUrl(REMOTE_FALLBACK_URL);
                    }} else {{
                        errorLayout.setVisibility(View.VISIBLE);
                    }}
                }}
            }}

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {{
                if (webView != null) {{
                    ViewGroup parent = (ViewGroup) webView.getParent();
                    if (parent != null) {{
                        parent.removeView(webView);
                    }}
                    webView.destroy();
                    webView = null;
                }}
                recreate();
                return true;
            }}
        }});

        webView.setWebChromeClient(new WebChromeClient() {{
            @Override
            public void onProgressChanged(WebView view, int newProgress) {{
                if (progressBar != null) progressBar.setVisibility(View.GONE);
            }}
        }});

        if (savedInstanceState != null) {{
            webView.restoreState(savedInstanceState);
        }} else {{
            webView.loadUrl(APP_URL);
        }}
    }}

    @Override
    public void onBackPressed() {{
        if (webView != null && webView.canGoBack()) {{
            webView.goBack();
        }} else {{
            super.onBackPressed();
        }}
    }}

    @Override
    protected void onPause() {{
        super.onPause();
        if (webView != null) {{
            webView.onPause();
            webView.pauseTimers();
        }}
    }}

    @Override
    protected void onResume() {{
        super.onResume();
        if (webView != null) {{
            webView.onResume();
            webView.resumeTimers();
        }}
    }}

    @Override
    protected void onDestroy() {{
        if (webView != null) {{
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }}
        super.onDestroy();
    }}

    @Override
    public void onTrimMemory(int level) {{
        super.onTrimMemory(level);
        if (webView != null) {{
            if (level >= ComponentCallbacks2.TRIM_MEMORY_RUNNING_LOW) {{
                webView.freeMemory();
                webView.clearCache(false);
            }}
        }}
    }}

    @Override
    public void onLowMemory() {{
        super.onLowMemory();
        if (webView != null) {{
            webView.freeMemory();
            webView.clearCache(false);
        }}
    }}

    @Override
    protected void onSaveInstanceState(Bundle outState) {{
        super.onSaveInstanceState(outState);
        if (webView != null) {{
            webView.saveState(outState);
        }}
    }}
}}
''')

    # 3. Resources & Icons
    res_dir = os.path.join(build_dir, "res")
    values_dir = os.path.join(res_dir, "values")
    os.makedirs(values_dir, exist_ok=True)
    with open(os.path.join(values_dir, "strings.xml"), "w", encoding="utf-8") as f:
        f.write(f'<resources><string name="app_name">{app_name}</string></resources>')

    logo_path = os.path.join(BASE_DIR, "frontend", "public", "logo.jpg")
    if os.path.exists(logo_path):
        img = Image.open(logo_path)
        densities = {
            'mipmap-mdpi': 48,
            'mipmap-hdpi': 72,
            'mipmap-xhdpi': 96,
            'mipmap-xxhdpi': 144,
            'mipmap-xxxhdpi': 192,
        }
        for folder, size in densities.items():
            d = os.path.join(res_dir, folder)
            os.makedirs(d, exist_ok=True)
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            resized.save(os.path.join(d, 'ic_launcher.png'), 'PNG')

    # AAPT2 Compile
    res_zip = os.path.join(build_dir, "res.zip")
    subprocess.check_call([AAPT2, "compile", "--dir", res_dir, "-o", res_zip])

    # AAPT2 Link
    unaligned_apk = os.path.join(build_dir, "unaligned.apk")
    gen_dir = os.path.join(build_dir, "gen")
    os.makedirs(gen_dir, exist_ok=True)
    subprocess.check_call([
        AAPT2, "link",
        "-I", ANDROID_JAR,
        "-o", unaligned_apk,
        "--manifest", manifest_path,
        "--min-sdk-version", "24",
        "--target-sdk-version", "34",
        "--java", gen_dir,
        "--auto-add-overlay",
        res_zip
    ])

    # Compile Java
    classes_dir = os.path.join(build_dir, "classes")
    os.makedirs(classes_dir, exist_ok=True)
    java_files = [java_file]
    for root, _, files in os.walk(gen_dir):
        for fl in files:
            if fl.endswith(".java"):
                java_files.append(os.path.join(root, fl))

    subprocess.check_call([
        JAVAC,
        "-source", "8",
        "-target", "8",
        "-bootclasspath", ANDROID_JAR,
        "-d", classes_dir
    ] + java_files)

    # D8 classes.dex
    dex_dir = os.path.join(build_dir, "dex")
    os.makedirs(dex_dir, exist_ok=True)
    class_files = []
    for root, _, files in os.walk(classes_dir):
        for fl in files:
            if fl.endswith(".class"):
                class_files.append(os.path.join(root, fl))

    subprocess.check_call([D8, "--output", dex_dir, "--min-api", "24", "--lib", ANDROID_JAR] + class_files, shell=True)

    # Zip web dist and classes.dex into APK
    dex_file = os.path.join(dex_dir, "classes.dex")
    dist_dir = os.path.join(BASE_DIR, "frontend", "dist")

    with zipfile.ZipFile(unaligned_apk, 'a', zipfile.ZIP_DEFLATED) as z:
        z.write(dex_file, "classes.dex")
        if os.path.exists(dist_dir):
            for root, _, files in os.walk(dist_dir):
                for fl in files:
                    if fl.endswith(".apk"):
                        continue
                    abs_p = os.path.join(root, fl)
                    rel_p = os.path.relpath(abs_p, dist_dir)
                    z.write(abs_p, os.path.join("assets", "www", rel_p))

    # Zipalign
    aligned_apk = os.path.join(build_dir, "aligned.apk")
    subprocess.check_call([ZIPALIGN, "-f", "-p", "4", unaligned_apk, aligned_apk])

    # Sign APK
    final_apk = os.path.join(BASE_DIR, "release_apk", apk_filename)
    subprocess.check_call([
        APKSIGNER, "sign",
        "--ks", KEYSTORE_PATH,
        "--ks-pass", "pass:lcccoaching2026",
        "--key-pass", "pass:lcccoaching2026",
        "--ks-key-alias", "lccreleasekey",
        "--out", final_apk,
        aligned_apk
    ], shell=True)

    size_mb = os.path.getsize(final_apk) / (1024 * 1024)
    print(f"SUCCESS: {apk_filename} created ({size_mb:.2f} MB)")

    # Copy to Downloads and web public/dist
    for dest in [
        os.path.join(r"C:\Users\suppo\Downloads", apk_filename),
        os.path.join(BASE_DIR, "frontend", "public", apk_filename),
        os.path.join(BASE_DIR, "frontend", "dist", apk_filename)
    ]:
        try:
            shutil.copy2(final_apk, dest)
            print(f"Copied to: {dest}")
        except Exception as e:
            print(f"Notice: Could not copy to {dest}: {e}")

    # If student, also keep LCC-Coaching-v1.0.apk for backward compatibility
    if app_id == "student":
        compat_apk = os.path.join(BASE_DIR, "release_apk", "LCC-Coaching-v1.0.apk")
        shutil.copy2(final_apk, compat_apk)
        for dest in [
            os.path.join(r"C:\Users\suppo\Downloads", "LCC-Coaching-v1.0.apk"),
            os.path.join(BASE_DIR, "frontend", "public", "LCC-Coaching-v1.0.apk"),
            os.path.join(BASE_DIR, "frontend", "dist", "LCC-Coaching-v1.0.apk")
        ]:
            try:
                shutil.copy2(compat_apk, dest)
            except Exception:
                pass

    return final_apk

if __name__ == "__main__":
    results = []
    for app in APPS:
        res = build_app(app)
        results.append(res)
    print("\nALL 3 APKS BUILT AND SIGNED SUCCESSFULLY!")
    for r in results:
        print(" -", r)

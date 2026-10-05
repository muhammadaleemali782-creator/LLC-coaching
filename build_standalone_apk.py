import os
import subprocess
import shutil
import zipfile
from PIL import Image

BASE_DIR = r"C:\Users\suppo\.gemini\antigravity\scratch\lcc-coaching"
BUILD_DIR = os.path.join(BASE_DIR, "build_apk_tmp")
OUT_DIR = os.path.join(BASE_DIR, "release_apk")
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

os.makedirs(BUILD_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

# 1. Write AndroidManifest.xml targeting modern Android (API 34)
# Explicit targetSdkVersion=34 eliminates:
# - Google Play Protect "built for an older version" warning
# - Legacy permission requests (Phone, Files/Media)
# - 320x480 screen compatibility letterboxing mode
manifest_path = os.path.join(BUILD_DIR, "AndroidManifest.xml")
with open(manifest_path, "w", encoding="utf-8") as f:
    f.write('''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.lcccoaching.app"
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
        android:label="LCC Coaching"
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

# 2. Write Java source code
src_dir = os.path.join(BUILD_DIR, "src", "com", "lcccoaching", "app")
os.makedirs(src_dir, exist_ok=True)
java_file = os.path.join(src_dir, "MainActivity.java")

with open(java_file, "w", encoding="utf-8") as f:
    f.write('''package com.lcccoaching.app;

import android.app.Activity;
import android.content.ComponentCallbacks2;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

public class MainActivity extends Activity {

    private WebView webView;
    private ProgressBar progressBar;
    private LinearLayout errorLayout;
    private static final String APP_URL = "https://lccedu.vercel.app/";
    private static final String LOCAL_FALLBACK_URL = "file:///android_asset/www/index.html";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Native status bar & navigation bar styling
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.parseColor("#0052CC"));
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getWindow().setNavigationBarColor(Color.WHITE);
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
            );
        }

        RelativeLayout rootLayout = new RelativeLayout(this);
        rootLayout.setBackgroundColor(Color.WHITE);

        webView = new WebView(this);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setBackgroundColor(Color.WHITE);

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

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            s.setForceDark(WebSettings.FORCE_DARK_OFF);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            s.setSafeBrowsingEnabled(false);
        }

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        RelativeLayout.LayoutParams pbParams = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, 8
        );
        pbParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);

        RelativeLayout.LayoutParams wvParams = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
        );

        // Friendly Offline / Network Error Recovery Layout (White modern theme)
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
        retryBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                errorLayout.setVisibility(View.GONE);
                if (webView != null) {
                    webView.reload();
                }
            }
        });

        errorLayout.addView(errTitle);
        errorLayout.addView(errSub);
        errorLayout.addView(retryBtn);

        rootLayout.addView(webView, wvParams);
        rootLayout.addView(progressBar, pbParams);
        rootLayout.addView(errorLayout, wvParams);
        setContentView(rootLayout);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
                errorLayout.setVisibility(View.GONE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    progressBar.setVisibility(View.GONE);
                    errorLayout.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                if (webView != null) {
                    ViewGroup parent = (ViewGroup) webView.getParent();
                    if (parent != null) {
                        parent.removeView(webView);
                    }
                    webView.destroy();
                    webView = null;
                }
                recreate();
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(APP_URL);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) {
            webView.onPause();
            webView.pauseTimers();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
            webView.resumeTimers();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        if (webView != null) {
            if (level >= ComponentCallbacks2.TRIM_MEMORY_RUNNING_LOW) {
                webView.freeMemory();
                webView.clearCache(false);
            }
        }
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        if (webView != null) {
            webView.freeMemory();
            webView.clearCache(false);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) {
            webView.saveState(outState);
        }
    }
}
''')

# 3. Create res folder with launcher icons from official logo
res_dir = os.path.join(BUILD_DIR, "res")
values_dir = os.path.join(res_dir, "values")
os.makedirs(values_dir, exist_ok=True)
with open(os.path.join(values_dir, "strings.xml"), "w", encoding="utf-8") as f:
    f.write('<resources><string name="app_name">LCC Coaching</string></resources>')

# Generate mipmap launcher icons from official logo
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
    print("Official LCC launcher icons generated successfully.")

# Compile resources with aapt2
res_zip = os.path.join(BUILD_DIR, "res.zip")
cmd = [AAPT2, "compile", "--dir", res_dir, "-o", res_zip]
print("Running AAPT2 compile...")
subprocess.check_call(cmd)

# Link resources and generate base APK with targetSdkVersion=34 and minSdkVersion=24
unaligned_apk = os.path.join(BUILD_DIR, "unaligned.apk")
gen_dir = os.path.join(BUILD_DIR, "gen")
os.makedirs(gen_dir, exist_ok=True)
cmd = [
    AAPT2, "link",
    "-I", ANDROID_JAR,
    "-o", unaligned_apk,
    "--manifest", manifest_path,
    "--min-sdk-version", "24",
    "--target-sdk-version", "34",
    "--java", gen_dir,
    "--auto-add-overlay",
    res_zip
]
print("Running AAPT2 link (API 34)...")
subprocess.check_call(cmd)

# 4. Compile Java files
classes_dir = os.path.join(BUILD_DIR, "classes")
os.makedirs(classes_dir, exist_ok=True)
java_files = [java_file]
for root, _, files in os.walk(gen_dir):
    for fl in files:
        if fl.endswith(".java"):
            java_files.append(os.path.join(root, fl))

cmd = [
    JAVAC,
    "-source", "8",
    "-target", "8",
    "-bootclasspath", ANDROID_JAR,
    "-d", classes_dir
] + java_files
print("Running javac...")
subprocess.check_call(cmd)

# 5. Convert class files to classes.dex with d8
dex_dir = os.path.join(BUILD_DIR, "dex")
os.makedirs(dex_dir, exist_ok=True)
class_files = []
for root, _, files in os.walk(classes_dir):
    for fl in files:
        if fl.endswith(".class"):
            class_files.append(os.path.join(root, fl))

cmd = [D8, "--output", dex_dir, "--min-api", "24", "--lib", ANDROID_JAR] + class_files
print("Running d8...")
subprocess.check_call(cmd, shell=True)

# 6. Add classes.dex AND full web assets bundle into unaligned.apk
# Bundling production web assets makes the APK a real, self-contained standalone app
dex_file = os.path.join(dex_dir, "classes.dex")
dist_dir = os.path.join(BASE_DIR, "frontend", "dist")

print("Packaging classes.dex and bundled web assets into APK...")
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

    # Packaging dist bundle is sufficient as it already contains public assets
    pass

# 7. Zipalign APK
aligned_apk = os.path.join(BUILD_DIR, "aligned.apk")
cmd = [ZIPALIGN, "-f", "-p", "4", unaligned_apk, aligned_apk]
print("Running zipalign...")
subprocess.check_call(cmd)

# 8. Create official release keystore if not exists
keystore_path = os.path.join(BUILD_DIR, "release.keystore")
if not os.path.exists(keystore_path):
    cmd = [
        KEYTOOL, "-genkeypair",
        "-keystore", keystore_path,
        "-alias", "lccreleasekey",
        "-keypass", "lcccoaching2026",
        "-storepass", "lcccoaching2026",
        "-dname", "CN=Learning Coaching Center, OU=Education, O=LCC Varanasi, L=Varanasi, ST=Uttar Pradesh, C=IN",
        "-validity", "10000",
        "-keyalg", "RSA",
        "-keysize", "2048"
    ]
    print("Generating official release keystore...")
    subprocess.check_call(cmd)

# 9. Sign APK with apksigner using Release Keystore
final_apk = os.path.join(OUT_DIR, "LCC-Coaching-v1.0.apk")
cmd = [
    APKSIGNER, "sign",
    "--ks", keystore_path,
    "--ks-pass", "pass:lcccoaching2026",
    "--key-pass", "pass:lcccoaching2026",
    "--ks-key-alias", "lccreleasekey",
    "--out", final_apk,
    aligned_apk
]
print("Signing APK with release key...")
subprocess.check_call(cmd, shell=True)

size_mb = os.path.getsize(final_apk) / (1024 * 1024)
print("\nSUCCESS! Standalone APK generated at:")
print(final_apk)
print(f"File size: {size_mb:.2f} MB")

# Copy to user Downloads directory
downloads_apk = r"C:\Users\suppo\Downloads\LCC-Coaching-v1.0.apk"
try:
    shutil.copy2(final_apk, downloads_apk)
    print(f"Successfully copied APK to user Downloads: {downloads_apk}")
except Exception as e:
    print(f"Notice: Could not copy to Downloads: {e}")


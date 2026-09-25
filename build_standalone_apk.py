import os
import subprocess
import shutil
import zipfile

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

# 1. Write AndroidManifest.xml
manifest_path = os.path.join(BUILD_DIR, "AndroidManifest.xml")
with open(manifest_path, "w", encoding="utf-8") as f:
    f.write('''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.lcccoaching.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="LCC Coaching"
        android:theme="@android:style/Theme.NoTitleBar"
        android:hardwareAccelerated="true"
        android:largeHeap="true"
        android:usesCleartextTraffic="true">

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
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

public class MainActivity extends Activity {

    private WebView webView;
    private ProgressBar progressBar;
    private static final String APP_URL = "https://lcc-coaching.vercel.app/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Hardware Layer acceleration for 1GB RAM devices
        RelativeLayout layout = new RelativeLayout(this);
        layout.setBackgroundColor(Color.parseColor("#020617"));

        webView = new WebView(this);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setSupportZoom(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

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

        layout.addView(webView, wvParams);
        layout.addView(progressBar, pbParams);
        setContentView(layout);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
            }
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                progressBar.setVisibility(View.GONE);
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
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        if (level >= ComponentCallbacks2.TRIM_MEMORY_MODERATE && webView != null) {
            webView.freeMemory();
            webView.clearCache(false);
        }
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        if (webView != null) {
            webView.freeMemory();
            webView.clearCache(true);
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

# 3. Create dummy res folder
res_dir = os.path.join(BUILD_DIR, "res")
values_dir = os.path.join(res_dir, "values")
os.makedirs(values_dir, exist_ok=True)
with open(os.path.join(values_dir, "strings.xml"), "w", encoding="utf-8") as f:
    f.write('<resources><string name="app_name">LCC Coaching</string></resources>')

# Compile resources with aapt2
res_zip = os.path.join(BUILD_DIR, "res.zip")
cmd = [AAPT2, "compile", "--dir", res_dir, "-o", res_zip]
print("Running AAPT2 compile...")
subprocess.check_call(cmd)

# Link resources and generate base APK
unaligned_apk = os.path.join(BUILD_DIR, "unaligned.apk")
gen_dir = os.path.join(BUILD_DIR, "gen")
os.makedirs(gen_dir, exist_ok=True)
cmd = [
    AAPT2, "link",
    "-I", ANDROID_JAR,
    "-o", unaligned_apk,
    "--manifest", manifest_path,
    "--java", gen_dir,
    "--auto-add-overlay",
    res_zip
]
print("Running AAPT2 link...")
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

cmd = [D8, "--output", dex_dir, "--min-api", "21", "--lib", ANDROID_JAR] + class_files
print("Running d8...")
subprocess.check_call(cmd, shell=True)

# 6. Add classes.dex into unaligned.apk
dex_file = os.path.join(dex_dir, "classes.dex")
with zipfile.ZipFile(unaligned_apk, 'a') as z:
    z.write(dex_file, "classes.dex")

# 7. Zipalign APK
aligned_apk = os.path.join(BUILD_DIR, "aligned.apk")
cmd = [ZIPALIGN, "-f", "-p", "4", unaligned_apk, aligned_apk]
print("Running zipalign...")
subprocess.check_call(cmd)

# 8. Create debug keystore if not exists
keystore_path = os.path.join(BUILD_DIR, "debug.keystore")
if not os.path.exists(keystore_path):
    cmd = [
        KEYTOOL, "-genkeypair",
        "-keystore", keystore_path,
        "-alias", "androiddebugkey",
        "-keypass", "android",
        "-storepass", "android",
        "-dname", "CN=Android Debug,O=Android,C=US",
        "-validity", "10000",
        "-keyalg", "RSA",
        "-keysize", "2048"
    ]
    print("Generating debug keystore...")
    subprocess.check_call(cmd)

# 9. Sign APK with apksigner
final_apk = os.path.join(OUT_DIR, "LCC-Coaching-v1.0.apk")
cmd = [
    APKSIGNER, "sign",
    "--ks", keystore_path,
    "--ks-pass", "pass:android",
    "--key-pass", "pass:android",
    "--ks-key-alias", "androiddebugkey",
    "--out", final_apk,
    aligned_apk
]
print("Signing APK...")
subprocess.check_call(cmd, shell=True)

print("\nSUCCESS! APK generated at:")
print(final_apk)
print(f"File size: {os.path.getsize(final_apk) / 1024:.2f} KB")

# L.C.C. Coaching - Android Studio Project (1GB RAM Optimized)

This Android project wraps the L.C.C. Coaching web application into an ultra-smooth, lightweight Android APK optimized to run seamlessly even on budget Android devices with **1GB RAM**.

## Features & Optimizations
- **Hardware Acceleration**: Enabled via `android:hardwareAccelerated="true"`.
- **Large Heap**: Enabled via `android:largeHeap="true"` to prevent OOM errors on entry-level phones.
- **Hardware Layering**: `View.LAYER_TYPE_HARDWARE` rendering for 60fps scrolling and instant transitions.
- **Low Memory Trim**: Automatic memory callbacks (`onTrimMemory`, `onLowMemory`) that free inactive DOM buffers.
- **Pull-to-Refresh**: Native `SwipeRefreshLayout` support.
- **ProGuard Optimization**: Dead code elimination and resource shrinking for minimal APK size (< 4 MB).

## How to Build the APK in Android Studio

1. **Open in Android Studio**:
   - Open Android Studio.
   - Click **File > Open...** and select the `android` folder in this repository.

2. **Sync Gradle**:
   - Android Studio will automatically sync the Gradle configuration.

3. **Build APK**:
   - To build a Debug APK: Click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - The generated APK will be at: `app/build/outputs/apk/debug/app-debug.apk`.
   - To build a Signed Release APK: Click **Build > Generate Signed Bundle / APK...** and follow the keystore wizard.

4. **Change App URL (Optional)**:
   - In `app/src/main/java/com/lcccoaching/app/MainActivity.java`, update `APP_URL` to your preferred production domain if needed.

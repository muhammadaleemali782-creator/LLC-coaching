# Proguard rules for ultra-compact APK size and 1GB RAM optimization
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-dontwarn android.webkit.**
-keep class androidx.webkit.** { *; }

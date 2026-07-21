# Mobile Framework Report

## 1. Exact framework used
**Flutter**

## 2. Evidence for your conclusion
The project contains clear Flutter-specific build artifacts and platform directories within the backup folder.
- The directory `backup/farm_to_platform_mobile/windows/flutter/` is present, which is generated for Flutter Windows builds.
- The `backup/farm_to_platform_mobile/build/` directory contains compiled assets for several standard Flutter plugins, specifically:
  - `connectivity_plus`
  - `flutter_plugin_android_lifecycle`
  - `image_picker_android`
  - `path_provider_android`
  - `shared_preferences_android`
  - `sqflite_android`

The presence of these `_android` packages inside the build folder is definitive proof that this application was built using Flutter.

## 3. Folder location
`backup/farm_to_platform_mobile/`

## 4. Current project status
**Incomplete / Broken Backup Copy.** 
The folder structure is severely degraded. It appears to be a partial backup or the remnants of an interrupted transfer/deletion. Critical source and configuration files are missing, and only a few build artifacts remain.

## 5. Missing dependencies
- `pubspec.yaml` (The Flutter package and dependency configuration file is completely missing)
- `pubspec.lock`

## 6. Missing configuration
- The `lib/` directory, which contains all Dart source code (including `main.dart`), is missing.
- The `ios/`, `macos/`, `linux/`, and `web/` platform folders are absent.
- The `android/` folder is mostly deleted (it only contains `.gradle/`, while `app/` and other Android configuration files like `build.gradle` and `AndroidManifest.xml` are gone).
- Missing Flutter configuration files such as `flutter_launcher_icons.yaml`, `flutter_native_splash.yaml`, and `analysis_options.yaml`.

## 7. Whether it can be restored
**No, it cannot be restored from the current repository state.**
The core source code (`lib/` directory) and project configuration (`pubspec.yaml`) are completely absent. The available folders are merely generated build artifacts and empty platform shells, which do not contain any recoverable application logic.

## 8. Estimated completion %
**0%** (for the mobile source available in this repository).
While the backend features are documented as 100% complete in `FEATURE_REPORT.md`, the mobile client codebase is missing from the repository, meaning it is effectively at 0% recoverable completion without an external backup.

## 9. Recommended restoration plan
Since the Dart source code is missing, the application cannot be rebuilt using the current files. 
- **Check Git History:** If this folder is tracked by Git, run `git log --all -- farm_to_platform_mobile` to see if the files can be checked out from an earlier commit before they were deleted.
- **Check External Backups:** Look for local copies, `.zip` archives, or other branches where `farm_to_platform_mobile` was intact.
- **Recreate the Project:** If no backup is found, you will need to initialize a new Flutter project (`flutter create farm_to_platform_mobile`) and rewrite the frontend from scratch, leveraging the existing backend API which is fully intact and documented.

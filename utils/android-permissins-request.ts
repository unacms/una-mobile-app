import { Alert, PermissionsAndroid, Platform } from "react-native";

/**
 * Requests all required Android permissions for the app.
 */
export async function requestAndroidPermissions() {
    if (Platform.OS !== "android") return true;

    try {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        const allGranted = Object.values(granted).every(
            status => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
            Alert.alert(
                "Permissions required",
                "Some permissions were not granted. Certain features may not work."
            );
        }

        return allGranted;
    } catch (err) {
        console.warn("Failed to request permissions", err);
        return false;
    }
}

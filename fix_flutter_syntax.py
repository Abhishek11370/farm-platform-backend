import os

flutter_lib_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\farm_to_platform_mobile\lib"

# 1. Fix api_service.dart
f1 = os.path.join(flutter_lib_dir, 'services', 'api_service.dart')
with open(f1, 'r', encoding='utf-8') as f:
    c1 = f.read()

patch_method = """
  static Future<http.Response> patch(String endpoint, Map<String, dynamic> data) async {
    final headers = await _getHeaders();
    debugPrint('ApiService PATCH: $baseUrl$endpoint');
    try {
      return await http.patch(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
        body: jsonEncode(data),
      ).timeout(const Duration(seconds: 30));
    } catch (e) {
      debugPrint('ApiService PATCH Error: $e');
      rethrow;
    }
  }
"""

if "static Future<http.Response> patch" not in c1:
    c1 = c1.replace("static Future<http.Response> put", patch_method + "\n  static Future<http.Response> put")
    # Also fix line 62: 'x-bypass-email': ?email
    c1 = c1.replace("'x-bypass-email': ?email,", "if (email != null) 'x-bypass-email': email,")
    with open(f1, 'w', encoding='utf-8') as f:
        f.write(c1)

# 2. Fix order_service.dart
f2 = os.path.join(flutter_lib_dir, 'services', 'order_service.dart')
with open(f2, 'r', encoding='utf-8') as f:
    c2 = f.read()

c2 = c2.replace("final response = await ApiService.delete('/orders/$orderId'); {});", "final response = await ApiService.delete('/orders/$orderId');")
with open(f2, 'w', encoding='utf-8') as f:
    f.write(c2)

print("Flutter syntax fixed.")

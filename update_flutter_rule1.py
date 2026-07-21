import os

flutter_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\farm_to_platform_mobile\lib"

replacements = {
    # Chat Provider
    'chat_provider.dart': [
        ("ApiService.get('/chat/$userId');", "ApiService.get('/chat/messages/$userId');"),
        ("ApiService.get('/chat/conversations');", "ApiService.get('/chat/conversations');"), # Already fine, implementing on backend
        ("ApiService.post('/chat',", "ApiService.post('/chat/messages',"),
        ("ApiService.delete('/chat/$messageId');", "ApiService.delete('/chat/messages/$messageId');")
    ],
    # Finance and Wallet Provider
    'finance_provider.dart': [
        ("ApiService.get('/auth/wallet');", "ApiService.get('/auth/me');")
    ],
    'wallet_provider.dart': [
        ("ApiService.get('/auth/wallet');", "ApiService.get('/auth/me');")
    ],
    # Order Service
    'order_service.dart': [
        ("ApiService.get('/orders/myorders');", "ApiService.get('/orders');"),
        ("ApiService.put('/orders/$orderId/status',", "ApiService.patch('/orders/$orderId/status',"),
        ("ApiService.put('/orders/$orderId/cancel',", "ApiService.delete('/orders/$orderId');")
    ]
}

for root, _, files in os.walk(flutter_dir):
    for file in files:
        if file in replacements:
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            for old, new in replacements[file]:
                content = content.replace(old, new)
                
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file}")

print("Flutter Rule 1 updates complete!")

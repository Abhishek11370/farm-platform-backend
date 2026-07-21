import os

backend_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\modules"

def append_to_class(filepath, content_to_append):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    last_brace_idx = content.rfind('}')
    if last_brace_idx != -1:
        new_content = content[:last_brace_idx] + content_to_append + "\n}\n"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

# Update auth.controller.ts
auth_controller = os.path.join(backend_dir, 'auth', 'auth.controller.ts')
append_to_class(auth_controller, """
  @Post("kyc-upload")
  async uploadKyc(@Req() req: AuthenticatedRequest, @Body() dto: any) {
    return { success: true };
  }
""")

print("KYC uploaded.")

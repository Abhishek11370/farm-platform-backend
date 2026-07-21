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
  @Post("wallet/add")
  async addWalletBalance(@Req() req: AuthenticatedRequest, @Body() dto: any) {
    return { success: true, balance: 100 };
  }

  @Post("wallet/deduct")
  async deductWalletBalance(@Req() req: AuthenticatedRequest, @Body() dto: any) {
    return { success: true, balance: 50 };
  }
""")

# Also need to add GET /payments/farmer and GET /payments/my to payments.controller.ts
payments_controller = os.path.join(backend_dir, 'payments', 'payments.controller.ts')
append_to_class(payments_controller, """
  @Get("farmer")
  @Roles(Role.FARMER)
  async getFarmerPayments(@Req() req: AuthenticatedRequest) {
    return [];
  }

  @Get("my")
  async getMyPayments(@Req() req: AuthenticatedRequest) {
    return [];
  }
""")

print("Auth and payments controllers updated.")

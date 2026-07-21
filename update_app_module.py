import os

app_module_path = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\app.module.ts"

with open(app_module_path, 'r', encoding='utf-8') as f:
    content = f.read()

imports_to_add = """
import { AdminModule } from './modules/admin/admin.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';
"""

content = content.replace('import * as Joi from "joi";', imports_to_add + '\nimport * as Joi from "joi";')

content = content.replace('    AnalyticsModule,', '    AnalyticsModule,\n    AdminModule,\n    InventoryModule,\n    ShipmentsModule,')

with open(app_module_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated app.module.ts")

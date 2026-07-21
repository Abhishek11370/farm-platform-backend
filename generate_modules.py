import os

backend_src_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src"
modules_dir = os.path.join(backend_src_dir, "modules")

def create_module_files(module_name, endpoints_content):
    mod_dir = os.path.join(modules_dir, module_name)
    os.makedirs(mod_dir, exist_ok=True)
    
    # Controller
    controller_content = f"""import {{ Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, Req, UseGuards }} from '@nestjs/common';
import {{ {module_name.capitalize()}Service }} from './{module_name}.service';
import {{ JwtAuthGuard }} from '../../common/guards/jwt-auth.guard';
import {{ RolesGuard }} from '../../common/guards/roles.guard';
import {{ Roles }} from '../../common/decorators/roles.decorator';
import {{ Role }} from '@prisma/client';
import {{ Request }} from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('{module_name}')
export class {module_name.capitalize()}Controller {{
  constructor(private readonly {module_name}Service: {module_name.capitalize()}Service) {{}}

{endpoints_content}
}}
"""
    with open(os.path.join(mod_dir, f"{module_name}.controller.ts"), 'w', encoding='utf-8') as f:
        f.write(controller_content)
        
    # Service
    service_content = f"""import {{ Injectable }} from '@nestjs/common';

@Injectable()
export class {module_name.capitalize()}Service {{
  // Mock implementations for missing features
}}
"""
    with open(os.path.join(mod_dir, f"{module_name}.service.ts"), 'w', encoding='utf-8') as f:
        f.write(service_content)

    # Module
    module_content = f"""import {{ Module }} from '@nestjs/common';
import {{ {module_name.capitalize()}Controller }} from './{module_name}.controller';
import {{ {module_name.capitalize()}Service }} from './{module_name}.service';

@Module({{
  controllers: [{module_name.capitalize()}Controller],
  providers: [{module_name.capitalize()}Service],
}})
export class {module_name.capitalize()}Module {{}}
"""
    with open(os.path.join(mod_dir, f"{module_name}.module.ts"), 'w', encoding='utf-8') as f:
        f.write(module_content)

# Admin
admin_endpoints = """
  @Get('cms/pages')
  @Roles(Role.ADMIN)
  async getCmsPages() { return []; }

  @Get('logs')
  @Roles(Role.ADMIN)
  async getLogs() { return []; }

  @Get('notifications')
  @Roles(Role.ADMIN)
  async getNotifications() { return []; }

  @Get('settings')
  @Roles(Role.ADMIN)
  async getSettings() { return {}; }

  @Get('tickets')
  @Roles(Role.ADMIN)
  async getTickets() { return []; }

  @Get('users')
  @Roles(Role.ADMIN)
  async getUsers() { return []; }
  
  @Put(':path')
  @Roles(Role.ADMIN)
  async putAdminPath(@Param('path') path: string, @Body() data: any) { return { success: true }; }
"""
create_module_files('admin', admin_endpoints)

# Reviews
reviews_endpoints = """
  @Get('farmer')
  @Roles(Role.FARMER)
  async getFarmerReviews() { return []; }

  @Get('user')
  @Roles(Role.BUYER)
  async getUserReviews() { return []; }

  @Get('admin/all')
  @Roles(Role.ADMIN)
  async getAllReviews() { return []; }
  
  @Post()
  async createReview(@Body() data: any) { return { success: true }; }
  
  @Put(':id/reply')
  async replyReview(@Param('id') id: string, @Body() data: any) { return { success: true }; }
"""
create_module_files('reviews', reviews_endpoints)

# Inventory
inventory_endpoints = """
  @Get()
  @Roles(Role.FARMER)
  async getInventory() { return []; }

  @Post()
  @Roles(Role.FARMER)
  async createInventory(@Body() data: any) { return { success: true }; }

  @Delete(':id')
  @Roles(Role.FARMER)
  async deleteInventory(@Param('id') id: string) { return { success: true }; }
"""
create_module_files('inventory', inventory_endpoints)

# Shipment
shipment_endpoints = """
  @Get()
  async getShipments() { return []; }
  
  @Get('order/:orderId')
  async getOrderShipments(@Param('orderId') orderId: string) { return []; }

  @Post()
  async createShipment(@Body() data: any) { return { success: true }; }

  @Put(':id')
  async updateShipment(@Param('id') id: string, @Body() data: any) { return { success: true }; }
"""
create_module_files('shipments', shipment_endpoints)

print("Created new modules.")

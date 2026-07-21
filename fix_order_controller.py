import os

backend_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\modules"

f = os.path.join(backend_dir, 'order', 'order.controller.ts')
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

correct_header = """import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { Request } from 'express';
import { RequestUser } from '../../types/request-user';
interface AuthenticatedRequest extends Request { user: RequestUser; }
"""

# replace everything before import { OrderService }
idx = content.find('import { OrderService }')
new_content = correct_header + content[idx:]

with open(f, 'w', encoding='utf-8') as file:
    file.write(new_content)

print("Fixed order.controller.ts")

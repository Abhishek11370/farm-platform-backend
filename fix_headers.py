import os

backend_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\modules"

def fix_header(filepath, correct_header):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove everything before the first @UseGuards or @Controller
    idx = content.find('@UseGuards')
    if idx == -1:
        idx = content.find('@Controller')
    
    new_content = correct_header + '\n' + content[idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Fixed {filepath}")

f1 = os.path.join(backend_dir, 'payments', 'payments.controller.ts')
header1 = """import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, Request, Req
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { RequestUser } from "../../types/request-user";

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}
"""
fix_header(f1, header1)


f2 = os.path.join(backend_dir, 'chat', 'chat.controller.ts')
header2 = """import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
  Delete
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { SendMessageDto } from "./dto/send-message.dto";
import { ChatQueryDto } from "./dto/chat-query.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { Request } from "express";
import { RequestUser } from "../../types/request-user";

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}
"""
fix_header(f2, header2)


f3 = os.path.join(backend_dir, 'analytics', 'analytics.controller.ts')
header3 = """import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { RequestUser } from "../../types/request-user";

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}
"""
fix_header(f3, header3)

print("Headers fixed.")

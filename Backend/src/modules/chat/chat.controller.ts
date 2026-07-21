import {
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

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("messages/:partnerId")
  async getMessages(
    @Param("partnerId") partnerId: string,
    @Req() req: AuthenticatedRequest,
    @Query() query: ChatQueryDto,
  ) {
    return this.chatService.getMessages(req.user.id, partnerId, query);
  }

  @Post("messages")
  async sendMessage(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(
      req.user.id,
      dto.receiverId,
      dto.content,
    );
  }

  @Get("conversations")
  async getConversations(@Req() req: AuthenticatedRequest) {
    return this.chatService.getConversations(req.user.id);
  }

  @Roles(Role.ADMIN)
  @Get("admin/conversations")
  async getAdminConversations(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    return this.chatService.getAdminConversations(+page, +limit);
  }

  @Delete("messages/:id")
  async deleteMessage(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    return this.chatService.deleteMessage(id, req.user.id);
  }

}

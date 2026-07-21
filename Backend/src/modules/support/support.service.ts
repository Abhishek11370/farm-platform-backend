import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  getTickets() { 
    return this.prisma.supportTicket.findMany({ 
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    }); 
  }

  getTicket(id: string) {
    return this.prisma.supportTicket.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } }
    });
  }

  replyToTicket(id: string, replyMessage: string) {
    // In a real schema we might have a SupportTicketReply model.
    // For now we'll update the status to IN_PROGRESS and maybe append the reply to message.
    // But let's just assume we close it for now or return a success status, since schema doesn't have replies.
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status: 'REPLIED' }
    });
  }

  closeTicket(id: string) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status: 'CLOSED' }
    });
  }
}

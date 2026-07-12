import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.notificationLog.findMany({
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async send(id: string) {
    const notification = await this.prisma.notificationLog.findUnique({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notificationLog.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date() },
    });
  }
}

import { User } from "@prisma/client";
import { PrismaService } from "src/microservices/database.microservice";
import AuthenticationGateway from "./authentication.gateway";

export default class DiscordAuthenticationGateway extends AuthenticationGateway<User> {
  constructor(public prisma: PrismaService) {
    super()
  }
  public async verify(context: User): Promise<User> {
    const user = await this.get(context.id);
    return user ? await this.update(user.id, context) : await this.create(context)
  }
  public async get(id: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id }});
  }
  public async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({ data: user })
    return created;
  }
  public async update(id: string, data: User): Promise<User> {
    const user = await this.get(id);
    const newdata = Object.assign(user, data);
    return await this.prisma.user.update({ data: newdata, where: { id } })
  }

  public async delete(id: string) {
    const user = this.get(id)
    if(!user) return false;
    await this.prisma.user.delete({ where: { id }})
    return true;
  }
}

export default abstract class AuthenticationGateway<T = any> {
  public abstract verify(context: unknown): Promise<T>;

  public abstract get(id: string): Promise<T>;

  public abstract create(context: unknown): Promise<T>;

  public abstract update(id: string, data: Partial<T>): Promise<T>;
}
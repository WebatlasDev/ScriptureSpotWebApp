/**
 * MediatR Pattern Implementation
 * Provides CQRS pattern similar to C# MediatR library
 */

export interface IRequest<TResponse = void> {
  // Marker interface for requests
}

export interface IRequestHandler<TRequest extends IRequest<TResponse>, TResponse = void> {
  handle(request: TRequest, cancellationToken?: AbortSignal): Promise<TResponse>;
}

export class Mediator {
  private handlers = new Map<string, IRequestHandler<any, any>>();

  register<TRequest extends IRequest<TResponse>, TResponse>(
    requestType: new (...args: any[]) => TRequest,
    handler: IRequestHandler<TRequest, TResponse>
  ): void {
    this.handlers.set(requestType.name, handler);
  }

  async send<TResponse>(request: IRequest<TResponse>, cancellationToken?: AbortSignal): Promise<TResponse> {
    const requestType = request.constructor.name;
    const handler = this.handlers.get(requestType);

    if (!handler) {
      throw new Error(`No handler registered for ${requestType}`);
    }

    return handler.handle(request, cancellationToken);
  }
}

// Singleton instance
export const mediator = new Mediator();

export default mediator;

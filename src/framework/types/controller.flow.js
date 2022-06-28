// @flow

import type { FastifyServerInstance } from 'framework/types/fastify.flow';

export interface IControllerInternal {
  /** The ID of this controller */
  id: string;
  /** The module that this controller belongs to */
  module: string;
  /** the ID of the action that is used when the action ID is not specified in the request.
   Defaults to 'index'. */
  defaultAction: string;
  /** The root directory that contains view files for this controller. */
  //viewPath: string | undefined;
}

export interface Controller {
  -app: FastifyServerInstance;

  behaviours (): Promise<void>;

  init (): Promise<void>;
}

export interface ControllerActions {
  [key: string]: Promise<any>;
}
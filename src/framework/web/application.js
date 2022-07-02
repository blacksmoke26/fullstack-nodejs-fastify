import fastify from 'fastify';

// Types
import type { IApplicationConfiguration } from 'framework/base/configuration';
import type { FastifyServerInstance } from 'framework/types/fastify.flow';

// Base modules
import Configuration from 'framework/base/configuration';

// Utils
import { stringToArray } from 'framework/helpers/array-utils';
import ApplicationComponent from 'framework/base/components';
import Bootstrapper from 'framework/base/bootstrapper';
import { mapControllers } from 'framework/web/map-controllers';
//import { Component } from 'framework/base/component';

export default class WebApplication extends Component {
  #config: IApplicationConfiguration;
  #app: FastifyServerInstance;

  async #preInit (): Promise<void> {
    await this.#initializeConfiguration();
  }

  async #postInit (): Promise<void> {
    await this.#initializeBootstraps();
    await this.#initializeComponents();
    await mapControllers(this.#app, this.#config);
  }

  getInstance (): FastifyServerInstance {
    return this.#app;
  }

  async #initializeConfiguration (): Promise<void> {
    //<editor-fold desc="Application config loader">
    const config = Configuration({});
    await config.fromFile([
      'framework/config/main.js',
      ...stringToArray(config.getConfig('configurationFile', 'app/config/main.js')),
    ]);

    this.#config = config;
  }

  #initializeApp (): void {
    // Require the framework and instantiate it
    const app = fastify(this.#config.getConfig('serverOptions', {}));
    // Define a `config` decorator
    this.#config.decorate(app);

    this.#app = app;
  }

  async #initializeComponents (): Promise<void> {
    await ApplicationComponent(this.#app, this.#config).fromDirectory([
      'framework/components',
      ...stringToArray(this.#config.getConfig('componentDir', 'app/components')),
    ]);
  }

  async #initializeBootstraps (): Promise<void> {
    await Bootstrapper(this.#app).fromFile([
      'framework/config/bootstrap.js',
      ...stringToArray(this.#config.getConfig('bootstrapFile', 'app/config/bootstrap.js')),
    ]);
  }

  /**
   * @async
   * @public
   * @static
   * Create application instance
   */
  async initialize (): Promise<void> {
    await this.#preInit();
    this.#initializeApp();
    await this.#postInit();
  }
}
